import React from 'react';
import { useRouteMatch, useHistory, useLocation } from 'react-router-dom';
import { SimpleGrid, Box, Flex, useToast, Select, FormLabel } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { QueryResult, OperationVariables } from '@apollo/client';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import TxHistoryTable from '../components/TxHistoryTable';
import TokenSelector from '../components/TokenSelector';
import { Fraction } from '@uniswap/sdk';
import SearchInput from '../components/SearchInput';
import StatsTable from '../components/StatsTable';
import AppContext from '../context';
import DateTime from 'luxon/src/datetime.js';
import { tokens as tokenList } from '../tokenLists/optimism.tokenlist.json';
import useGraphQueries from '../hooks/useGraphQueries';
import usePrevious from '../hooks/usePrevious';
import { abis } from '@optimism/common-ui/src/contracts';
import { GET_ALL_SENT_MSGS, GET_SENT_MSGS_BY_ADDRESS, GET_RELAYED_MSGS_BY_HASH_LIST } from '../graphql/subgraph';
import {
  chainIds,
  chainIdLayerMap,
  oppositeChainIdMap,
  txDirection,
  TxDirectionType,
  tokens,
  THE_GRAPH_MAX_INTEGER,
} from '../constants';
import { shortenAddress, decodeSentMessage } from '../helpers';

type TxHistoryProps = { isAdmin?: boolean };

function TxHistory({ isAdmin }: TxHistoryProps) {
  const {
    screenLg,
    screenSm,
    setTokenSelection,
    tokenSelection,
    connectedChainId,
    userAddress,
    isConnecting,
  } = React.useContext(AppContext);
  const [queryParams, setQueryParams] = React.useState<URLSearchParams | undefined>(undefined);
  const { params }: GenericObject = useRouteMatch();
  const toast = useToast();
  const location = useLocation();
  const history = useHistory();
  const [transactions, _setTransactions] = React.useState<Transaction[] | undefined>(undefined);
  const [isFetchingMore, setIsFetchingMore] = React.useState(false);
  const txsLoading = React.useRef(false);
  const [depositAmountPending, setDepositAmountPending] = React.useState('');
  const [withdrawalAmountPending, setWithdrawalAmountPending] = React.useState('');
  const [l1TotalAmt, setl1TotalAmt] = React.useState('');
  const [l2TotalAmt, setl2TotalAmt] = React.useState('');
  const [l1VsL2lDiff, setl1VsL2lDiff] = React.useState<string>('');
  const [totalTxCount, setTotalTxCount] = React.useState(Number.MAX_SAFE_INTEGER); // used for pagination
  const [currentTableView, setCurrentTableView] = React.useState<keyof TxDirectionType>(txDirection.INCOMING);
  const [filterAddress, setFilterAddress] = React.useState(params.address || userAddress);
  const [currentNetwork, setCurrentNetwork] = React.useState(
    connectedChainId === chainIds.KOVAN_L1 || connectedChainId === chainIds.KOVAN_L2 ? 'kovan' : 'mainnet'
  );
  const {
    sentMessagesFromL1,
    sentMessagesFromL2,
    relayedMessagesOnL1,
    relayedMessagesOnL2,
    l1MessageStats,
    l2MessageStats,
  } = useGraphQueries(currentNetwork);
  const [indexTo, setIndexTo] = React.useState(THE_GRAPH_MAX_INTEGER);
  const previousIndexTo = usePrevious(indexTo);

  const setTransactions = (transactions: Transaction[]) => {
    _setTransactions(transactions);
    txsLoading.current = false;
    setIsFetchingMore(false);
  };

  /**
   * Routes to address page if user enters valid address
   */
  const handleAddressSearch = async (address: string) => {
    if (ethers.utils.isAddress(address)) {
      history.push(`/txs/${address}`);
    } else {
      toast({
        title: 'Error',
        description: 'Invalid address',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  const processSentMessage = (
    sentTx: Transaction,
    layer: number,
    relayedTxs: { msgHash: string; txHash: string; timestamp: number }[]
  ) => {
    const tx = { ...sentTx };
    const xDomainInterface = new ethers.utils.Interface(abis.xDomainMessenger);
    const sentMsgHash = ethers.utils.solidityKeccak256(['bytes'], [tx.message]);
    const relayedTx = relayedTxs.find(msg => msg.msgHash === sentMsgHash);

    const [_, toAddress, message] = xDomainInterface.decodeFunctionData('relayMessage', tx.message as ethers.BytesLike);
    const tokenData = tokenList.find(token => token.extensions?.optimismBridgeAddress === toAddress);

    if (tokenData) {
      // TODO: remove these checks when Synthetix updates their bridge to the standard interface
      const bridgeAbiKey = tokenData.symbol === 'SNX' ? 'snxBridge' : 'standardBridge';
      const bridgeInterface = new ethers.utils.Interface(abis[layer === 1 ? 'l2' : 'l1'][bridgeAbiKey]);
      const functionName =
        layer === 2
          ? tokenData.symbol === 'SNX'
            ? 'completeWithdrawal'
            : 'finalizeWithdrawal'
          : tokenData.symbol === 'SNX'
          ? 'completeDeposit'
          : 'finalizeDeposit';
      try {
        const [fromAddress, amount] = bridgeInterface.decodeFunctionData(functionName, message as ethers.BytesLike);
        tx.symbol = tokenData.symbol;
        tx.tokenId = tokens[tokenData.symbol].id;
        tx.iconURL = tokens[tokenData.symbol].iconURL;
        tx.amount = amount;
      } catch (err) {
        if (err.message.includes('does not match function')) {
          console.error(`Unknown function called on ${tokenData.name} contract. ${toAddress}`);
        }
      }
    }

    tx.from = sentTx.from;
    tx.to = decodeSentMessage(tx.message as string)[1];
    tx.timestamp = tx.timestamp * 1000;
    if (layer === 1) {
      tx.layer1Hash = tx.txHash;
      tx.layer2Hash = relayedTx?.txHash;
    } else {
      tx.layer1Hash = relayedTx?.txHash;
      tx.layer2Hash = tx.txHash;
      tx.awaitingRelay =
        !tx.layer1Hash &&
        DateTime.fromMillis(tx.timestamp)
          .plus({ days: 7 })
          .toMillis() < Date.now();
    }
    tx.relayedTxTimestamp = relayedTx && relayedTx.timestamp * 1000;
    return tx;
  };

  const getFilteredRelayedTxs = async ({
    sentMsgTxs,
    relayedMsgTxs,
  }: {
    sentMsgTxs: Transaction[];
    relayedMsgTxs: QueryResult<any, Record<string, any>>;
  }) => {
    const sentMsgHashes = sentMsgTxs.map((msgTx: Transaction) => {
      return ethers.utils.solidityKeccak256(['bytes'], [msgTx.message]);
    });

    const relayedTxs = (
      await relayedMsgTxs.fetchMore({
        query: GET_RELAYED_MSGS_BY_HASH_LIST,
        variables: { searchHashes: sentMsgHashes },
      })
    ).data.relayedMessages;

    return relayedTxs;
  };

  const setPendingAmount = (type: keyof TxDirectionType, transactions: Transaction[]) => {
    const setter = type === txDirection.OUTGOING ? setWithdrawalAmountPending : setDepositAmountPending;
    const amountPending = transactions.reduce((total, tx) => {
      total = total.add(tx.amount as bigint);
      return total;
    }, new Fraction(0 as BigIntIsh));
    setter(amountPending.divide((1e18).toString()).toFixed(2));
    return amountPending;
  };

  /**
   * Token total amounts
   */
  const calculateTotals = React.useCallback(
    async (pendingIn: Fraction, pendingOut: Fraction) => {
      if (!tokenSelection) return;
      const chainId = connectedChainId || 1;

      const oppositeChainId = oppositeChainIdMap[chainId];

      const l1TokenData = tokenList.find(tokenData => {
        const id = chainIdLayerMap[chainId] === 1 ? chainId : oppositeChainId;
        return tokenData.chainId === id && tokenData.symbol === tokenSelection.symbol;
      });
      const l2TokenData = tokenList.find(tokenData => {
        const id = chainIdLayerMap[chainId] === 2 ? chainId : oppositeChainId;
        return tokenData.chainId === id && tokenData.symbol === tokenSelection.symbol;
      });

      if (l1TokenData && l2TokenData) {
        const l1Provider = new JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`);
        const l2Provider = new JsonRpcProvider(`https://mainnet.optimism.io`);

        const l1TokenContract = new Contract(l1TokenData.address as string, abis.erc20, l1Provider);
        const l2TokenContract = new Contract(l2TokenData.address as string, abis.erc20, l2Provider);

        const l1TotalAmt = new Fraction(await l1TokenContract.balanceOf(l1TokenData.extensions.optimismBridgeAddress));
        const l2TotalAmt = new Fraction(await l2TokenContract.totalSupply());

        const diff = l1TotalAmt
          .add(pendingIn)
          .subtract(l2TotalAmt)
          .subtract(pendingOut);
        setl1VsL2lDiff(diff.divide((1e18).toString()).toFixed(2));
        setl1TotalAmt(l1TotalAmt.divide((1e18).toString()).toFixed(2));
        setl2TotalAmt(l2TotalAmt.divide((1e18).toString()).toFixed(2));
      }
    },
    [connectedChainId, tokenSelection]
  );

  /**
   * Change network initiated by user so they can see the history of kovan even if not connected via their wallet
   */
  const handleChangeNetwork = (e: React.FormEvent<HTMLSelectElement>) => {
    const target = e.target as HTMLSelectElement;
    setCurrentNetwork(target.value);
  };

  /** Sets network (needed for fresh page load) */
  React.useEffect(() => {
    const network =
      connectedChainId === chainIds.KOVAN_L1 || connectedChainId === chainIds.KOVAN_L2 ? 'kovan' : 'mainnet';
    setCurrentNetwork(network);
  }, [connectedChainId]);

  /**
   * Fetches transactions
   */
  React.useEffect(() => {
    (async () => {
      if (queryParams && l1MessageStats.data && l2MessageStats.data && !txsLoading.current) {
        if (isAdmin && tokenSelection) {
          // TODO: get this working again
          // calculateStats();
        } else {
          // only fetch if both the chainId & address exist, or both are null
          if ((connectedChainId && filterAddress) || (!connectedChainId && !filterAddress)) {
            if (previousIndexTo !== indexTo) {
              setIsFetchingMore(true);
            } else {
              txsLoading.current = true;
            }
            await fetchTransactions({ indexTo: THE_GRAPH_MAX_INTEGER });
          }
        }
      }

      async function fetchTransactions({ direction: _dir }: { indexTo: number; direction?: keyof TxDirectionType }) {
        if (!l1MessageStats.data || !l2MessageStats.data || !queryParams) return;
        const direction = _dir || queryParams.get('dir') || txDirection.INCOMING;
        let txs: Transaction[] = [];

        if (direction === txDirection.INCOMING) {
          // fetch all INCOMING txs (not just deposits)
          txs = await processPageOfxDomainTxs({
            layer: 1,
            sentMessages: sentMessagesFromL1,
            totalMessageCount: l1MessageStats.data.messageStats.sentMessageCount,
          });
        } else if (direction === txDirection.OUTGOING) {
          // fetch all OUTGOING txs (not just withdrawals)
          txs = await processPageOfxDomainTxs({
            layer: 2,
            sentMessages: sentMessagesFromL2,
            totalMessageCount: l2MessageStats.data.messageStats.sentMessageCount,
          });
        }
        setTransactions(txs);
      }

      async function processPageOfxDomainTxs({
        layer,
        sentMessages,
        totalMessageCount,
      }: {
        layer: number;
        sentMessages: QueryResult<any, OperationVariables>;
        totalMessageCount: number;
      }) {
        setIsFetchingMore(true);
        setTotalTxCount(totalMessageCount);

        const sentMsgTxs = (
          await sentMessages.fetchMore({
            query: filterAddress ? GET_SENT_MSGS_BY_ADDRESS : GET_ALL_SENT_MSGS,
            variables: {
              indexTo,
              address: filterAddress,
            },
          })
        ).data.sentMessages;

        const relayedTxs = await getFilteredRelayedTxs({
          sentMsgTxs,
          relayedMsgTxs: layer === 1 ? relayedMessagesOnL2 : relayedMessagesOnL1,
        });

        const txs = sentMsgTxs.map((tx: Transaction) => processSentMessage(tx, layer, relayedTxs));
        return txs;
      }
    })();
  }, [
    indexTo,
    queryParams,
    sentMessagesFromL1,
    relayedMessagesOnL2,
    relayedMessagesOnL1,
    sentMessagesFromL2,
    l1MessageStats.data,
    l2MessageStats.data,
    tokenSelection,
    connectedChainId,
    isAdmin,
    currentTableView,
    filterAddress,
    currentNetwork,
    previousIndexTo,
  ]);

  /**
   * Sets query params object
   */
  React.useEffect(() => {
    if (!queryParams && location && setTokenSelection) {
      const params = new URLSearchParams(location.search.slice(1));
      const token = params.get('token');
      const dir = params.get('dir');
      setCurrentTableView((dir as keyof TxDirectionType) || txDirection.INCOMING);

      if (token) {
        setTokenSelection(tokens[token]);
      }
      setQueryParams(params);
    }
  }, [location, queryParams, setTokenSelection]);

  /**
   * Update filterAddress
   */
  React.useEffect(() => {
    const newFilterAddress = params.address || userAddress;
    if (newFilterAddress !== filterAddress) {
      setFilterAddress(newFilterAddress);
    }
  }, [filterAddress, params.address, userAddress]);

  return (
    <Box mt={24}>
      {/* {isAdmin && (
        <>
          <Flex justifyContent="space-between">
            <TokenSelector handleTokenSelection={handleTokenSelection} tokenSymbol={tokenSelection?.symbol || ''} />
            {tokenSelection && (
              <StatsTable
                depositAmountPending={depositAmountPending}
                withdrawalAmountPending={withdrawalAmountPending}
                l2TotalAmt={l2TotalAmt}
                l1TotalAmt={l1TotalAmt}
                l1VsL2lDiff={l1VsL2lDiff}
                tokenSelection={tokenSelection || tokens.SNX}
              />
            )}
          </Flex>
        </>
      )} */}
      <Box d="flex" alignItems={screenLg ? 'flex-end' : 'flex-start'} flexDir={screenLg ? 'row' : 'column-reverse'}>
        <SearchInput handleAddressSearch={handleAddressSearch} />
        {!filterAddress && !isConnecting && (
          <Box mb="4" ml={screenLg ? 8 : 0}>
            <FormLabel opacity="0.7">Network</FormLabel>
            <Select onChange={handleChangeNetwork} value={currentNetwork}>
              <option value="mainnet">Mainnet</option>
              <option value="kovan">Kovan</option>
            </Select>
          </Box>
        )}
        {filterAddress && filterAddress !== userAddress && (
          <SimpleGrid
            ml={screenLg ? 8 : 0}
            opacity={0.8}
            columns={2}
            spacingX={4}
            d="inline-grid"
            gridTemplateColumns="repeat(2, minmax(0, min-content))"
            mb={5}
            fontSize="1.2rem"
          >
            <Box as="span" mr={1} fontWeight="400">
              ADDRESS:
            </Box>
            <Box>{screenSm ? filterAddress : shortenAddress(filterAddress, 4)}</Box>
          </SimpleGrid>
        )}
      </Box>
      <TxHistoryTable
        filterAddress={filterAddress}
        key={filterAddress}
        currentTableView={currentTableView}
        setCurrentTableView={setCurrentTableView}
        setDepositAmountPending={setDepositAmountPending}
        setWithdrawalAmountPending={setWithdrawalAmountPending}
        setl1TotalAmt={setl1TotalAmt}
        setl2TotalAmt={setl2TotalAmt}
        queryParams={queryParams}
        transactions={transactions}
        txsLoading={txsLoading.current}
        isFetchingMore={isFetchingMore}
        totalTxCount={totalTxCount}
        currentNetwork={currentNetwork}
        setIndexTo={setIndexTo}
      />
    </Box>
  );
}

export default TxHistory;

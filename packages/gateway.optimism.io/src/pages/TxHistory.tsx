import React from 'react';
import JSBI from 'jsbi';
import { useRouteMatch, useHistory, useLocation } from 'react-router-dom';
import { SimpleGrid, Box, Flex, useToast } from '@chakra-ui/react';
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
import { tokens as tokenList } from '../tokenLists/optimismTokenList.json';
import useGraphQueries from '../hooks/useGraphQueries';
import { abis } from '../contracts';
import { GET_ALL_SENT_MSGS, GET_SENT_MSGS_BY_ADDRESS, GET_RELAYED_MSGS_BY_HASH_LIST } from '../graphql/subgraph';
import {
  chainIds,
  chainIdLayerMap,
  oppositeChainIdMap,
  txDirection,
  TxDirectionType,
  tokens,
  THE_GRAPH_MAX_INTEGER,
  FETCH_LIMIT,
} from '../constants';
import { shortenAddress, decodeSentMessage } from '../helpers';

type TxHistoryProps = { isAdmin?: boolean };

const l1Provider = new JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`);
const l2Provider = new JsonRpcProvider(`https://mainnet.optimism.io`);

function TxHistory({ isAdmin }: TxHistoryProps) {
  const { screenLg, screenSm, setTokenSelection, tokenSelection, connectedChainId, userAddress } = React.useContext(
    AppContext
  );
  const [queryParams, setQueryParams] = React.useState<URLSearchParams | undefined>(undefined);
  const { params }: GenericObject = useRouteMatch();
  const toast = useToast();
  const location = useLocation();
  const history = useHistory();
  const [transactions, _setTransactions] = React.useState<Transaction[] | undefined>(undefined);
  const [isFetchingMore, setIsFetchingMore] = React.useState(false);
  const [txsLoading, setTxsLoading] = React.useState(false);
  const [depositAmountPending, setDepositAmountPending] = React.useState('');
  const [withdrawalAmountPending, setWithdrawalAmountPending] = React.useState('');
  const [l1TotalAmt, setl1TotalAmt] = React.useState('');
  const [l2TotalAmt, setl2TotalAmt] = React.useState('');
  const [l1VsL2lDiff, setl1VsL2lDiff] = React.useState<string>('');
  const [totalTxCount, setTotalTxCount] = React.useState(Number.MAX_SAFE_INTEGER); // used for pagination
  const [currentTableView, setCurrentTableView] = React.useState<keyof TxDirectionType>();
  const [filterAddress, setFilterAddress] = React.useState(params.address || userAddress);
  const {
    sentMessagesFromL1,
    sentMessagesFromL2,
    relayedMessagesOnL1,
    relayedMessagesOnL2,
    l1MessageStats,
    l2MessageStats,
  } = useGraphQueries(filterAddress, connectedChainId);
  const network =
    connectedChainId === chainIds.KOVAN_L1 || connectedChainId === chainIds.KOVAN_L2 ? 'kovan' : 'mainnet';

  const setTransactions = (transactions: Transaction[]) => {
    _setTransactions(transactions);
    setTxsLoading(false);
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
        position: 'bottom-right',
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
      tx.awaitingRelay = !tx.layer1Hash && DateTime.fromMillis(tx.timestamp).plus({ days: 7 }).toMillis() < Date.now();
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

  const handleTokenSelection = async (e: React.FormEvent<HTMLSelectElement>) => {
    if (!setTokenSelection) return;

    const target = e.target as HTMLSelectElement;
    if (!queryParams) return;
    const tokenSymbol = target.value;
    if (tokenSymbol) {
      queryParams.set('token', tokenSymbol);
    } else {
      queryParams.delete('token');
      setTokenSelection(undefined);
    }
    history.push({
      search: queryParams.toString(),
    });
    const token = tokens[tokenSymbol];
    setTokenSelection(token);
    calculateStats();
  };

  const processPageOfxDomainTxs = React.useCallback(
    async ({
      layer,
      sentMessages,
      totalMessageCount,
      indexTo = THE_GRAPH_MAX_INTEGER,
    }: {
      layer: number;
      sentMessages: QueryResult<any, OperationVariables>;
      totalMessageCount: number;
      indexTo?: number;
    }) => {
      setIsFetchingMore(true);
      setTotalTxCount(totalMessageCount);
      const address = filterAddress;

      const sentMsgTxs = (
        await sentMessages.fetchMore({
          query: address ? GET_SENT_MSGS_BY_ADDRESS : GET_ALL_SENT_MSGS,
          variables: {
            indexTo,
            address,
          },
        })
      ).data.sentMessages;

      const relayedTxs = await getFilteredRelayedTxs({
        sentMsgTxs,
        relayedMsgTxs: layer === 1 ? relayedMessagesOnL2 : relayedMessagesOnL1,
      });

      const txs = sentMsgTxs.map((tx: Transaction) => processSentMessage(tx, layer, relayedTxs));
      setTransactions(txs);
      return txs;
    },
    [relayedMessagesOnL1, relayedMessagesOnL2, filterAddress]
  );

  const fetchTransactions = React.useCallback(
    async ({
      page,
      indexTo: _indexTo,
      direction = currentTableView,
    }: {
      page?: string;
      indexTo?: number;
      direction?: keyof TxDirectionType;
    }) => {
      if (!l1MessageStats.data || !l2MessageStats.data) return;
      let txs: Transaction[] = [];
      let indexTo = _indexTo;

      if (!page) {
        // If no page specified, this is the first fetch
        setTxsLoading(true);
      } else {
        setIsFetchingMore(true);
      }

      if (!indexTo) {
        const firstTxIndex = (transactions?.length && transactions[0].index) || THE_GRAPH_MAX_INTEGER;
        const lastTxIndex = (transactions?.length && transactions[transactions.length - 1].index) || 0;

        // If page isn't specified, start from the start of the list
        indexTo =
          !page || !transactions
            ? THE_GRAPH_MAX_INTEGER
            : page === 'prev'
            ? firstTxIndex + FETCH_LIMIT + 1
            : lastTxIndex;
      }

      if (direction === txDirection.INCOMING) {
        // fetch all INCOMING txs (not just deposits)
        txs = await processPageOfxDomainTxs({
          layer: 1,
          sentMessages: sentMessagesFromL1,
          totalMessageCount: l1MessageStats.data.messageStats.sentMessageCount,
          indexTo,
        });
      } else if (direction === txDirection.OUTGOING) {
        // fetch all OUTGOING txs (not just withdrawals)
        txs = await processPageOfxDomainTxs({
          layer: 2,
          sentMessages: sentMessagesFromL2,
          totalMessageCount: l2MessageStats.data.messageStats.sentMessageCount,
          indexTo,
        });
      }
      setIsFetchingMore(false);
      return txs;
    },
    [
      transactions,
      currentTableView,
      l1MessageStats.data,
      l2MessageStats.data,
      processPageOfxDomainTxs,
      sentMessagesFromL1,
      sentMessagesFromL2,
    ]
  );

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
        const l1TokenContract = new Contract(l1TokenData.address as string, abis.erc20, l1Provider);
        const l2TokenContract = new Contract(l2TokenData.address as string, abis.erc20, l2Provider);

        const l1TotalAmt = new Fraction(await l1TokenContract.balanceOf(l1TokenData.extensions.optimismBridgeAddress));
        const l2TotalAmt = new Fraction(await l2TokenContract.totalSupply());

        const diff = l1TotalAmt.add(pendingIn).subtract(l2TotalAmt).subtract(pendingOut);
        setl1VsL2lDiff(diff.divide((1e18).toString()).toFixed(2));
        setl1TotalAmt(l1TotalAmt.divide((1e18).toString()).toFixed(2));
        setl2TotalAmt(l2TotalAmt.divide((1e18).toString()).toFixed(2));
      }
    },
    [connectedChainId, tokenSelection]
  );

  // fetches batches of 100 txs each in descending timestamp order until we reach the completed txs
  const calculateStats = React.useCallback(async () => {
    let pendingIn: Fraction = new Fraction(JSBI.BigInt(0));
    let pendingOut: Fraction = new Fraction(JSBI.BigInt(0));
    const allUncompletedTxs: Transaction[] = [];
    for (const direction of [txDirection.INCOMING, txDirection.OUTGOING]) {
      let more = true;
      let indexTo = THE_GRAPH_MAX_INTEGER;
      while (more) {
        const txsBatch = (await fetchTransactions({ indexTo, direction })) || [];
        if (!txsBatch.length) {
          more = false;
        }
        for (const tx of txsBatch) {
          // if both hashes are present, this is a completed tx
          if (tx.layer1Hash && tx.layer2Hash) {
            more = false;
            break;
          } else if (tx.amount) {
            allUncompletedTxs.push(tx);
          }
        }
        indexTo = txsBatch.length ? txsBatch[txsBatch.length - 1].index : THE_GRAPH_MAX_INTEGER;
      }
      const value = setPendingAmount(direction, allUncompletedTxs);
      if (direction === txDirection.INCOMING) {
        pendingIn = value;
      } else {
        pendingOut = value;
      }
    }
    calculateTotals(pendingIn, pendingOut);
  }, [calculateTotals, fetchTransactions]);

  /**
   * Fetches on initial page load
   */
  React.useEffect(() => {
    (async () => {
      if (queryParams && l1MessageStats.data && l2MessageStats.data && !transactions && !txsLoading) {
        if (isAdmin && tokenSelection) {
          calculateStats();
        } else {
          fetchTransactions({});
        }
      }
    })();
  }, [
    queryParams,
    sentMessagesFromL1,
    relayedMessagesOnL2,
    relayedMessagesOnL1,
    sentMessagesFromL2,
    processPageOfxDomainTxs,
    l1MessageStats.data,
    l2MessageStats.data,
    tokenSelection,
    connectedChainId,
    txsLoading,
    transactions,
    isAdmin,
    calculateStats,
    fetchTransactions,
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
   * Fetch if currently filtering by an address
   */
  React.useEffect(() => {
    if (params.address || userAddress) {
      const newFilterAddress = params.address || userAddress;
      if (newFilterAddress !== filterAddress) {
        setFilterAddress(newFilterAddress);
        fetchTransactions({});
      }
    }
  }, [fetchTransactions, filterAddress, params.address, userAddress]);

  const currentNetworkLayer =
    network === 'kovan'
      ? currentTableView === txDirection.INCOMING
        ? 'Kovan'
        : 'Optimism Kovan'
      : network === 'mainnet'
      ? currentTableView === txDirection.OUTGOING
        ? 'Optimism'
        : 'Mainnet'
      : '';

  return (
    <Box mt={24}>
      {isAdmin && (
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
      )}
      <Box d="flex" alignItems={screenLg ? 'flex-end' : 'flex-start'} flexDir={screenLg ? 'row' : 'column'}>
        <SearchInput handleAddressSearch={handleAddressSearch} />
        {filterAddress && filterAddress !== userAddress && (
          <SimpleGrid
            ml={8}
            opacity={0.8}
            columns={2}
            spacingX={4}
            d="inline-grid"
            gridTemplateColumns="repeat(2, minmax(0, min-content))"
            pb={4}
          >
            <Box mr={1} fontWeight="400">
              NETWORK:
            </Box>
            <Box>{currentNetworkLayer}</Box>
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
        fetchTransactions={fetchTransactions}
        transactions={transactions}
        txsLoading={txsLoading}
        isFetchingMore={isFetchingMore}
        totalTxCount={totalTxCount}
      />
    </Box>
  );
}

export default TxHistory;

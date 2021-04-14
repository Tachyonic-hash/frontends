import React from 'react';
import JSBI from 'jsbi';
import { Watcher } from '@eth-optimism/watcher';
import { useRouteMatch, useHistory, useLocation } from 'react-router-dom';
import { SimpleGrid, Box, Flex, Select, FormLabel } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import TxHistoryTable from '../components/TxHistoryTable';
import TokenSelector from '../components/TokenSelector';
import { Fraction } from '@uniswap/sdk';
import SearchInput from '../components/SearchInput';
import StatsTable from '../components/StatsTable';
import AppContext from '../context';
import useToast from '../hooks/useToast';
import DateTime from 'luxon/src/datetime.js';
import { tokens as tokenList } from '../tokenLists/optimism.tokenlist.json';
import { abis } from '../contracts';
import {
  chainIds,
  chainIdLayerMap,
  oppositeChainIdMap,
  txDirection,
  TxDirectionType,
  tokens,
  l1ETHGatewayAddress,
} from '../constants';
import { shortenAddress, getNetwork } from '../helpers';

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
  const location = useLocation();
  const history = useHistory();
  const { showErrorToast, toast } = useToast();
  const [transactions, _setTransactions] = React.useState<Transaction[] | undefined>(undefined);
  const [isFetchingMore, setIsFetchingMore] = React.useState(false);
  const [txsLoading, setTxsLoading] = React.useState(false);
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
        position: 'bottom-left',
      });
    }
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
    async ({ layer }: { layer: number }) => {
      if (!connectedChainId) {
        console.error('Wallet not connected');
        return;
      }
      setIsFetchingMore(true);
      const address = filterAddress;

      const FETCH_SIZE = 1000;
      const l1Provider = new JsonRpcProvider(`https://mainnet.infura.io/v3/063d984ab22c4deb9984c46335a848c0`);
      const l2Provider = new JsonRpcProvider(`http://3.142.35.15:8545`);

      const watcher = new Watcher({
        l1: {
          provider: l1Provider,
          messengerAddress: '0xfBE93ba0a2Df92A8e8D40cE00acCF9248a6Fc812',
        },
        l2: {
          provider: l2Provider,
          messengerAddress: '0x4200000000000000000000000000000000000007',
        },
      });

      (async () => {
        const network = getNetwork(connectedChainId);
        // ETH bridge addresses
        const l1BridgeAddress = l1ETHGatewayAddress[network];
        if (!l1BridgeAddress) {
          showErrorToast('Unkown network. Please connect to Mainnet, Optimism, Kovan, or Kovan Optimism.');
          return;
        }
        const l2BridgeAddress = '0x4D7186818daBFe88bD80421656BbD07Dffc979Cc';
        const l1BridgeContract = new Contract(l1BridgeAddress, abis.l1.standardBridge, l1Provider);
        const l2BridgeContract = new Contract(l2BridgeAddress, abis.l2.standardBridge, l2Provider);

        try {
          const withdrawals = await getTxHistory({
            provider: l2Provider,
            bridgeAddress: l2BridgeAddress,
            eventFilter: l2BridgeContract.filters.WithdrawalInitiated,
            eventSignature: 'WithdrawalInitiated(address,uint256)',
          });
          console.log(withdrawals);
        } catch (err) {
          console.error(err);
        }

        async function getTxHistory({ type, provider, eventFilter }: any) {
          const history = [];

          try {
            const currentBlock = await provider.getBlockNumber();
            // const currentBlock = 21634;
            let toBlock = currentBlock;
            let fromBlock = toBlock - FETCH_SIZE;
            while (fromBlock > 0) {
              try {
                const logs = await provider.getLogs({
                  ...eventFilter(),
                  fromBlock,
                  toBlock,
                });
                const events = await processLogs({ logs, provider, type });
                history.push(events);
                toBlock = fromBlock - 1;
                fromBlock = fromBlock - FETCH_SIZE;
                console.log('waiting 1 second\n');
              } catch (err) {
                console.error(err);
              }
              await new Promise(res => setTimeout(res, 1000));
            }
          } catch (err) {
            console.error(err);
          }
        }

        async function processLogs({ logs, provider, type }: any) {
          try {
            const events = await Promise.all(
              logs.map(async (l: any) => {
                const block = await provider.getBlock(l.blockNumber);
                const { args } = l2BridgeContract.interface.parseLog(l);
                const initiatedTime = Number(block.timestamp * 1000);
                return {
                  initiatedTime,
                  account: args.account,
                  amount: args.amount.toString(),
                  l2TransactionHash: l.transactionHash,
                };
              })
            );
            return await Promise.all(
              events.map(async (event: any) => {
                try {
                  const msgHashes = await watcher.getMessageHashesFromL2Tx(event.l2TransactionHash);
                  const receipt = await watcher.getL1TransactionReceipt(msgHashes[0], false);
                  const eventObj = {
                    ...event,
                    type,
                    status: receipt?.transactionHash ? 'COMPLETE' : 'PENDING',
                    l1TransactionHash: receipt?.transactionHash,
                    completedTime: receipt?.timestamp,
                  };

                  return eventObj;
                } catch (err) {
                  console.error(err);
                }
              })
            );
          } catch (err) {
            console.error(err);
          }
        }
      })();

      // TODO: get txs using getLogs
      const txs: Transaction[] = [];
      setTransactions(txs);
      return txs;
    },
    [connectedChainId, filterAddress, showErrorToast]
  );

  const fetchTransactions = React.useCallback(
    async ({ page, direction: _dir }: { page?: string; direction?: keyof TxDirectionType }) => {
      if (!queryParams) return;
      const direction = _dir || queryParams.get('dir') || txDirection.INCOMING;
      let txs: Transaction[] | undefined = [];

      if (!page) {
        // If no page specified, this is the first fetch
        setTxsLoading(true);
      } else {
        setIsFetchingMore(true);
      }

      if (direction === txDirection.INCOMING) {
        // fetch all INCOMING txs (not just deposits)
        txs = await processPageOfxDomainTxs({
          layer: 1,
        });
      } else if (direction === txDirection.OUTGOING) {
        // fetch all OUTGOING txs (not just withdrawals)
        txs = await processPageOfxDomainTxs({
          layer: 2,
        });
      }
      setIsFetchingMore(false);
      return txs;
    },
    [processPageOfxDomainTxs, queryParams]
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

  // fetches batches of 100 txs each in descending timestamp order until we reach the completed txs
  const calculateStats = React.useCallback(async () => {
    let pendingIn: Fraction = new Fraction(JSBI.BigInt(0));
    let pendingOut: Fraction = new Fraction(JSBI.BigInt(0));
    const allUncompletedTxs: Transaction[] = [];
    for (const direction of [txDirection.INCOMING, txDirection.OUTGOING]) {
      let more = true;
      while (more) {
        const txsBatch = (await fetchTransactions({ direction })) || [];
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
   * Change network initiated by user so they can see the history of kovan even if not connected via their wallet
   */
  const handleChangeNetwork = (e: React.FormEvent<HTMLSelectElement>) => {
    const target = e.target as HTMLSelectElement;
    setCurrentNetwork(target.value);
    fetchTransactions({});
  };

  /** Sets network (needed for fresh page load) */
  React.useEffect(() => {
    const network =
      connectedChainId === chainIds.KOVAN_L1 || connectedChainId === chainIds.KOVAN_L2 ? 'kovan' : 'mainnet';
    setCurrentNetwork(network);
  }, [connectedChainId]);
  /**
   * Sets filter address
   */
  React.useEffect(() => {
    setFilterAddress(userAddress);
  }, [userAddress]);

  /**
   * Fetches on initial page load
   */
  React.useEffect(() => {
    (async () => {
      if (queryParams && !transactions && !txsLoading) {
        if (isAdmin && tokenSelection) {
          calculateStats();
        } else {
          fetchTransactions({});
        }
      }
    })();
  }, [
    queryParams,
    processPageOfxDomainTxs,
    tokenSelection,
    connectedChainId,
    txsLoading,
    transactions,
    isAdmin,
    calculateStats,
    fetchTransactions,
    currentTableView,
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
  }, [currentTableView, fetchTransactions, filterAddress, params.address, userAddress]);

  /**
   * Fetch if changing view from incoming <> outgoing txs
   */
  React.useEffect(() => {
    (async () => {
      const txs = await fetchTransactions({});
      setTransactions(txs as Transaction[]);
    })();
  }, [currentTableView, fetchTransactions]);

  const currentNetworkLayer =
    currentNetwork === 'kovan'
      ? currentTableView === txDirection.INCOMING
        ? 'Kovan'
        : 'Kovan Optimism'
      : currentNetwork === 'mainnet'
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
            {/* <Box mr={1} fontWeight="400">
              NETWORK:
            </Box>
            <Box>{currentNetworkLayer}</Box> */}
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

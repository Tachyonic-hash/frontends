import React from 'react';
import { Switch, Route, useHistory, useLocation } from 'react-router-dom';
import DateTime from 'luxon/src/datetime.js';
import { Fraction } from '@uniswap/sdk';
import { ethers } from 'ethers';
import { Box, Button, Container, useColorMode, Heading, useToast, Flex } from '@chakra-ui/react';
import { useQuery, useLazyQuery } from '@apollo/client';
import SearchInput from './components/SearchInput';
import TxHistoryTable from './components/TxHistory';
import StatsTable from './components/StatsTable';
import AddressView from './components/AddressView';
import clients from './graphql/clients';
import { getDeposits, getWithdrawals, GET_SENT_MESSAGES, GET_RELAYED_MESSAGES, GET_STATS } from './graphql/subgraph';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { abis, addresses } from '@project/contracts';
import { panels } from './constants';

// test address: 0x5A34F25040ba6E12daeA0512D4D2a0043ECc9292

const l1Provider = new JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`);
const l2Provider = new JsonRpcProvider(`https://mainnet.optimism.io`);

const snxL1Contract = new Contract(addresses.l1.SNX.token, abis.SynthetixL1Token, l1Provider);
const snxL2Contract = new Contract(addresses.l2.SNX.token, abis.SynthetixL2Token, l2Provider);

function App() {
  const { colorMode, toggleColorMode } = useColorMode();
  const history = useHistory();
  const [currentTableView, setCurrentTableView] = React.useState(0);
  const location = useLocation();
  const [price, setPrice] = React.useState(0);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [deposits, setDeposits] = React.useState();
  const [withdrawals, setWithdrawals] = React.useState();
  const [tokensPendingDeposit, setTokensPendingDeposit] = React.useState();
  const [tokensPendingWithdrawal, setTokensPendingWithdrawal] = React.useState();
  const [l1TotalAmt, setl1TotalAmt] = React.useState();
  const [l2TotalAmt, setl2TotalAmt] = React.useState();
  const [l1VsL2WithdrawalDiff, setl1VsL2WithdrawalDiff] = React.useState(0);
  const [l1VsL2DepositDiff, setl1VsL2DepositDiff] = React.useState(0);
  const [depositsLoading, setDepositsLoading] = React.useState(false);
  const [withdrawalsLoading, setWithdrawalsLoading] = React.useState(false);
  const [depositsPageIdx, setDepositsPageIdx] = React.useState(0);
  const [withdrawalsPageIdx, setWithdrawalsPageIdx] = React.useState(0);
  const depositsInitiated = useQuery(getDeposits(), {
    client: clients.l1,
    notifyOnNetworkStatusChange: true,
  });
  const withdrawalsInitiated = useQuery(getWithdrawals(), {
    client: clients.l2,
    notifyOnNetworkStatusChange: true,
  });
  const sentMessagesFromL1 = useQuery(GET_SENT_MESSAGES, {
    client: clients.l1,
    skip: true,
  });
  const sentMessagesFromL2 = useQuery(GET_SENT_MESSAGES, {
    client: clients.l2,
    skip: true,
  });
  const relayedMessagesOnL1 = useQuery(GET_RELAYED_MESSAGES, { client: clients.l1, skip: true });
  const relayedMessagesOnL2 = useQuery(GET_RELAYED_MESSAGES, { client: clients.l2, skip: true });
  const depositStats = useQuery(GET_STATS, {
    client: clients.l1,
  });
  const withdrawalStats = useQuery(GET_STATS, {
    client: clients.l2,
  });
  const toast = useToast();

  /**
   * Routes to address page if user enters valid address
   */
  const handleAddressSearch = async address => {
    if (ethers.utils.isAddress(address)) {
      history.push(`/a/${address}`);
    } else {
      toast({
        title: 'Error',
        description: 'Invalid address',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const refreshTransactions = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    await withdrawalsInitiated.refetch();
    setIsRefreshing(false);
  };

  const processDeposits = async ({ rawDeposits, sentMessagesFromL1 }) => {
    let deposits = rawDeposits.map(rawTx => {
      const tx = { ...rawTx };
      tx.amount = ethers.utils.formatEther(tx.amount);
      tx.address = tx.account;
      tx.layer1Hash = tx.hash;
      tx.timestamp = tx.timestamp * 1000;
      // const sentMessage = sentMessagesFromL1.data.sentMessages.find(msg => msg.hash === tx.layer2Hash);
      // const l2MsgHash = ethers.utils.solidityKeccak256(['bytes'], [sentMessage.message]);
      // const l2Data = relayedMessagesOnL1.data.relayedMessages.find(msg => msg.msgHash === l2MsgHash);
      // tx.layer2Hash = l2Data?.hash;
      // tx.otherLayerTimestamp = l2Data && l2Data.timestamp * 1000;
      return tx;
    });
    return deposits.sort((a, b) => b.timestamp - a.timestamp);
  };

  const processWithdrawals = React.useCallback(
    async ({ rawWithdrawals }) => {
      // retrieve relevant messages based on this batch of tx timestamps
      const withdrawalHashes = rawWithdrawals.map(tx => tx.hash);
      const currentSentMsgs = (
        await sentMessagesFromL2.fetchMore({
          variables: { searchHashes: withdrawalHashes },
        })
      ).data.sentMessages;

      const l1MsgHashes = currentSentMsgs.map(msgTx => ethers.utils.solidityKeccak256(['bytes'], [msgTx.message]));
      console.log(l1MsgHashes);
      const currentRelayedMsgs = (
        await relayedMessagesOnL1.fetchMore({
          variables: { searchHashes: l1MsgHashes },
        })
      ).data.relayedMessages;
      console.log(currentRelayedMsgs);

      // let withdrawals = rawWithdrawals.map(rawTx => {
      //   const tx = { ...rawTx };
      //   tx.amount = ethers.utils.formatEther(tx.amount);
      //   tx.address = tx.account;
      //   tx.layer2Hash = tx.hash;
      //   tx.timestamp = tx.timestamp * 1000;
      //   const sentMessage = currentSentMsgs.find(msgTx => msgTx.hash === tx.hash);
      //   const l1MsgHash = ethers.utils.solidityKeccak256(['bytes'], [sentMessage.message]);
      //   const l1Data = relayedMessagesOnL1.find(msg => msg.msgHash === l1MsgHash);
      //   tx.layer1Hash = l1Data?.hash;
      //   tx.awaitingRelay =
      //     !tx.layer1Hash &&
      //     DateTime.fromMillis(tx.timestamp)
      //       .plus({ days: 7 })
      //       .toMillis() < Date.now();
      //   tx.otherLayerTimestamp = l1Data && l1Data.timestamp * 1000;
      //   delete tx.hash;
      //   return tx;
      // });
      // return withdrawals.sort((a, b) => b.timestamp - a.timestamp);
    },
    [relayedMessagesOnL1, sentMessagesFromL2]
  );

  const fetchTransactions = React.useCallback(
    async viewIdx => {
      if (viewIdx === panels.DEPOSITS) {
        const timestampTo = depositsInitiated.data.deposits[depositsInitiated.data.deposits.length - 1].timestamp;
        const more = await depositsInitiated.fetchMore({
          variables: {
            timestampTo: timestampTo,
          },
          query: getDeposits(timestampTo),
          updateQuery: (prev, { fetchMoreResult }) => {
            return Object.assign(prev, fetchMoreResult);
          },
        });
        const deposits = await processDeposits({
          rawDeposits: more.data.deposits,
          // sentMessagesFromL1: sentMessagesFromL1.data.sentMessages,
          // relayedMessagesOnL2: relayedMessagesOnL2.data.relayedMessages,
        });
        setDeposits(deposits);
      } else if (viewIdx === panels.WITHDRAWALS) {
        const timestampTo =
          withdrawalsInitiated.data.withdrawals[withdrawalsInitiated.data.withdrawals.length - 1].timestamp;
        const more = await withdrawalsInitiated.fetchMore({
          variables: {
            timestampTo: timestampTo,
          },
          query: getWithdrawals(timestampTo),
          updateQuery: (prev, { fetchMoreResult }) => {
            return Object.assign(prev, fetchMoreResult);
          },
        });
        const withdrawals = await processWithdrawals({
          rawWithdrawals: more.data.withdrawals,
        });
        setWithdrawals(withdrawals);
      }
    },
    [depositsInitiated, withdrawalsInitiated, processWithdrawals]
  );

  React.useEffect(() => {
    if (currentTableView === panels.DEPOSITS) {
      setDepositsLoading(!deposits);
    } else if (currentTableView === panels.WITHDRAWALS) {
      setWithdrawalsLoading(!withdrawals);
    }
  }, [currentTableView, deposits, depositsLoading, withdrawals]);

  React.useEffect(() => {
    (async () => {
      if (
        currentTableView === panels.DEPOSITS &&
        !deposits &&
        depositsInitiated.data &&
        relayedMessagesOnL2.data &&
        sentMessagesFromL1.data
      ) {
        // const deposits = await processDeposits({
        //   rawDeposits: depositsInitiated.data.deposits,
        //   sentMessagesFromL1: sentMessagesFromL1.data.sentMessages,
        //   relayedMessagesOnL2: relayedMessagesOnL2.data.relayedMessages,
        // });
        setDeposits(deposits);
      }
    })();
  }, [
    currentTableView,
    deposits,
    depositsInitiated.data,
    relayedMessagesOnL2,
    relayedMessagesOnL2.data,
    sentMessagesFromL1.data,
  ]);

  React.useEffect(() => {
    (async () => {
      if (currentTableView === panels.WITHDRAWALS && !withdrawals && withdrawalsInitiated.data) {
        const withdrawals = await processWithdrawals({
          rawWithdrawals: withdrawalsInitiated.data.withdrawals,
        });
        setWithdrawals(withdrawals);
      }
    })();
  }, [setWithdrawals, currentTableView, withdrawalsInitiated.data, withdrawals, processWithdrawals]);

  React.useEffect(() => {
    (async () => {
      const l1TotalAmt = ethers.utils.formatEther(await snxL1Contract.balanceOf(addresses.l1.SNX.bridge));
      const l2TotalAmt = ethers.utils.formatEther(await snxL2Contract.totalSupply());

      setl1TotalAmt(l1TotalAmt);
      setl2TotalAmt(l2TotalAmt);
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      if (!withdrawals || !price) return;

      const pendingAmt = withdrawals.reduce((total, tx) => {
        return !tx.layer1Hash ? total + +tx.amount : total;
      }, 0);

      setl1VsL2WithdrawalDiff((+l1TotalAmt - +l2TotalAmt - pendingAmt).toFixed(2));
    })();
  }, [l1TotalAmt, l2TotalAmt, price, withdrawals]);

  // Fetches SNX price every 10 seconds
  React.useEffect(() => {
    setInterval(() => {
      fetch(`https://api.coingecko.com/api/v3/simple/price?ids=havven&vs_currencies=usd`)
        .then(res => res.json())
        .then(data => {
          setPrice(data.havven.usd);
        })
        .catch(console.error);
    }, 10000);
  }, []);

  React.useEffect(() => {
    if (withdrawalStats?.data?.stats) {
      let total = new Fraction(withdrawalStats?.data?.stats.total);
      total = total.divide((1e18).toString()).toFixed(2);
      setTokensPendingWithdrawal(total);
    }
  }, [price, withdrawalStats]);

  React.useEffect(() => {
    if (depositStats?.data?.stats) {
      let total = new Fraction(depositStats?.data?.stats.total);
      total = total.divide((1e18).toString()).toFixed(2);
      setTokensPendingDeposit(total);
    }
  }, [depositStats, price]);

  // console.log(withdrawalsInitiated?.data?.withdrawals);

  return (
    <>
      <Container maxW={'1400px'} py={4}>
        <Box d="flex" justifyContent="flex-end">
          {/* <Button borderRadius="100%" ml={4} p={0} onClick={toggleColorMode}>
            {colorMode === 'light' ? '🌜' : '🌞'}
          </Button> */}
        </Box>
        <Heading as="h1" size="xl" textAlign="center" mb={16} mt={16}>
          OΞ SNX Tracker
        </Heading>
        <Flex mb={16} w="600px" mx="auto">
          {/* <SearchInput handleAddressSearch={handleAddressSearch} /> */}
          <StatsTable
            price={price}
            tokensPending={currentTableView === panels.WITHDRAWALS ? tokensPendingWithdrawal : tokensPendingDeposit}
            l2TotalAmt={l2TotalAmt}
            l1TotalAmt={l1TotalAmt}
            l1VsL2WithdrawalDiff={l1VsL2WithdrawalDiff}
            transactionType={currentTableView === panels.WITHDRAWALS ? 'withdrawals' : 'deposits'}
          />
        </Flex>
        <Switch>
          <Route path="/a/:address">
            {/* <AddressView
              contracts={contracts}
              price={price}
              deposits={deposits}
              withdrawals={withdrawals}
              isRefreshing={isRefreshing}
              refreshTransactions={refreshTransactions}
              getPastEvents={getPastEvents}
              l1Provider={l1Provider}
              l2Provider={l2Provider}
              watcher={watcher}
              setWithdrawals={setWithdrawals}
              setWithdrawalsLoading={setWithdrawalsLoading}
              withdrawalsLoading={withdrawalsLoading}
            /> */}
          </Route>
          <Route exact path="/">
            <TxHistoryTable
              deposits={deposits}
              withdrawals={withdrawals}
              depositsLoading={depositsLoading}
              withdrawalsLoading={withdrawalsLoading}
              setCurrentTableView={setCurrentTableView}
              fetchMore={fetchTransactions}
              // isLoadingMore={isLoadingMore}
              price={price}
              refreshTransactions={refreshTransactions}
              isRefreshing={isRefreshing}
              // moreWithdrawalsToLoad={l2FromBlockNum > 0}
              // moreDepositsToLoad={l1FromBlockNum > SNX_BRIDGE_DEPLOY_BLOCK_NUMBER}
            />
          </Route>
        </Switch>
      </Container>
    </>
  );
}

export default App;

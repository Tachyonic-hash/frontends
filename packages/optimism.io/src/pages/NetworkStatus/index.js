import React from 'react';
import * as Sentry from '@sentry/browser';
import { Integrations } from '@sentry/tracing';
import { Box, Stack, useMediaQuery } from '@chakra-ui/react';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import Container from '../../components/Container';
import { PageHeader } from '../../components/Headers';
import NetworkCard from '../../components/NetworkCard';
import { abis } from '@optimism/common-ui/src/contracts';
import { Watcher } from '@eth-optimism/watcher';

Sentry.init({
  dsn:
    'https://0a16716bdc71460bb45ac8965c2eed45@o568345.ingest.sentry.io/5733974',
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0
});

const KOVAN_STC_ADDRESS = '0x41f707A213FB83010586860f81A4BF2F0FEbe56D';
const KOVAN_L1_MESSENGER_ADDRESS = '0x48062eD9b6488EC41c4CfbF2f568D7773819d8C9';
const MAINNET_STC_ADDRESS = '0x1D0C46671E0696a4Ba800032D5195d5b0f8c60A3';
const MAINNET_L1_MESSENGER_ADDRESS =
  '0xD1EC7d40CCd01EB7A305b94cBa8AB6D17f6a9eFE';

const kovanL1Rpc = new JsonRpcProvider(
  `https://kovan.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`
);
const kovanL2Rpc = new JsonRpcProvider(`https://kovan.optimism.io`);
const mainnetL1Rpc = new JsonRpcProvider(
  `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`
);
const mainnetL2Rpc = new JsonRpcProvider(`https://mainnet.optimism.io`);

const kovanWatcher = new Watcher({
  l1: {
    provider: kovanL1Rpc,
    messengerAddress: KOVAN_L1_MESSENGER_ADDRESS
  },
  l2: {
    provider: kovanL2Rpc,
    messengerAddress: '0x4200000000000000000000000000000000000007'
  }
});
const mainnetWatcher = new Watcher({
  l1: {
    provider: mainnetL1Rpc,
    messengerAddress: MAINNET_L1_MESSENGER_ADDRESS
  },
  l2: {
    provider: mainnetL2Rpc,
    messengerAddress: '0x4200000000000000000000000000000000000007'
  }
});

const kovanStateCommitChain = new Contract(
  KOVAN_STC_ADDRESS,
  abis.l1.OVM_StateCommitmentChain,
  kovanL1Rpc
);

const mainnetStateCommitChain = new Contract(
  MAINNET_STC_ADDRESS,
  abis.l1.OVM_StateCommitmentChain,
  mainnetL1Rpc
);

const kovanL1Messenger = new Contract(
  KOVAN_L1_MESSENGER_ADDRESS,
  abis.xDomainMessenger,
  kovanL1Rpc
);

const mainnetL1Messenger = new Contract(
  MAINNET_L1_MESSENGER_ADDRESS,
  abis.xDomainMessenger,
  mainnetL1Rpc
);

const SLOW_BATCHES_ERROR = 'Withdrawals may be delayed.';
const BORKED_BATCHES_ERROR = 'Our batch submitter service seems to be down.';
export const networkStates = {
  ALL_GRAVY: '😎',
  SKETCH: '🥲',
  BORKED: '😪'
};

function NetworkStatus() {
  const [smallScreen] = useMediaQuery('(max-width: 900px)');
  const [mainnetCondition, setMainnetCondition] = React.useState(null);
  const [kovanCondition, setKovanCondition] = React.useState(null);
  const [
    mainnetMillisSinceLastBatch,
    setMainnetMillisSinceLastBatch
  ] = React.useState(0);
  const [
    kovanMillisSinceLastBatch,
    setKovanMillisSinceLastBatch
  ] = React.useState(0);
  const [mainnetErrorMessage, setMainnetErrorMessage] = React.useState('');
  const [kovanErrorMessage, setKovanErrorMessage] = React.useState('');

  React.useEffect(() => {
    mainnetL2Rpc
      .getBlockNumber()
      .then(async () => {
        // WITHDRAWALS
        const millisSinceLastBatch = await getMillisSinceLastBatch(
          mainnetStateCommitChain,
          mainnetL2Rpc
        );
        setMainnetMillisSinceLastBatch(millisSinceLastBatch);

        const moreThan8HoursAgo = millisSinceLastBatch > 28_800_000;
        const moreThan2pt5HoursAgo = millisSinceLastBatch > 9_000_000;

        if (moreThan2pt5HoursAgo) {
          setMainnetCondition(condition => {
            return condition || moreThan8HoursAgo
              ? networkStates.BORKED
              : moreThan2pt5HoursAgo
              ? networkStates.SKETCH
              : networkStates.ALL_GRAVY;
          });
          setMainnetErrorMessage(
            moreThan8HoursAgo
              ? SLOW_BATCHES_ERROR
              : moreThan2pt5HoursAgo
              ? BORKED_BATCHES_ERROR
              : ''
          );
          return;
        } else {
          setMainnetCondition(networkStates.ALL_GRAVY);
        }

        // DEPOSITS
        const depositsDelayed = await checkIfDepositsDelayed({
          provider: mainnetL1Rpc,
          messengerContract: mainnetL1Messenger,
          watcher: mainnetWatcher
        });
        if (depositsDelayed) {
          setMainnetCondition(networkStates.BORKED);
          setMainnetErrorMessage('Deposits are currently delayed.');
        }
      })
      .catch(err => {
        console.error(err);
        Sentry.captureEvent(err);
      });
    kovanL2Rpc
      .getBlockNumber()
      .then(async () => {
        // WITHDRAWALS
        const millisSinceLastBatch = await getMillisSinceLastBatch(
          kovanStateCommitChain,
          kovanL2Rpc
        );
        setKovanMillisSinceLastBatch(millisSinceLastBatch);

        const moreThan1HourAgo = millisSinceLastBatch > 3_600_000;
        const moreThan15MinAgo = millisSinceLastBatch > 54_000_000;

        if (moreThan15MinAgo) {
          setKovanCondition(condition => {
            return condition || moreThan1HourAgo
              ? networkStates.BORKED
              : moreThan15MinAgo
              ? networkStates.SKETCH
              : networkStates.ALL_GRAVY;
          });
          setKovanErrorMessage(
            moreThan15MinAgo
              ? SLOW_BATCHES_ERROR
              : moreThan1HourAgo
              ? BORKED_BATCHES_ERROR
              : ''
          );
          return;
        } else {
          setKovanCondition(networkStates.ALL_GRAVY);
        }

        // DEPOSITS
        const depositsDelayed = await checkIfDepositsDelayed({
          provider: kovanL1Rpc,
          messengerContract: kovanL1Messenger,
          watcher: kovanWatcher
        });
        if (depositsDelayed) {
          setKovanCondition(networkStates.BORKED);
          setKovanErrorMessage('Deposits are currently delayed.');
        }
      })
      .catch(err => {
        console.error(err);
        Sentry.captureEvent(err);
      });

    setTimeout(() => {
      setMainnetCondition(condition => condition || networkStates.BORKED);
      setKovanCondition(condition => condition || networkStates.BORKED);
    }, 5000);

    const getMillisSinceLastBatch = async (stateCommitChain, provider) => {
      try {
        const lastTimestamp = await stateCommitChain.getLastSequencerTimestamp();
        if (lastTimestamp) {
          return Date.now() - lastTimestamp * 1000;
        }
      } catch (err) {
        Sentry.captureException(err);
      }
    };

    const checkIfDepositsDelayed = async ({
      provider,
      messengerContract,
      watcher
    }) => {
      const l1BlockNum = await provider.getBlockNumber();
      try {
        const filters = messengerContract.filters.SentMessage();
        const logs = await provider.getLogs({
          ...filters,
          fromBlock: l1BlockNum - 6000
        });
        const latestTx = logs[logs.length - 1];
        const latestTxTime = (await provider.getBlock(latestTx?.blockNumber))
          ?.timestamp;

        if (!latestTxTime)
          throw Error("Provider didn't return data from getBlock call");

        const msgHashes = await watcher.getMessageHashesFromL1Tx(
          latestTx.transactionHash,
          false
        );

        const receipt = await watcher.getL2TransactionReceipt(
          msgHashes[0],
          false
        );

        // return true if it has been over 15 min since tx was sent from l1
        return !receipt && Date.now() - latestTxTime * 1000 > 15 * 60 * 1000;
      } catch (err) {
        console.error(err);
        Sentry.captureEvent(err);
      }
    };
  }, []);

  return (
    <Container>
      <PageHeader mb={16}>Network Status</PageHeader>
      <Box>
        <Stack
          spacing={smallScreen ? 8 : 24}
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <NetworkCard
            network={'Optimistic Mainnet'}
            networkCondition={mainnetCondition}
            smallScreen={smallScreen}
            millisSinceLastBatch={mainnetMillisSinceLastBatch}
            errorMessage={mainnetErrorMessage}
          />
          <NetworkCard
            network={'Optimistic Kovan'}
            networkCondition={kovanCondition}
            smallScreen={smallScreen}
            millisSinceLastBatch={kovanMillisSinceLastBatch}
            errorMessage={kovanErrorMessage}
          />
        </Stack>
      </Box>
    </Container>
  );
}

export default NetworkStatus;

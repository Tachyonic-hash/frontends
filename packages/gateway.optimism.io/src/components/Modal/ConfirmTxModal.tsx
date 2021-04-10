import React from 'react';
import { ethers } from 'ethers';
import DateTime from 'luxon/src/datetime.js';
import { Heading, Text, Table, Tbody, Tr, Td, Thead, Th, Link, Divider, Box } from '@chakra-ui/react';
import DisclaimerContent from '../DisclaimerContent';
import ModalTxTable from './ModalTxTable';
import AppContext from '../../context';
import OptimismButton from '../OptimismButton';
import { formatUSD, formatNumber, getRpcProviders } from '../../helpers';

const RELAY_WITHDRAWAL_GAS_COST = 600_000;

function ConfirmTxModal({ type }: { type: string }) {
  const { handleWithdraw, handleDeposit, inputValue, prices, connectedChainId, contracts } = React.useContext(
    AppContext
  );
  const [l1GasFee, setL1GasFee] = React.useState('0');
  const [l2GasFee, setL2GasFee] = React.useState('0');

  React.useEffect(() => {
    if (!getRpcProviders) return;
    (async () => {
      try {
        const [rpcL1, rpcL2] = await getRpcProviders(connectedChainId || 0);

        const l1GasPrice = await rpcL1.getGasPrice();

        const l1GasFee = ethers.utils.formatEther(l1GasPrice.mul(RELAY_WITHDRAWAL_GAS_COST));
        setL1GasFee(l1GasFee);

        const l2GasPrice = await rpcL2.getGasPrice();
        const l2GasAmount = await contracts?.l2.estimateGas.withdraw(ethers.utils.parseUnits(inputValue || '0', 18));
        setL2GasFee(l2GasPrice.mul(l2GasAmount).toString());
      } catch (err) {
        console.error(err);
      }
    })();
  }, [connectedChainId, contracts, inputValue]);

  const timeDelay = DateTime.fromMillis(Date.now() + 6.048e8).toLocaleString(DateTime.DATETIME_MED);

  return (
    <Box>
      <Heading size="xl" mt={0} mb={4}>
        {type === 'deposit' ? 'Confirm deposit' : 'Initiate withdrawal'}
      </Heading>
      <ModalTxTable type={type} l2GasFee={l2GasFee} />
      <Divider mt={6} />
      {type === 'withdrawal' ? (
        <>
          <Text mt={6} mb={2}>
            Your withdrawal will become claimable on:
          </Text>
          <Text mb={4} fontSize="1.6rem">
            {timeDelay}{' '}
            <Box as="sup" fontSize="1rem">
              †
            </Box>
          </Text>
          <Text mt={8} mb={2}>
            Current gas cost to claim your withdrawal:
          </Text>
          {prices && (
            <Text mb={8} fontSize="1.6rem">
              {formatNumber(l1GasFee)} ETH ({formatUSD(+l1GasFee * prices.ethereum)}){' '}
              <Box as="sup" fontSize="1rem">
                ‡
              </Box>
            </Text>
          )}

          <Text fontSize="xs">
            <Box as="span" fontSize="1rem">
              *
            </Box>{' '}
            This is the lowest fee that will be accepted by the Optimism sequencer. Setting it lower will make the
            transaction fail.
          </Text>
          <Text my={2} fontSize="xs">
            <Box as="span" fontSize="1rem">
              †
            </Box>{' '}
            All withdrawals are delayed for one week before they can be claimed. This is to ensure there is ample time
            to detect fraud.
            <br />
            <Link
              isExternal={true}
              href="http://community.optimism.io/faqs/#why-is-there-a-delay-when-moving-assets-from-optimistic-ethereum-to-ethereum"
            >
              Learn more here
            </Link>
            .
          </Text>
          <Text mt={2} fontSize="xs">
            <Box as="span" fontSize="1rem">
              ‡
            </Box>{' '}
            Because of the week-long delay, this cost may be different when your withdrawal becomes claimable.
          </Text>
        </>
      ) : (
        <Box mt={8}>
          <DisclaimerContent />
        </Box>
      )}

      <OptimismButton
        variant={null}
        size="huge"
        onClick={type === 'withdrawal' ? handleWithdraw : handleDeposit}
        textTransform="uppercase"
        mt={8}
      >
        {type === 'withdrawal' ? 'Withdraw' : 'Deposit'}
      </OptimismButton>
    </Box>
  );
}

export default ConfirmTxModal;

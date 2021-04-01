import React from 'react';
import { ethers } from 'ethers';
import DateTime from 'luxon/src/datetime.js';
import { Heading, Text, Table, Tbody, Tr, Td, Thead, Th, Link, Divider, Box } from '@chakra-ui/react';
import DisclaimerContent from '../DisclaimerContent';
import AppContext from '../../context';
import OptimismButton from '../OptimismButton';
import { formatUSD, formatNumber, getRpcProviders } from '../../helpers';

const RELAY_WITHDRAWAL_GAS_COST = 600_000;

const Cell = (props: any) => {
  const { children, ...rest } = props;
  return (
    <Td px={1} py={2} {...rest}>
      {children}
    </Td>
  );
};

function ConfirmTxModal({ type }: { type: string }) {
  const { handleWithdraw, handleDeposit, inputValue, prices, screenMd, connectedChainId, contracts } = React.useContext(
    AppContext
  );
  const [l1GasFee, setL1GasFee] = React.useState('0');
  const [l2GasFee, setL2GasFee] = React.useState('0');

  React.useEffect(() => {
    if (!getRpcProviders) return;
    (async () => {
      const [rpcL1, rpcL2] = getRpcProviders(connectedChainId || 0);

      const l1GasPrice = await rpcL1.getGasPrice();

      const l1GasFee = ethers.utils.formatEther(l1GasPrice.mul(RELAY_WITHDRAWAL_GAS_COST));
      setL1GasFee(l1GasFee);

      const l2GasPrice = await rpcL2.getGasPrice();
      const l2GasAmount = await contracts?.l2.estimateGas.withdraw(ethers.utils.parseUnits(inputValue || '0', 18));
      setL2GasFee(l2GasPrice.mul(l2GasAmount).toString());
    })();
  }, [connectedChainId, contracts, getRpcProviders, inputValue]);

  const timeDelay = DateTime.fromMillis(Date.now() + 6.048e8).toLocaleString(DateTime.DATETIME_MED);

  return (
    <Box>
      <Heading size="xl" mt={0} mb={8}>
        {type === 'deposit' ? 'Confirm deposit' : 'Initiate withdrawal'}
      </Heading>
      <Table columns={3} variant="unstyled" mb={6}>
        <Thead>
          <Tr>
            <Th w="22%" p={0} />
            <Th w="42%" p={0} />
            <Th w="32%" p={0} />
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Cell textOverflow="ellipsis" overflow="hidden" whiteSpace="pre">
              Amount:{' '}
            </Cell>
            <Cell d="flex" justifyContent="space-between">
              <Text textOverflow="ellipsis" overflow="hidden" whiteSpace="pre">
                {formatNumber(inputValue || 0)}
              </Text>
              <Text ml={2}>ETH</Text>
            </Cell>
            {prices && <Cell textAlign="right">{formatUSD(Number(inputValue) * prices.ethereum)}</Cell>}
          </Tr>
          {type === 'withdrawal' && (
            <Tr>
              <Cell>Gas: </Cell>
              <Cell d="flex" justifyContent="space-between">
                <Text textOverflow="ellipsis" overflow="hidden" whiteSpace="pre">
                  {formatNumber(l2GasFee)}
                </Text>
                <Text ml={2}>ETH</Text>
              </Cell>
              {prices && (
                <Cell textAlign="right" pos="relative">
                  {formatUSD(+l2GasFee * prices?.ethereum)}{' '}
                  <Box as="span" top="5px" position="absolute" fontSize="1rem">
                    *
                  </Box>
                </Cell>
              )}
            </Tr>
          )}
        </Tbody>
      </Table>
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
          <Text mt={2} mb={8} fontSize="xs">
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

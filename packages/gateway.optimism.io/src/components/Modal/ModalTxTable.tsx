import React from 'react';
import { Text, Box, Spinner } from '@chakra-ui/react';
import AppContext from '../../context';
import { formatUSD, formatNumber } from '../../helpers';

function ModalTxTable({ l2GasFee, type }: { l2GasFee?: string; type?: string }) {
  const { inputValue, prices } = React.useContext(AppContext);

  return (
    <Box columns={3} mb={8} fontSize={'1.6rem'}>
      <Text mb={2} textAlign="left" fontSize={'1rem'}>
        Amount
      </Text>
      <Box d="flex" justifyContent="space-between" mb={4}>
        <Box d="flex" maxWidth="65%">
          <Text textAlign="left" textOverflow="ellipsis" overflow="hidden" whiteSpace="pre">
            {formatNumber(inputValue || 0)}
          </Text>
          <Text ml={2}>ETH</Text>
        </Box>
        {prices && <Text textAlign="right">{formatUSD(Number(inputValue) * prices.ethereum)}</Text>}
      </Box>
      {type === 'withdrawal' && (
        <>
          <Text mb={2} textAlign="left" fontSize={'1rem'}>
            Gas fee
          </Text>
          <Box d="flex" justifyContent="space-between">
            <Box d="flex" maxWidth="65%">
              <Text textOverflow="ellipsis" overflow="hidden" whiteSpace="pre">
                {l2GasFee ? formatNumber(l2GasFee) : <Spinner size="sm" mr={2} />}
              </Text>
              <Text ml={1}>ETH</Text>
            </Box>
            {prices && (
              <Text textAlign="right" pos="relative">
                {l2GasFee ? formatUSD(+l2GasFee * prices?.ethereum) : <Spinner size="sm" mr={2} />}{' '}
                <Box as="span" top="5px" position="absolute" fontSize="1rem">
                  *
                </Box>
              </Text>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}

export default ModalTxTable;

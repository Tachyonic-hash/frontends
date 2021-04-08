import React from 'react';
import { Text, Table, Tbody, Tr, Td, Thead, Th, Box } from '@chakra-ui/react';
import AppContext from '../../context';
import { formatUSD, formatNumber } from '../../helpers';

function ModalTxTable({ l2GasFee, type }: { l2GasFee?: string; type?: string }) {
  const { inputValue, prices } = React.useContext(AppContext);

  return (
    <Box mb={8} fontSize={'1.6rem'}>
      <Text mb={2} textAlign="left" fontSize={'1rem'}>
        Amount
      </Text>
      <Box d="flex" justifyContent="space-between" mb={4}>
        <Box d="flex">
          <Text textAlign="left" textOverflow="ellipsis" overflow="hidden" whiteSpace="pre">
            {formatNumber(inputValue || 0)}
          </Text>
          <Text ml={2}>ETH</Text>
        </Box>
        {prices && <Text textAlign="right">{formatUSD(Number(inputValue) * prices.ethereum)}</Text>}
      </Box>
      {type === 'withdrawal' && l2GasFee && (
        <>
          <Text mb={2} textAlign="left" fontSize={'1rem'}>
            Gas fee
          </Text>
          <Box d="flex" justifyContent="space-between">
            <Box d="flex">
              <Text textOverflow="ellipsis" overflow="hidden" whiteSpace="pre">
                {formatNumber(l2GasFee)}
              </Text>
              <Text ml={2}>ETH</Text>
            </Box>
            {prices && (
              <Text textAlign="right" pos="relative">
                {formatUSD(+l2GasFee * prices?.ethereum)}{' '}
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

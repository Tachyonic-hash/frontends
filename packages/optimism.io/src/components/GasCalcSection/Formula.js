import React from 'react';
import { Box } from '@chakra-ui/react';

function MathSection() {
  return (
    <Box
      d="flex"
      flexDir="column"
      justifyContent="center"
      as="code"
      bg="#f4f4f4"
      borderRadius="10px"
      className="js"
    >
      <Box p={3}>
        <Box as="span" color="pink.600">
          const&nbsp;
        </Box>
        <Box as="span" color="purple.700">
          l1Gas&nbsp;
        </Box>
        <Box as="span" color="pink.600">
          =&nbsp;
        </Box>
        <Box as="span" color="purple.700">
          zeroDataBytes
        </Box>
        <Box as="span" color="pink.600">
          {' '}
          *{' '}
        </Box>
        <Box as="span" color="blue.500">
          {' '}
          4
        </Box>
        <Box ml={8}>
          <Box as="span" color="pink.600">
            {' '}
            +{' '}
          </Box>
          <Box as="span" color="purple.700">
            nonZeroDataBytes{' '}
          </Box>
          <Box as="span" color="pink.600">
            {' '}
            *{' '}
          </Box>{' '}
          <Box as="span" color="blue.500">
            16
          </Box>{' '}
        </Box>
      </Box>
      <Box p={3}>
        <Box as="span" color="pink.600">
          const&nbsp;
        </Box>
        <Box as="span" color="purple.700">
          l2GasFee&nbsp;
        </Box>
        <Box as="span" color="pink.600">
          =&nbsp;
        </Box>
        <Box as="span" color="purple.700">
          l1GasPrice
        </Box>
        <Box ml={8}>
          <Box as="span" color="pink.600">
            *{' '}
          </Box>
          <Box as="span" color="purple.700">
            l1Gas{' '}
          </Box>
          <Box as="span" color="pink.600">
            + (
          </Box>
          <Box as="span" color="purple.700">
            {' '}
            executionPrice
          </Box>
          <Box as="span" color="pink.600">
            {' '}
            *{' '}
          </Box>
          <Box as="span" color="purple.700">
            gasUsed
          </Box>
          <Box as="span" color="pink.600">
            {' '}
            )
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default MathSection;

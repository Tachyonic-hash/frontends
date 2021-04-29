import React from 'react';
import { Box, Tooltip } from '@chakra-ui/react';

const TTip = ({ label, children }) => (
  <Tooltip
    label={label}
    hasArrow
    bg="#e2fcff"
    color="black"
    borderRadius="5px"
    placement="top"
    fontSize="1rem"
  >
    {children}
  </Tooltip>
);

function Formula({ variables }) {
  let zeroDataBytes = 'zeroDataBytes';
  let nonZeroDataBytes = 'nonZeroDataBytes';
  let layer1GasPrice = 'layer1GasPrice';
  let layer1Gas = 'layer1Gas';
  let layer2GasFee;

  if (variables) {
    ({ zeroDataBytes, nonZeroDataBytes, layer1GasPrice } = variables);
    layer1Gas = zeroDataBytes * 4 + nonZeroDataBytes * 16 + 2661;
    layer2GasFee = layer1Gas * variables.layer1GasPrice;
  }

  return (
    <Box
      d="flex"
      flexDir="column"
      justifyContent="flex-start"
      as="code"
      bg="#f4f4f4"
      borderRadius="10px"
      className="js"
      height="100%"
      px={2}
    >
      <Box p={2}>
        <TTip
          label={
            'Estimated gas to submit the transaction on layer 1, based on a batch of 200 transactions.'
          }
        >
          <Box d="inline">
            <Box as="span" color="pink.600">
              const&nbsp;
            </Box>
            <Box as="span" color="purple.700">
              batchSubmissionGas&nbsp;
            </Box>
            <Box as="span" color="pink.600">
              =&nbsp;
            </Box>
            <Box as="span" color="blue.500">
              {' '}
              2661
            </Box>
          </Box>
        </TTip>
      </Box>
      <Box p={2}>
        <Box as="span" color="pink.600">
          const&nbsp;
        </Box>
        <Box as="span" color="purple.700">
          layer1Gas&nbsp;
        </Box>
        <Box as="span" color="pink.600">
          =&nbsp;
        </Box>
        <TTip label="The layer 1 gas for a byte with no data is 4.">
          <Box d="inline">
            <Box as="span" color={variables ? 'blue.500' : 'purple.700'}>
              {zeroDataBytes}
            </Box>
            <Box as="span" color="pink.600">
              {' '}
              *{' '}
            </Box>
            <Box as="span" color="blue.500">
              {' '}
              4
            </Box>
          </Box>
        </TTip>

        <TTip label="The layer 1 gas for a byte with data is 16.">
          <Box d="inline">
            <Box as="span" color="pink.600">
              {' '}
              +{' '}
            </Box>
            <Box as="span" color={variables ? 'blue.500' : 'purple.700'}>
              {nonZeroDataBytes}{' '}
            </Box>
            <Box as="span" color="pink.600">
              {' '}
              *{' '}
            </Box>{' '}
            <Box as="span" color="blue.500">
              16
            </Box>
          </Box>
        </TTip>
        <Box as="span" color="pink.600">
          {' '}
          +{' '}
        </Box>
        <TTip
          label={
            'Estimated gas to submit the transaction on layer 1, based on a batch of 200 transactions.'
          }
        >
          <Box as="span" color="purple.700">
            {' '}
            batchSubmissionGas
          </Box>
        </TTip>
      </Box>

      <Box p={2}>
        <Box as="span" color="pink.600">
          const&nbsp;
        </Box>
        <Box as="span" color="purple.700">
          layer2GasFee&nbsp;
        </Box>
        <Box as="span" color="pink.600">
          =&nbsp;
        </Box>
        <TTip label="The current price per gas on layer 1.">
          <Box as="span" color={variables ? 'blue.500' : 'purple.700'}>
            {layer1GasPrice}
          </Box>
        </TTip>
        <Box as="span" color="pink.600">
          {' '}
          *{' '}
        </Box>
        <TTip label="The total amount of layer 1 gas required to submit the transaction on layer 2.">
          <Box as="span" color={variables ? 'blue.500' : 'purple.700'}>
            {layer1Gas}{' '}
          </Box>
        </TTip>

        <Box
          pt={4}
          color="#718096 !important"
          dangerouslySetInnerHTML={{
            __html: !variables
              ? '// Layer 2 computation costs are currently not added to the fee, but will be in the future'
              : `// layer2GasFee === ${layer2GasFee} GWEI (${0.000000001 *
                  layer2GasFee} ETH)`
          }}
        />
      </Box>
    </Box>
  );
}

export default Formula;

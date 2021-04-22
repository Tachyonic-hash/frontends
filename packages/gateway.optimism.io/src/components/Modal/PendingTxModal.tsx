import React from 'react';
import { Heading, Text, Box, Link } from '@chakra-ui/react';
import AppContext from '../../context';
import { chainIds } from '../../constants';
import OptimismButton from '../OptimismButton';

function PendingTxModal({ type }: { type: string }) {
  const { pendingTxHash, connectedChainId, connectToLayer } = React.useContext(AppContext);

  let subdomain = '';
  switch (connectedChainId) {
    case chainIds.KOVAN_L1:
      subdomain = 'kovan.';
      break;
    case chainIds.KOVAN_L2:
      subdomain = 'optimistic-kovan.';
      break;
    case chainIds.MAINNET_L2:
      subdomain = 'optimistic.';
      break;
    default:
      break;
  }

  return (
    <Box>
      <Heading size="xl" mt={0} mb={4}>
        {type === 'deposit' ? 'Deposit initiated!' : 'Withdrawal initiated!'}
      </Heading>
      <Box mb={4}>
        {type === 'deposit' ? (
          <Text>
            Deposits require 20 block confirmations on layer 1 before they're considered final on Optimism. This will
            take about five minutes. Track your transaction by clicking the link below.
          </Text>
        ) : (
          <Text>
            Your withdrawal will be available to claim in one week. You can track its progress on Etherscan [TODO:
            insert link].
          </Text>
        )}
      </Box>
      <OptimismButton
        fontSize="1.2rem"
        variant="link"
        href={`https://${subdomain}etherscan.io/tx/${pendingTxHash}`}
        isExternal={true}
      >
        View on Etherscan
      </OptimismButton>
    </Box>
  );
}

export default PendingTxModal;

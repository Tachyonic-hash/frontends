import React from 'react';
import { Heading, Text, Link, Divider, Box } from '@chakra-ui/react';
import AppContext from '../../context';
import { chainIds } from '../../constants';
import OptimismButton from '../OptimismButton';

function PendingTxModal({ type }: { type: string }) {
  const { pendingTxHash, connectedChainId } = React.useContext(AppContext);

  let subdomain = '';
  switch (connectedChainId) {
    case chainIds.KOVAN_L1:
      subdomain = 'kovan.';
      break;
    case chainIds.KOVAN_L2:
      subdomain = 'kovan-optimism.';
      break;
    case chainIds.MAINNET_L2:
      subdomain = 'optimism.';
      break;
    default:
      break;
  }

  return (
    <Box>
      <Heading size="xl" mt={0} mb={4}>
        {type === 'deposit' ? 'Deposit initiated!' : 'Withdrawal initiated!'}
      </Heading>
      <Text mb={4}>
        {type === 'deposit'
          ? 'Deposits are considered final on Optimism after 20 confirmations, which is about five minutes.'
          : 'Your withdrawal will be available to claim in one week. You can track its progress on Etherscan [TODO: insert link].'}
      </Text>
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

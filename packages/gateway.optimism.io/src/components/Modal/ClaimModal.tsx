import React from 'react';
import { Heading, Box, Text } from '@chakra-ui/react';
import OptimismButton from '../OptimismButton';
import ModalTxTable from './ModalTxTable';
import AppContext from '../../context';
import { chainIds } from '../../constants';

function ClaimModal() {
  const { handleClaimWithdrawal, connectedChainId } = React.useContext(AppContext);

  return (
    <Box>
      <Heading size="xl" mt={0} mb={8}>
        Claim Withdrawal
      </Heading>
      <Text my={8}>
        This will finalize your transfer from Optimism to {connectedChainId === chainIds.KOVAN_L2 ? 'Kovan' : 'Mainnet'}
        .
      </Text>
      <ModalTxTable type="claim" />
      <OptimismButton size="huge" onClick={handleClaimWithdrawal}>
        Claim Withdrawal
      </OptimismButton>
    </Box>
  );
}

export default ClaimModal;

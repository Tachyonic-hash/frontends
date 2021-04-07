import React from 'react';
import { Heading, Box, Text } from '@chakra-ui/react';
import OptimismButton from '../OptimismButton';
import ModalTxTable from './ModalTxTable';
import AppContext from '../../context';

function ClaimModal() {
  const { handleClaimWithdrawal } = React.useContext(AppContext);

  return (
    <Box>
      <Heading size="xl" mt={0} mb={8}>
        Claim Withdrawal
      </Heading>
      <Text my={8}>
        This will move your funds to <br />
        their final destination on layer 1.
      </Text>
      <ModalTxTable type="claim" />
      <OptimismButton size="huge" onClick={handleClaimWithdrawal}>
        Claim Withdrawal
      </OptimismButton>
    </Box>
  );
}

export default ClaimModal;

import React from 'react';
import { Heading, Box } from '@chakra-ui/react';
import OptimismButton from '../OptimismButton';
import AppContext from '../../context';

function DisconnectModal() {
  const { handleDisconnect } = React.useContext(AppContext);

  return (
    <Box>
      <Heading size="xl" mt={0} mb={16}>
        Disconnect wallet?
      </Heading>
      <OptimismButton size="huge" onClick={handleDisconnect}>
        Disconnect
      </OptimismButton>
    </Box>
  );
}

export default DisconnectModal;

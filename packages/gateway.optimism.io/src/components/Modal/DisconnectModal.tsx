import React from 'react';
import { Heading, Box, Text } from '@chakra-ui/react';
import OptimismButton from '../OptimismButton';
import AppContext from '../../context';

function DisconnectModal() {
  const { handleDisconnect } = React.useContext(AppContext);

  return (
    <Box>
      <Heading size="xl" mt={0} mb={16}>
        Disconnect wallet?
      </Heading>
      <Text>If you're trying to connect to another network, please do so in Metamask</Text>
      <OptimismButton size="huge" onClick={handleDisconnect}>
        Disconnect
      </OptimismButton>
    </Box>
  );
}

export default DisconnectModal;

import React from 'react';
import { Heading, Text, Link } from '@chakra-ui/react';
import ConnectCards from '../ConnectCards';
import AppContext from '../../context';

function WelcomeModal({ connectToLayer }) {
  const { connectedChainId } = React.useContext(AppContext);

  return (
    <div>
      <Heading size="xl" mt={0}>
        Welcome to the <br />
        Optimism Gateway!
      </Heading>
      {!connectedChainId && (
        <>
          <Heading size="lg" mb={0}>
            Connect Metamask wallet
          </Heading>
          <Text size="xs" mx="auto" mt={6} mb={8} maxW="380px">
            More wallet support coming soon.
          </Text>
          <ConnectCards connectToLayer={connectToLayer} />
        </>
      )}
    </div>
  );
}

export default WelcomeModal;

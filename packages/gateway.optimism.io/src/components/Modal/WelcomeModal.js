import React from 'react';
import { Heading, Text, Link } from '@chakra-ui/react';
import ConnectCards from '../ConnectCards';
import DisclaimerContent from '../DisclaimerContent';
import OptimismButton from '../OptimismButton';
import AppContext from '../../context';
import { modalTypes } from '../Modal';

function WelcomeModal() {
  const { connectedChainId, connectToLayer } = React.useContext(AppContext);

  return (
    <div>
      <Heading size="xl" mt={0}>
        Welcome to the <br />
        Optimism Gateway!
      </Heading>
      <DisclaimerContent />
      {!connectedChainId && (
        <OptimismButton mt={10} size="huge" onClick={connectToLayer} textTransform="uppercase">
          Connect
        </OptimismButton>
      )}
    </div>
  );
}

export default WelcomeModal;

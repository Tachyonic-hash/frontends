import React from 'react';
import { Heading, Text, Link } from '@chakra-ui/react';
import ConnectCards from '../ConnectCards';
import DisclaimerContent from '../DisclaimerContent';
import OptimismButton from '../OptimismButton';
import AppContext from '../../context';
import { modalTypes } from '../Modal';

function WelcomeModal({ connectToLayer }) {
  const { connectedChainId, openModal } = React.useContext(AppContext);

  return (
    <div>
      <Heading size="xl" mt={0}>
        Welcome to the <br />
        Optimism Gateway!
      </Heading>
      <DisclaimerContent />
      {!connectedChainId && (
        <OptimismButton
          mt={10}
          size="huge"
          onClick={() => openModal(modalTypes.CHOOSE_NETWORK)}
          textTransform="uppercase"
        >
          Connect
        </OptimismButton>
      )}
    </div>
  );
}

export default WelcomeModal;

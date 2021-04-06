import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, useColorModeValue } from '@chakra-ui/react';
import ChooseNetworkModal from './ChooseNetworkModal';
import DisconnectModal from './DisconnectModal';
import WelcomeModal from './WelcomeModal';
import ConfirmTxModal from './ConfirmTxModal';
import AppContext from '../../context';
import DisclaimerContent from '../DisclaimerContent';

export const modalTypes = {
  WELCOME: 'WELCOME',
  CHOOSE_NETWORK: 'CHOOSE_NETWORK',
  CONFIRM_WITHDRAWAL: 'CONFIRM_WITHDRAWAL',
  CONFIRM_DEPOSIT: 'CONFIRM_DEPOSIT',
  INFO: 'INFO',
  DISCONNECT: 'DISCONNECT',
};

type BaseModalProps = {
  isOpen: any;
  onClose: any;
  currentModal: string;
};

function BaseModal({ isOpen, onClose, currentModal }: BaseModalProps) {
  const { connectToLayer } = React.useContext(AppContext);
  const contentBg = useColorModeValue('#f0f9ff', '#1c2a3e');

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent mt="10vh" mx={2} px="3vw" py={16} maxW="500px" borderRadius="20px" bg={contentBg}>
          <ModalCloseButton />
          <ModalBody padding={0} textAlign="center">
            {currentModal === modalTypes.CHOOSE_NETWORK && <ChooseNetworkModal connectToLayer={connectToLayer} />}
            {currentModal === modalTypes.WELCOME && <WelcomeModal connectToLayer={connectToLayer} />}
            {currentModal === modalTypes.INFO && <DisclaimerContent />}
            {currentModal === modalTypes.CONFIRM_DEPOSIT && <ConfirmTxModal type="deposit" />}
            {currentModal === modalTypes.CONFIRM_WITHDRAWAL && <ConfirmTxModal type="withdrawal" />}
            {currentModal === modalTypes.DISCONNECT && <DisconnectModal />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default BaseModal;

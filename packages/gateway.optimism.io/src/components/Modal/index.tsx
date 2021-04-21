import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, useColorModeValue } from '@chakra-ui/react';
import ChooseNetworkModal from './ChooseNetworkModal';
import DisconnectModal from './DisconnectModal';
import WelcomeModal from './WelcomeModal';
import ConfirmTxModal from './ConfirmTxModal';
import PendingTxModal from './PendingTxModal';
import ClaimModal from './ClaimModal';
import AppContext from '../../context';
import DisclaimerContent from '../DisclaimerContent';

export const modalTypes = {
  WELCOME: 'WELCOME',
  CHOOSE_NETWORK: 'CHOOSE_NETWORK',
  CONFIRM_WITHDRAWAL: 'CONFIRM_WITHDRAWAL',
  WITHDRAWAL_PENDING: 'WITHDRAWAL_PENDING',
  CONFIRM_DEPOSIT: 'CONFIRM_DEPOSIT',
  DEPOSIT_PENDING: 'DEPOSIT_PENDING',
  INFO: 'INFO',
  DISCONNECT: 'DISCONNECT',
  CLAIM: 'CLAIM',
};

type BaseModalProps = {
  isOpen: any;
  onClose: any;
  currentModal: string;
};

function BaseModal({ isOpen, onClose, currentModal }: BaseModalProps) {
  const { connectToLayer, isShortScreen, screenSm } = React.useContext(AppContext);
  const contentBg = useColorModeValue('#f0f9ff', '#1c2a3e');
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          pos={isShortScreen ? 'relative' : 'absolute'}
          top={isShortScreen ? '5vh' : '50vh'}
          left={isShortScreen ? 0 : '50vw'}
          transform={isShortScreen ? 'translate(0)' : 'translate(-50%, -50%) !important'}
          margin={isShortScreen ? 'auto' : '0 !important'}
          mx={4}
          px={screenSm ? 12 : 6}
          py={12}
          maxW="500px"
          borderRadius="20px"
          bg={contentBg}
        >
          <ModalCloseButton />
          <ModalBody padding={0} textAlign="center">
            {currentModal === modalTypes.CHOOSE_NETWORK && <ChooseNetworkModal connectToLayer={connectToLayer} />}
            {currentModal === modalTypes.WELCOME && <WelcomeModal connectToLayer={connectToLayer} />}
            {currentModal === modalTypes.INFO && <DisclaimerContent />}
            {currentModal === modalTypes.CONFIRM_DEPOSIT && <ConfirmTxModal type="deposit" />}
            {currentModal === modalTypes.DEPOSIT_PENDING && <PendingTxModal type="deposit" />}
            {currentModal === modalTypes.WITHDRAWAL_PENDING && <PendingTxModal type="withdrawal" />}
            {currentModal === modalTypes.CONFIRM_WITHDRAWAL && <ConfirmTxModal type="withdrawal" />}
            {currentModal === modalTypes.DISCONNECT && <DisconnectModal />}
            {currentModal === modalTypes.CLAIM && <ClaimModal />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default BaseModal;

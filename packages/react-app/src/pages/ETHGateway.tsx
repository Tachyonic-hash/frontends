import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Link, useColorModeValue, useMediaQuery } from '@chakra-ui/react';
import Balances from '../components/Balances';
import Pulse from '../components/Pulse';
import { modalTypes } from '../components/Modal';
import AppContext from '../context';

function ETHGateway() {
  const { openModal, txPending } = React.useContext(AppContext);
  const containerBg = useColorModeValue('#f0f9ff', '#1c2a3e');
  const [isMobile] = useMediaQuery('(max-width: 600px)');

  React.useEffect(() => {
    if (!openModal) return;
    const hasUserSeenWelcomeMsg = localStorage.getItem('hasUserSeenWelcomeMsg');
    if (!hasUserSeenWelcomeMsg) {
      openModal(modalTypes.WELCOME);
      localStorage.setItem('hasUserSeenWelcomeMsg', 'true');
    }
  }, [openModal]);

  return (
    <>
      <Container maxW={'1400px'} pt={4} pb={8} px={0}>
        <Box maxW="500px" mx="auto" mt="5vh">
          <Link
            visibility={txPending ? 'visible' : 'hidden'}
            aria-hidden={!!txPending}
            as={RouterLink}
            to="/txs"
            d="flex"
            alignItems="center"
            justifyContent="flex-end"
            mb={2}
            color="default !important"
            textDecoration="none !important"
          >
            Transaction pending
            <Pulse ml={2} />
          </Link>

          <Box
            borderWidth="1px"
            borderRadius="20px"
            bg={containerBg}
            padding={`1rem ${isMobile ? '1rem' : '1.5rem'} 3rem`}
          >
            <Balances openModal={openModal} />
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default ETHGateway;

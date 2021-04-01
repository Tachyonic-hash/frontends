import React from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Button,
  Heading,
  Link,
  Box,
  useColorMode,
  HStack,
  Text,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Link as RouterLink } from 'react-router-dom';
import NavItems from './NavItems';
import { HamburgerSpin } from 'react-animated-burgers';
import { chainIds } from '../constants';
import { modalTypes } from './Modal';
import { shortenAddress } from '../helpers';
import AppContext from '../context';

const Title = () => (
  <Link as={RouterLink} to="/" textDecoration="none !important" boxShadow="none !important">
    <Heading
      className="rainbowText"
      userSelect="none"
      as="h1"
      size="lg"
      mt={0}
      fontWeight={'500'}
      fontStyle="italic"
      color="brand.primary"
    >
      OΞ
    </Heading>
  </Link>
);

type HeaderNavProps = {
  isMobileDrawerOpen: boolean;
  openMobileDrawer: () => void;
  closeMobileDrawer: () => void;
  connectedChainId: number | undefined;
  userAddress: string | undefined;
  openModal: (modalType: string) => void;
};

function HeaderNav({
  isMobileDrawerOpen,
  openMobileDrawer,
  closeMobileDrawer,
  connectedChainId,
  userAddress,
  openModal,
}: HeaderNavProps) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { screenSm } = React.useContext(AppContext);
  const bg = useColorModeValue('white', 'darkBackground');
  const toast = useToast();

  const handleHamburgerPress = () => {
    if (isMobileDrawerOpen) {
      closeMobileDrawer();
    } else {
      openMobileDrawer();
    }
  };

  const copiedToClipboard = (text: string) => {
    toast({
      title: 'Copied to clipboard:',
      description: text,
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'bottom-right',
    });
  };

  const connectedNetwork =
    connectedChainId === chainIds.MAINNET_L1
      ? 'Mainnet'
      : connectedChainId === chainIds.KOVAN_L1
      ? 'Kovan'
      : connectedChainId === chainIds.MAINNET_L2
      ? 'Optimism'
      : connectedChainId === chainIds.KOVAN_L2
      ? 'Optimism Kovan'
      : '';

  return (
    <Box>
      <Drawer placement={'right'} onClose={closeMobileDrawer} isOpen={isMobileDrawerOpen}>
        <DrawerOverlay>
          <DrawerContent pt={2} bg={bg}>
            <DrawerHeader>
              <Title />
            </DrawerHeader>
            <DrawerBody d="flex" flexDir="column" onClick={closeMobileDrawer}>
              <NavItems screenSm={screenSm} />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
      <Box d="flex" alignItems="center" justifyContent="space-between" mb={8} w="100%">
        <HStack spacing={6} as="nav">
          <Title />
          {screenSm && <NavItems screenSm={screenSm} />}
        </HStack>
        <Box d="flex" alignItems="center">
          <Box>
            {userAddress && (
              <>
                <CopyToClipboard text={userAddress} onCopy={copiedToClipboard}>
                  <Text opacity={0.7} cursor="pointer" ml={1} borderWidth="1px" px={2} borderRadius="5px" mr={2}>
                    {shortenAddress(userAddress || '', screenSm ? 6 : 4)}
                  </Text>
                </CopyToClipboard>
              </>
            )}
          </Box>
          <Button
            borderRadius="5px"
            bg="brand.primaryLowOpacity"
            color="brand.primary"
            px={2}
            py={0}
            lineHeight="24px"
            height="inherit"
            _hover={{
              bg: 'brand.primaryLowOpacity',
            }}
            _active={{
              bg: 'brand.primaryLowOpacity',
            }}
            cursor={connectedNetwork ? 'default' : 'pointer'}
            onClick={connectedNetwork ? () => {} : () => openModal(modalTypes.CHOOSE_NETWORK)}
          >
            {connectedNetwork || 'Connect'}
          </Button>
          <Button borderRadius="100%" ml={2} p={0} onClick={toggleColorMode} bg="transparent">
            {colorMode === 'light' ? '🌜' : '🌞'}
          </Button>
          {!screenSm && (
            <Box ml={2}>
              <HamburgerSpin
                buttonWidth={30}
                className="burgerBtn"
                isActive={isMobileDrawerOpen}
                toggleButton={handleHamburgerPress}
                barColor={colorMode === 'light' ? '#333' : '#ddd'}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default HeaderNav;

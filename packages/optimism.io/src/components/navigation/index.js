import styles from './Navigation.module.scss';
import React, { Component } from 'react';
import {
  Container,
  Heading,
  Box,
  Link,
  Center,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  useDisclosure,
  DrawerBody,
} from '@chakra-ui/react';
import { HamburgerSpin } from 'react-animated-burgers';
import { Link as ReactLink } from 'react-router-dom';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { navItems } from '../../constants';

function Navigation() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const handleHamburgerPress = () => {
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  };

  const Logo = ({ color }) => (
    <Heading as="h1" m={0} fontSize="2xl">
      <Link to="/" onClick={onClose} as={ReactLink} color={color}>
        Optimism
      </Link>
    </Heading>
  );

  return (
    <Container
      maxW="none"
      h="50px"
      d="flex"
      justifyContent="space-between"
      alignItems="center"
      textTransform="uppercase"
    >
      {/* Mobile Menu */}
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
        size="full"
      >
        <DrawerOverlay>
          <DrawerContent textTransform="uppercase">
            <DrawerHeader
              d="flex"
              flex="50px 0 0"
              alignItems="center"
              py={0}
              bgColor="brandPrimary"
            >
              <Logo color="white" />
            </DrawerHeader>
            <DrawerBody py={4}>
              <Box as="nav" d="flex" flexDir="column" alignItems="flex-start">
                {navItems.map((item) =>
                  item.internal ? (
                    <Link
                      as={ReactLink}
                      to={item.url}
                      fontSize="2xl"
                      mb={4}
                      onClick={onClose}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    !item.social && (
                      <Link
                        onClick={onClose}
                        href={item.url}
                        fontSize="2xl"
                        mb={4}
                        target="_blank"
                        rel="noopenner noreferrer"
                      >
                        {item.name}
                        <ExternalLinkIcon color="inherit" ml={1} mb={1} />
                      </Link>
                    )
                  )
                )}
              </Box>
            </DrawerBody>
            <DrawerFooter
              justifyContent="space-between"
              borderTop="1px solid"
              borderColor="brandPrimary_halfOpacity"
            >
              {navItems.map(
                (item) =>
                  item.social && (
                    <Link
                      as={ReactLink}
                      to={item.url}
                      fontSize="lg"
                      onClick={onClose}
                    >
                      {item.name}
                    </Link>
                  )
              )}
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
      {/* Desktop Menu */}
      <Logo color="brandPrimary" />
      <Box as="nav" d={['none', 'none', 'block']}>
        {navItems.map((item) =>
          item.internal ? (
            <Link
              ml={6}
              as={ReactLink}
              to={item.url}
              fontSize="1.15rem"
              onClick={onClose}
            >
              {item.name}
            </Link>
          ) : !item.social ? (
            <Link
              onClick={onClose}
              ml={6}
              fontSize="1.1rem"
              href={item.url}
              target="_blank"
              rel="noopenner noreferrer"
            >
              {item.name}
              <ExternalLinkIcon color="inherit" ml={1} mb={1} />
            </Link>
          ) : null
        )}
      </Box>
      <Center d={['block', 'block', 'none']}>
        <HamburgerSpin
          buttonWidth={30}
          className={styles.burger}
          isActive={isOpen}
          toggleButton={handleHamburgerPress}
          barColor={isOpen ? 'white' : '#f01a37'}
        />
      </Center>
    </Container>
  );
}

export default Navigation;

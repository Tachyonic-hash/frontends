import React, { Component } from 'react';
import styles from './Navigation.module.scss';
import {
  Container,
  Heading,
  Box,
  Link,
  Stack,
  Center,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  useDisclosure,
  DrawerBody,
  Popover,
  PopoverTrigger,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  Portal,
} from '@chakra-ui/react';
import { HamburgerSpin } from 'react-animated-burgers';
import { Link as ReactLink } from 'react-router-dom';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { navCategories } from '../../constants';

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

  const NavLink = ({ item, ...rest }) =>
    item.internal ? (
      <Link
        as={ReactLink}
        to={item.url}
        fontSize={['md', 'lg']}
        mb={2}
        onClick={onClose}
        {...rest}
      >
        {item.name}
      </Link>
    ) : (
      <Link
        href={item.url}
        fontSize={['md', 'lg']}
        mb={2}
        target="_blank"
        rel="noopenner noreferrer"
        onClick={onClose}
        {...rest}
      >
        {item.name}
        {/* <ExternalLinkIcon color="inherit" ml={1} mb={1} /> */}
      </Link>
    );

  const Logo = (...props) => {
    return (
      <Heading as="h1" m={0} fontSize="2xl">
        <Link
          to="/"
          onClick={onClose}
          as={ReactLink}
          fontStyle="italic"
          fontWeight="500"
          {...props[0]}
        >
          Optimism
        </Link>
      </Heading>
    );
  };

  return (
    <Container
      maxW="none"
      h="50px"
      d="flex"
      justifyContent="space-between"
      alignItems="center"
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
          <DrawerContent>
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
                {navCategories.map(
                  (category) =>
                    category.heading !== 'Community' && (
                      <Stack mb={4} key={category.heading}>
                        <Heading
                          mt={0}
                          mb={2}
                          as="h2"
                          fontSize="lg"
                          textTransform="uppercase"
                        >
                          {category.heading}
                        </Heading>
                        {category.items.map((item) => (
                          <NavLink key={item.url} item={item} />
                        ))}
                      </Stack>
                    )
                )}
              </Box>
            </DrawerBody>
            <DrawerFooter
              justifyContent="space-between"
              borderTop="1px solid"
              bgColor="brandPrimary"
              border="none"
              py={2}
            >
              {navCategories.map(
                (category) =>
                  category.heading === 'Community' &&
                  category.items.map((item) => (
                    <NavLink
                      key={item.url}
                      item={item}
                      color="white"
                      fontSize="lg"
                    />
                  ))
              )}
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
      {/* Desktop Menu */}
      <Logo color="brandPrimary" />
      <Box as="nav" d={['none', null, null, 'flex']}>
        {navCategories.map((col, idx) => (
          <Popover key={idx} trigger="hover">
            <PopoverTrigger>
              <Heading
                tabIndex="0"
                role="button"
                cursor="pointer"
                p={5}
                as="h2"
                fontWeight="500"
                textTransform="uppercase"
                fontSize="lg"
                color="brandPrimary"
                className="rainbowText"
              >
                {col.heading}
              </Heading>
            </PopoverTrigger>
            <Portal>
              <PopoverContent p={2}>
                <PopoverArrow />
                <PopoverBody d="flex" flexDir="column">
                  {col.items.map((item) => (
                    <NavLink key={item.url} item={item} />
                  ))}
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
        ))}
      </Box>
      <Center d={['block', null, null, 'none']}>
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

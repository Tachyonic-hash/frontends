import styles from './Navigation.module.scss';
import React, { Component } from 'react';
import { Container, Heading, Box, Link } from '@chakra-ui/react';
import { HamburgerSpin } from 'react-animated-burgers';
import { Link as ReactLink } from 'react-router-dom';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from 'body-scroll-lock';
import { navItems } from '../../constants';

const mobileNavId = 'mobileNavId';

class Navigation extends Component {
  state = {
    isActive: false,
  };
  targetElement = null;

  toggleButton = () => {
    this.setState({
      isActive: !this.state.isActive,
    });
  };

  componentDidMount() {
    this.targetElement = document.querySelector(`#${mobileNavId}`);
  }

  showTargetElement = () => {
    disableBodyScroll(this.targetElement);
  };

  hideTargetElement = () => {
    enableBodyScroll(this.targetElement);
  };

  componentWillUnmount() {
    clearAllBodyScrollLocks();
  }

  render() {
    const { isActive } = this.state;

    const Logo = () => (
      <Heading as="h1" m={0} fontSize="2xl">
        <Link to="/" as={ReactLink} color="brandPrimary">
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
      >
        {/* Mobile Menu */}
        <Box as="nav" id={mobileNavId} d={isActive ? 'block' : 'none'}>
          <Logo />
          {navItems.map((item) =>
            item.internal ? (
              <Link as={ReactLink} to={item.url} fontSize="xl">
                {item.name}
              </Link>
            ) : (
              <Link href={item.url} target="_blank" rel="noopenner noreferrer">
                {item.name}
              </Link>
            )
          )}
        </Box>
        {/* Desktop Menu */}
        <Logo />
        <Box as="nav">
          {navItems.map((item) =>
            item.internal ? (
              <Link ml="8" as={ReactLink} to={item.url} fontSize="xl">
                {item.name}
              </Link>
            ) : !item.social ? (
              <Link
                ml="8"
                fontSize="xl"
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
        <HamburgerSpin
          buttonWidth={40}
          className={styles.burger}
          isActive={isActive}
          toggleButton={this.toggleButton}
          barColor={isActive ? 'white' : '#f01a37'}
        />
      </Container>
    );
  }
}

export default Navigation;

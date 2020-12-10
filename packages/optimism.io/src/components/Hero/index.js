import React, { Component } from 'react';
import { Center, Heading, Text, Box } from '@chakra-ui/react';
import Container from '../Container';
import { images } from '../../constants';
class Hero extends Component {
  render() {
    return (
      <Container>
        <Center height="calc(100vh - 50px)">
          <Box mb={16} textAlign={['center', null, 'left']}>
            <Heading
              style={{ userSelect: 'none' }}
              as="h1"
              fontFamily="serifFont"
              fontWeight="bold"
              color="headingText"
              fontSize={['4xl', '5xl', '6xl']}
              mt={0}
            >
              The{' '}
              <Box
                as="span"
                px={1}
                color="brandPrimary"
                className="rainbowText"
              >
                New
              </Box>{' '}
              Scalability
              <br /> Stack for{' '}
              <Box
                as="span"
                px={1}
                color="brandPrimary"
                className="rainbowText"
              >
                Ethereum
              </Box>
            </Heading>
            <Text
              fontSize={['lg', 'lg', 'xl']}
              d="flex"
              flexWrap="wrap"
              justifyContent="center"
            >
              <Box as="span" whiteSpace="pre">
                Instant transactions and{' '}
              </Box>
              <Box as="span" whiteSpace="pre">
                scalable smart contracts
              </Box>
            </Text>
            <Box
              backgroundPosition="right bottom"
              height="50vw"
              maxH="50vh"
              width="50vw"
              right={0}
              bottom={0}
              position="absolute"
              zIndex={-1}
              backgroundImage={`url(${images.hero})`}
              backgroundRepeat="no-repeat"
              backgroundSize="contain"
            />
          </Box>
        </Center>
      </Container>
    );
  }
}

export default Hero;

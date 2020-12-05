import React, { Component } from 'react';
import { Center, Container, Heading, Text, Box } from '@chakra-ui/react';

class Hero extends Component {
  render() {
    return (
      <Container>
        <Center height="calc(100vh - 50px)">
          <div>
            <Heading
              as="h1"
              fontFamily="serifFont"
              fontWeight="bold"
              color="headingText"
              fontSize={['4xl', '5xl', '6xl']}
              mt={0}
            >
              The New Scalability
              <br /> Stack for Ethereum
            </Heading>
            <Text fontSize={['lg', 'lg', 'xl']}>
              Instant transactions and scalable smart contracts
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
              backgroundImage="url(./images/hero.svg)"
              backgroundRepeat="no-repeat"
              backgroundSize="contain"
            />
          </div>
        </Center>
      </Container>
    );
  }
}

export default Hero;

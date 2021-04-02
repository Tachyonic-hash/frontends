import React from 'react';
import { Center, Box, Container, Heading } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <Container>
      <Center h="45vh">
        <Box d="flex" flexDir="column" alignItems="center">
          <Box d="flex" flexDir="column" alignItems="center" mb="1rem">
            <Heading
              d="flex"
              flexDir="column"
              alignItems="center"
              fontSize="10rem"
              className="rainbowText rainbowText--constant"
              mb="0"
            >
              404
            </Heading>
            <Box as="span" d="block" fontSize="2rem">
              Page Not Found
            </Box>
          </Box>
          <Link to="/">Back to home</Link>
        </Box>
      </Center>
    </Container>
  );
}

export default NotFound;

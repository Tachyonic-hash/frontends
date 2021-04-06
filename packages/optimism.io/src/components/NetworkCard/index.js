import React from 'react';
import { Heading, Box, Text } from '@chakra-ui/react';

function NetworkCard({ network, isDown, smallScreen }) {
  return (
    <Box
      borderWidth="1px"
      p={4}
      borderRadius={10}
      textAlign="center"
      borderColor={isDown ? '#f01a37' : '#75cc74'}
      borderStyle="solid"
      w="1fr"
    >
      <Heading as="h2" size="lg" fontWeight="300">
        {network}
      </Heading>
      <Text fontSize={'150px'} m={0}>
        {isDown ? '😭' : '😄'}
      </Text>
      <Text fontWeight="300" fontSize="1.2rem">
        {isDown
          ? 'Currently experiencing problems'
          : 'All systems operational!'}
      </Text>
    </Box>
  );
}

export default NetworkCard;

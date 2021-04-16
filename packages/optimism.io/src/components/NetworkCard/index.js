import React from 'react';
import { Heading, Box, Text, Spinner } from '@chakra-ui/react';

function NetworkCard({ network, isDown, smallScreen }) {
  return (
    <Box
      borderWidth="1px"
      p={4}
      borderRadius={10}
      textAlign="center"
      borderColor={
        isDown === true ? '#f01a37' : isDown === false ? '#75cc74' : '#ccc'
      }
      borderStyle="solid"
      w="1fr"
    >
      <Heading as="h2" size="lg" fontWeight="300">
        {network}
      </Heading>
      <Box fontSize={'150px'} m={0}>
        {isDown === true ? (
          '😭'
        ) : isDown === false ? (
          '😄'
        ) : (
          <Spinner w="90px" h="90px" />
        )}
      </Box>
      <Text fontWeight="300" fontSize="1.2rem">
        {isDown === true
          ? 'Currently experiencing problems'
          : isDown === false
          ? 'All systems operational!'
          : ''}
      </Text>
    </Box>
  );
}

export default NetworkCard;

import React from 'react';
import ConnectCards from '../ConnectCards';
import { Grid, Box, Center, Heading, Text, useColorModeValue } from '@chakra-ui/react';

function Connect({ connectToLayer }) {
  return (
    <>
      <Heading textAlign="center" size="xl" mb={0} mt={6}>
        Connect to Metamask
      </Heading>
      <Text size="xs" mx="auto" mt={6} mb={16} maxW="380px">
        More wallet support coming soon.
      </Text>
      <ConnectCards connectToLayer={connectToLayer} />
    </>
  );
}

export default Connect;

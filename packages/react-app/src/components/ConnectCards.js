import React from 'react';
import { Grid, Box, Center, Heading, Text, useColorModeValue } from '@chakra-ui/react';

const fakeButtonStyles = {
  borderWidth: '1px',
  borderColor: 'brand.primary',
  padding: '0.25rem 1rem',
  fontSize: '1.2rem',
  borderRadius: '5px',
  margin: '0 auto',
  color: 'brand.primary',
  className: 'rainbowText',
};

function ConnectCards({ connectToLayer }) {
  const containerBg = useColorModeValue('transparent', '#1A202C');

  const Card = ({ type, onClick }) => (
    <Box
      bg={containerBg}
      onClick={onClick}
      as="button"
      d="flex"
      flexDir="column"
      justifyContent="space-between"
      outline="none"
      boxShadow="none"
      borderWidth="1px"
      padding={4}
      borderRadius="20px"
      transition="all 500ms"
      _hover={{
        boxShadow: '0px 0px 8px 8px rgb(240, 26, 55, 0.2)',
        borderColor: 'brand.primary',
      }}
    >
      <Text textAlign="center" mb={8} w="80%" mx="auto" fontSize="1.4rem" fontWeight="400 !important" whiteSpace="pre">
        {type === 'DEPOSIT' ? `Kovan` : 'Optimism'}
      </Text>
      <Box {...fakeButtonStyles}>{type === 'DEPOSIT' ? `Deposit` : `Withdraw`}</Box>
    </Box>
  );

  return (
    <Center mx="auto">
      <Grid templateColumns="1fr 1fr" flexShrink={0} gap={4} width="100%">
        <Card onClick={() => connectToLayer(1)} type="DEPOSIT" />
        <Card onClick={() => connectToLayer(2)} type="WITHDRAW" />
      </Grid>
    </Center>
  );
}

export default ConnectCards;

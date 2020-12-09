import React from 'react';
import { Heading, Box } from '@chakra-ui/react';

export function PageHeader(props) {
  const { children, ...rest } = props;
  return (
    <Heading
      as="h1"
      fontSize={['4xl', '5xl']}
      fontWeight="normal"
      textAlign={['center', null, 'left']}
      color="headingText"
      py={12}
      mx="auto"
      {...rest}
    >
      {children}
    </Heading>
  );
}

export function SectionHeader(props) {
  const { children, noLine, ...rest } = props;
  return noLine ? (
    <Heading
      fontSize={['3xl', '4xl', '5xl']}
      fontWeight="300"
      position="relative"
      color="headingText"
      textAlign={['center', null, 'left']}
      mt={[8, 16, 28]}
      mb={[6, 12, 20]}
      {...rest}
    >
      {children}
    </Heading>
  ) : (
    <Heading
      fontSize={['3xl', '4xl', '5xl']}
      fontWeight="300"
      position="relative"
      color="headingText"
      mt={[8, 16, 28]}
      mb={[6, 12, 20]}
      {...rest}
    >
      <Box
        d={['none', 'block']}
        pos="absolute"
        h="1px"
        width="100%"
        bgColor="brandPrimary"
        top="50%"
        left={0}
      />

      <Box d="inline" bgColor="white" zIndex={1} pos="relative" pl={0} pr={4}>
        {children}
      </Box>
    </Heading>
  );
}

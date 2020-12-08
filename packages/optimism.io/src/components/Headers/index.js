import React from 'react';
import { Heading, Box } from '@chakra-ui/react';

export function PageHeader(props) {
  const { children, ...rest } = props;
  return (
    <Heading
      fontSize="6xl"
      fontWeight="normal"
      textAlign="center"
      color="headingText"
      pb={12}
      mt={0}
      mx="auto"
      borderBottom="2px solid #e5e5e5"
      {...rest}
    >
      {children}
    </Heading>
  );
}

export function SectionHeader(props) {
  const { children, ...rest } = props;
  return props.noLine ? (
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

import React from 'react';
import { Heading } from '@chakra-ui/react';

function PageHeader(props) {
  const { children, ...rest } = props;
  return (
    <Heading
      fontSize="6xl"
      fontWeight="normal"
      textAlign="center"
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

export default PageHeader;

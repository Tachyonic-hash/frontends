import React from 'react';
import { Container } from '@chakra-ui/react';

function ContainerDefault({ children, maxW, ...rest }) {
  return (
    <Container
      maxW={maxW || ['1000px', null, null, null, 'containerLg']}
      px={[4, 8, 16]}
      {...rest}
    >
      {children}
    </Container>
  );
}

export default ContainerDefault;

import React from 'react';
import { Container } from '@chakra-ui/react';

function ContainerDefault({ children, ...rest }) {
  return (
    <Container {...rest} maxW={['1000px', null, null, null, 'containerLg']}>
      {children}
    </Container>
  );
}

export default ContainerDefault;

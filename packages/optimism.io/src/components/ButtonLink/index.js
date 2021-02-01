import React from 'react';
import { Link } from '@chakra-ui/react';

function ButtonLink({ href, children }) {
  return (
    <Link
      fontSize={['xl', '2xl', '3xl']}
      href={href}
      target="_blank"
      rel="noopenner noreferrer"
      borderWidth="1px"
      borderColor="brandPrimary"
      borderStyle="solid"
      px={4}
      py={1}
      borderRadius={'5px'}
    >
      {children}
    </Link>
  );
}

export default ButtonLink;

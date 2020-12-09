import React, { Component } from 'react';
import {
  Container,
  Box,
  Link,
  SimpleGrid,
  VStack,
  Heading,
} from '@chakra-ui/react';
import { Link as ReactLink } from 'react-router-dom';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { navCategories } from '../../constants';
class Footer extends Component {
  render() {
    return (
      <Container backgroundColor="black" maxW="none !important" px="8%">
        <Box as="footer" mt={24} w="100%" maxW="containerLg" mx="auto" pt={12}>
          <SimpleGrid
            gridTemplateColumns={[
              'repeat(2, 1fr)',
              'repeat(2, minmax(max-content,100%))',
              null,
              'repeat(4, minmax(max-content,100%))',
            ]}
            spacingX={[4, 8, 16]}
            spacingY={8}
          >
            {navCategories.map((col, idx) => (
              <VStack alignItems="flex-start" key={idx}>
                <Heading as="h3" color="white" fontSize="xl">
                  {col.heading}
                </Heading>
                {col.items.map((item) =>
                  item.internal ? (
                    <Link
                      key={item.url}
                      as={ReactLink}
                      to={item.url}
                      fontSize={['md', 'lg']}
                      mb={1}
                      color="white"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <Link
                      key={item.url}
                      href={item.url}
                      fontSize={['md', 'lg']}
                      mb={1}
                      color="white"
                      target="_blank"
                      rel="noopenner noreferrer"
                    >
                      {item.name}
                    </Link>
                  )
                )}
              </VStack>
            ))}
          </SimpleGrid>
          <Box maxW="containerLg" py={12} color="white" opacity={0.5}>
            Copybyte Optimism PBC 2020. All flights reserved.
          </Box>
        </Box>
      </Container>
    );
  }
}

export default Footer;

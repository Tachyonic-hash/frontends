import React, { Component } from 'react';
import { Box, Link, SimpleGrid, VStack, Heading } from '@chakra-ui/react';
import Container from '../Container';
import { Link as ReactLink } from 'react-router-dom';
import { navCategories } from '@optimism/common-ui';
import SocialLinks from '../SocialLinks';
class Footer extends Component {
  render() {
    let currentYear = new Date().getFullYear();

    return (
      <Box as="footer" backgroundColor="black" mt={32}>
        <Container pt={8} maxW="1200px">
          <SimpleGrid
            gridTemplateColumns={[
              'repeat(2, 1fr)',
              'repeat(2, minmax(max-content,100%))',
              null,
              'repeat(4, minmax(max-content,100%))'
            ]}
            spacingX={[4, 8, 16]}
            spacingY={8}
          >
            {navCategories.map((col, idx) => (
              <VStack alignItems="flex-start" key={idx}>
                <Heading as="h3" color="white" fontSize="xl">
                  {col.heading}
                </Heading>
                {col.items.map(item =>
                  item.isExternal ? (
                    <Link
                      key={item.url}
                      href={item.url}
                      fontSize={['md', 'lg']}
                      mb={1}
                      color="white"
                      isExternal
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
                    >
                      {item.name}
                    </Link>
                  )
                )}
              </VStack>
            ))}
          </SimpleGrid>
          <Box
            maxW="containerLg"
            py={12}
            color="white"
            d="flex"
            justifyContent="space-between"
          >
            <Box as="span" opacity={0.5}>
              Copybyte Optimism PBC 2020 - {currentYear}. All flights reserved.
            </Box>
            <SocialLinks />
          </Box>
        </Container>
      </Box>
    );
  }
}

export default Footer;

import React, { Component } from 'react';
import { Box, Link, SimpleGrid, VStack, Heading, Container } from '@chakra-ui/react';
import { Link as ReactLink } from 'react-router-dom';
import { navCategories } from '@optimism/common-ui';
import SocialLinks from '../SocialLinks';

class Footer extends Component {
  render() {
    return (
      <Box as="footer" backgroundColor="black">
        <Container pt={8} maxW="1200px">
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
                {col.items.map(item =>
                  item.internal ? (
                    <Link
                      key={item.url}
                      as={ReactLink}
                      to={item.url}
                      fontSize={['md', 'lg']}
                      mb={1}
                      color="white"
                      className="rainbowText"
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
                      className="rainbowText"
                    >
                      {item.name}
                    </Link>
                  )
                )}
              </VStack>
            ))}
          </SimpleGrid>
          <Box maxW="containerLg" py={12} color="white" d="flex" justifyContent="space-between">
            <Box as="span" opacity={0.5}>
              Copybyte Optimism PBC 2020. All flights reserved.
            </Box>
            <SocialLinks />
          </Box>
        </Container>
      </Box>
    );
  }
}

export default Footer;

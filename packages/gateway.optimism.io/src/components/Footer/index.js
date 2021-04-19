import React, { Component } from 'react';
import { Box, Link, SimpleGrid, VStack, Heading, Container } from '@chakra-ui/react';
import { navCategories } from '@optimism/common-ui';
import SocialLinks from '../SocialLinks';
class Footer extends Component {
  render() {
    return (
      <Box as="footer">
        <Container pt={8} maxW="1400px">
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
                <Heading as="h3" fontSize="xl" fontWeight="500 !important" mb={4}>
                  {col.heading}
                </Heading>
                {col.items.map(item => (
                  <Link
                    color="colors.text"
                    key={item.url}
                    href={item.url}
                    fontSize={['md', 'lg']}
                    mb={1}
                    target={item.isExternal ? '_blank' : ''}
                    rel={item.isExternal ? 'noopenner noreferrer' : ''}
                  >
                    {item.name}
                  </Link>
                ))}
              </VStack>
            ))}
          </SimpleGrid>
          <Box maxW="containerLg" py={12} d="flex" justifyContent="space-between">
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

import React, { Component } from 'react';
import { SectionHeader } from '../Headers';
import {
  Container,
  Heading,
  Box,
  Link,
  Text,
  Image,
  SimpleGrid,
} from '@chakra-ui/react';
import news1 from './news1.png';
import news2 from './news2.png';
import news3 from './news3.png';

const posts = [
  {
    heading: 'The Block | Non-techincal',
    title:
      'PG Researchers raise $3.5m from Paradigm and IDEO to start Optimism',
    date: '15 Jan',
    link:
      'https://www.theblockcrypto.com/post/53017/plasma-group-researchers-raise-3-5m-from-paradigm-and-ideo-to-start-new-company',
    img: news1,
  },
  {
    heading: 'Our Blog | Mildly technical',
    title: 'Announcing the Optimistic Virtual Machine (OVM) Alpha',
    date: '11 Feb',
    link:
      'https://medium.com/ethereum-optimism/optimistic-virtual-machine-alpha-cdf51f5d49e',
    img: news2,
  },
  {
    heading: 'Ethresearch | Very technical',
    title:
      'Funding public goods: MEV Auction as a solution to Miner Extractable Value',
    date: '15 Jan',
    link:
      'https://ethresear.ch/t/mev-auction-auctioning-transaction-ordering-rights-as-a-solution-to-miner-extractable-value/6788',
    img: news3,
  },
];

class News extends Component {
  render() {
    return (
      <Container maxW="containerLg">
        <SectionHeader>Light Bedtime Reading</SectionHeader>
        <SimpleGrid columns={[1, null, 3]} spacing={12}>
          {posts.map((item) => (
            <Link
              key={item.link}
              w={['full', '1fr']}
              mb={8}
              color="bodyText"
              to={item.link}
              pos="relative"
              _hover={{ '*': { color: 'inherit' } }}
            >
              <Box
                pos="absolute"
                top={4}
                left={[4, 8, 10, 12]}
                p={2}
                color="#222 !important"
                bgColor="white"
              >
                {item.date}
              </Box>
              <Image w="100%" src={item.img}></Image>
              <Box textAlign="left" px={4}>
                <Text mb={2} fontSize="lg">
                  {item.heading}
                </Text>
                <Heading
                  as="h3"
                  mt={0}
                  fontSize={['xl', '2xl']}
                  fontWeight="500"
                  // color="headingText"
                >
                  {item.title}
                </Heading>
              </Box>
            </Link>
          ))}
        </SimpleGrid>
      </Container>
    );
  }
}

export default News;

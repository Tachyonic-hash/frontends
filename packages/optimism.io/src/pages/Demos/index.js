import React from 'react';
import styles from './Demo.module.css';
import { PageHeader } from '../../components/Headers';
import Container from '../../components/Container';
import {
  Box,
  SimpleGrid,
  HStack,
  Heading,
  Link,
  Image,
  Text,
} from '@chakra-ui/react';
import demosData from './demos.yaml';

function Demos({ match }) {
  return (
    <Container maxW="1200px">
      <PageHeader>Demos</PageHeader>
      {demosData.map((demo, index) => {
        const isEven = index % 2 === 0;
        return (
          <Box textAlign={isEven ? 'right' : 'left'} mb={60}>
            <Box mb={16}>
              <Text fontStyle="italic" mb={0}>
                {demo.name}
              </Text>
              <Heading
                as={Link}
                href={demo.recapLink}
                target="_blank"
                rel="noopenner"
                mt={0}
                fontSize={['3xl', '4xl', '5xl']}
                color="brandPrimary"
              >
                {demo.title}
              </Heading>
              <Text
                fontSize="xl"
                maxW="700px"
                ml={isEven && 'auto'}
                mr={!isEven % 2 !== 0 && 'auto'}
              >
                {demo.subtitle}
              </Text>
            </Box>
            <Box
              d="flex"
              flexDirection={isEven ? 'row' : 'row-reverse'}
              justifyContent="space-between"
              textAlign={isEven ? 'right' : 'left'}
            >
              <Link
                href={demo.appLink}
                w={['100%', null, '60%']}
                d="block"
                target="_blank"
                rel="noopenner"
              >
                <Image w="100%" src={demo.screenCap} alt={demo.title} />
              </Link>
              <Box w={['100%', null, '40%']}>
                <Text mt={0}>good stats</Text>
              </Box>
            </Box>
            <Box>
              <Box
                d="flex"
                flexDir={isEven ? 'row-reverse' : 'row'}
                alignItems="flex-start"
                mt={24}
              >
                <Image
                  pt={8}
                  pr={[0, null, !isEven ? 24 : 0]}
                  pl={[0, null, isEven ? 24 : 0]}
                  filter="grayscale(1)"
                  src={demo.quote.imageUrl}
                  pos="relative"
                />
                <Box pos="relative">
                  <Text
                    fontFamily="serif"
                    fontSize="150px"
                    lineHeight={0}
                    top={0}
                    pos="absolute"
                    mt={'1rem'}
                    ml={'-1rem'}
                  >
                    “
                  </Text>
                  <Text
                    lineHeight="normal"
                    fontSize={['2xl', '3xl']}
                    fontStyle="italic"
                    ml="2rem"
                    textAlign="left"
                  >
                    {demo.quote.text}"
                  </Text>
                  <Box>
                    <Heading as="h4" my={0} textAlign="right">
                      -{demo.quote.author}
                    </Heading>
                    <Text
                      fontWeight="700"
                      mt={0}
                      fontSize="xl"
                      textAlign="right"
                    >
                      {demo.quote.authorTitle}
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        );
      })}
      {/* <div className={styles.demoSection} id="Demo">
          <div className={styles.header}>
            <h1>Synthetix Exchange on the OVM Demo</h1>
            <p>
              This demo represents a milestone in our journey to bring the speed
              of centralized finance to the world of decentralized finance.
            </p>
          </div>
          <div className={styles.demoCard}>
            <div className={styles.flexDemoHeader}>
              <div className={styles.flexItem}>
                <img className={styles.synthetixLogo} src={synthetixlogo}></img>
              </div>
              <a
                href="https://blog.synthetix.io/l2-sx-ovm-demo-results/"
                target="_blank"
              >
                <div className={styles.flexItem}>
                  <button>Demo Recap↗</button>
                </div>
              </a>
            </div>
            <div
              style={{
                background: 'white',
                textAlign: 'left',
                padding: '1.5rem',
                overflow: 'hidden',
              }}
            >
              <h2>Demo Results</h2>
            </div>
            <div className={styles.flexDemoBody}>
              <div className={styles.flexItemLeft}>
                <div className={styles.curveHighlight}>
                  <h4>
                    <span style={{ color: 'red', fontSize: '14' }}>↓</span>143x
                  </h4>
                  <h3>Decrease in L1 Gas Cost</h3>
                  <br></br>
                  <h5> Optimistic Ethereum: 3.3k GAS</h5>
                  <h5> Ethereum: 472.2k GAS</h5>
                </div>
              </div>
              <div className={styles.flexItemRight}>
                <div className={styles.curveHighlight}>
                  <h4>0.3s</h4>
                  <h3>Confirmation Time</h3>
                  <br></br>
                  <h5> Optimistic Ethereum: 0.3 SEC</h5>
                  <h5> Ethereum: 15.0 SEC</h5>
                </div>
              </div>
            </div>
          </div>
        </div> */}
    </Container>
  );
}

export default Demos;

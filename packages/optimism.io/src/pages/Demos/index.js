import React from 'react';
import { PageHeader } from '../../components/Headers';
import Container from '../../components/Container';
import {
  Box,
  Center,
  SimpleGrid,
  HStack,
  Heading,
  Link,
  Image,
  Text,
  StatArrow,
  Divider,
  AspectRatio,
} from '@chakra-ui/react';
import { TriangleDownIcon } from '@chakra-ui/icons';
import demosData from './demos.yaml';

function Demos({ match }) {
  return (
    <Container maxW="1200px">
      <PageHeader>Demos</PageHeader>
      {demosData.map((demo, index) => {
        const isEven = index % 2 === 0;
        return (
          <>
            <Box textAlign={isEven ? 'right' : 'left'} mb={[8, 16]}>
              <Box mb={[8, null, 16]}>
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
                  fontSize={['md', 'lg', 'xl']}
                  maxW="700px"
                  ml={isEven && 'auto'}
                  mr={!isEven % 2 !== 0 && 'auto'}
                >
                  {demo.subtitle}
                </Text>
              </Box>
              <Box
                d="flex"
                flexDirection={['column', null, isEven ? 'row' : 'row-reverse']}
                justifyContent="space-between"
                textAlign={isEven ? 'right' : 'left'}
              >
                <Link
                  href={demo.appLink}
                  w={['100%', null, '80%']}
                  d="block"
                  target="_blank"
                  rel="noopenner"
                  mb={[8, null, 0]}
                  mr={[0, null, isEven ? 4 : 0]}
                  ml={[0, null, !isEven ? 4 : 0]}
                  pos="relative"
                  className={isEven ? 'redAccent--left' : 'redAccent--right'}
                  _after={{ background: "url('images/ethLogo.svg')" }}
                >
                  <Image w="100%" src={demo.screenCap} alt={demo.title} />
                </Link>
                <Box
                  w={['100%', null, '40%']}
                  d="flex"
                  justifyContent={isEven ? 'flex-end' : 'flex-start'}
                >
                  <Box
                    textAlign={['center', null, isEven ? 'right' : 'left']}
                    d={['flex', null, 'block']}
                    flexDir={['column', 'row']}
                    justifyContent={['center', 'space-around']}
                    alignItems="center"
                    mx="auto"
                    w="100%"
                  >
                    <Box w={['100%', '50%', '100%']}>
                      <Text fontSize={['lg', null, 'xl', '2xl']} mb={2} mt={0}>
                        Decrease in Gas Cost
                      </Text>
                      <Text
                        fontSize={[
                          '2.5rem',
                          '2.6rem',
                          '2.7rem',
                          '3rem',
                          '4rem',
                          '5rem',
                        ]}
                        lineHeight={0}
                        mt={0}
                        mb={8}
                      >
                        <TriangleDownIcon color="brandPrimary" />
                        {demo.gasDecrease}
                      </Text>
                    </Box>
                    <Box w={['100%', '50%', '100%']}>
                      <Text fontSize={['lg', null, 'xl', '2xl']} mt={0} mb={2}>
                        Transaction{' '}
                        <Box as="span" d={['block', 'inline', 'block']}>
                          confirmation time
                        </Box>
                      </Text>
                      <Text
                        mt={2}
                        fontSize={[
                          '2.5rem',
                          null,
                          '3rem',
                          null,
                          '4rem',
                          '5rem',
                        ]}
                        lineHeight={0.8}
                        mt={0}
                      >
                        {demo.confTime}
                      </Text>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box
                d={['block', null, null, 'flex']}
                flexDir={['row-reverse', isEven ? 'row-reverse' : 'row']}
                alignItems="flex-start"
                mt={[12, 16, 24]}
                maxW="90%"
                mx="auto"
              >
                <AspectRatio
                  ratio={1}
                  w={['100%', '40%']}
                  minW={['none', '40%']}
                  float={['none', 'right', null, 'none']}
                  mb={[8]}
                  mr={[0, 8, 12, !isEven ? 24 : 0]}
                  ml={[0, 8, null, isEven ? 24 : 0]}
                >
                  <Image
                    borderRadius="100%"
                    filter="grayscale(1)"
                    src={demo.quote.imageUrl}
                    w="100%"
                    alt={demo.quote.author}
                    objectFit="cover"
                  />
                </AspectRatio>
                <Box pos="relative">
                  <Text
                    fontFamily="serif"
                    fontSize={['80px', null, '100px', '150px']}
                    lineHeight={0}
                    top={0}
                    pos="absolute"
                    mt={[-2, null, 0, 2]}
                    ml={[-4, null, -8, -16]}
                  >
                    “
                  </Text>
                  <Text
                    lineHeight="normal"
                    fontSize={['lg', 'xl', null, '2xl']}
                    fontStyle="italic"
                    textAlign="left"
                  >
                    {demo.quote.text}"
                  </Text>
                  <Box>
                    <Heading
                      as="h4"
                      my={0}
                      textAlign="right"
                      fontSize={['2xl', '3xl']}
                    >
                      -{demo.quote.author}
                    </Heading>
                    <Text
                      fontWeight="400"
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
            {index < demosData.length - 1 && <Divider mb={[8, 16]} />}
          </>
        );
      })}
    </Container>
  );
}

export default Demos;

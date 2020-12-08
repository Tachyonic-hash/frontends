import React, { Component } from 'react';
import { Box, Image } from '@chakra-ui/react';
import Container from '../../components/Container';
import { SectionHeader } from '../../components/Headers';
import ethlogo from './ethPlanetPhilosophy.svg';

class Philosophy extends Component {
  render() {
    return (
      <>
        <Box
          boxSizing="content-box"
          popossition="relative"
          height="200px"
          pt="200px"
          w="100%"
          backgroundImage="url('./images/nyancat.png')"
          backgroundPosition="top bottom"
          mt="50px"
          mr="0"
        />
        <div>
          <Container
            pos="relative"
            mt="-13rem"
            ml="auto"
            mr="auto"
            p={['1px 2rem 2.5rem', '1px 10% 2.5rem']}
            background="white"
            textAlign="left"
          >
            <Image
              src={ethlogo}
              alt="ethlogo"
              height={['140px', null, null, '195px']}
              width="160px"
              margin="auto"
              pos="absolute"
              transform={['translate(-50%)', null]}
              left={['50%', null, null, 0]}
              mt={['-6rem', null, null, '-7rem']}
            />
            <SectionHeader
              noLine
              margin={'60px 0'}
              textAlign={['center', null, null, 'left']}
            >
              Our Philosophy
            </SectionHeader>
            <p>
              Optimism is a Public Benefit Corporation (PBC)="a for-profit
              corporation intended to produce a public benefit and operate in a
              responsible and sustainable manner. This means that we are
              obligated to balance the pecuniary interests of our stockholders
              with the best interests of those materially affected by our
              conduct, as well as a specific "public benefit charter" we
              incorporated with.
            </p>
            <p>
              <b>Our PBC charter is as follows:</b>
            </p>
            <p>
              <i>
                The specific public benefit purpose of the Company is to enhance
                and enshrine fair access to public goods on the internet through
                the development of open source software.
              </i>
            </p>
            <p>
              This charter represents our pledge to the Ethereum community to
              uphold its values by producing infrastructure which promotes the
              growth and sustainability of an ecosystem of public goods.
            </p>
          </Container>
        </div>
      </>
    );
  }
}

export default Philosophy;

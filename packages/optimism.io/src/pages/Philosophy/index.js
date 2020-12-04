import React from 'react';
import { Center, Container, Text, Box } from '@chakra-ui/react';
import { PageHeader } from '../../components/Headers';

export default function Philosophy() {
  return (
    <Container maxW="container">
      <PageHeader>Philosophy</PageHeader>
      <div>
        <p>
          Optimism is a Public Benefit Corporation (PBC): a for-profit
          corporation intended to produce a public benefit and operate in a
          responsible and sustainable manner. This means that we are obligated
          to balance the pecuniary interests of our stockholders with the best
          interests of those materially affected by our conduct, as well as a
          specific "public benefit charter" we incorporated with.
        </p>
        <p>
          <b>Our PBC charter is as follows:</b>
        </p>
        <p>
          <i>
            The specific public benefit purpose of the Company is to enhance and
            enshrine fair access to public goods on the internet through the
            development of open source software.
          </i>
        </p>
        <p>
          This charter represents our pledge to the Ethereum community to uphold
          its values by producing infrastructure which promotes the growth and
          sustainability of an ecosystem of public goods.
        </p>
      </div>
    </Container>
  );
}

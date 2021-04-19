import React from 'react';
import { Text, Box, UnorderedList, ListItem, Heading, Link } from '@chakra-ui/react';

function DisclaimerContent() {
  return (
    <Box>
      <Heading mt={0} mb={8} fontSize="1.4rem" fontWeight="300 !important">
        Please read before using Optimism:{' '}
      </Heading>
      <UnorderedList textAlign="left" pl={6} ml={0}>
        <ListItem>Withdrawing requires a wait time of one week.</ListItem>
        <ListItem>
          Optimism is supported by the base-layer security of the Ethereum network, however code vulnerabilities are
          always a risk.
        </ListItem>
        <ListItem>
          Decentralization is a high priority for the Optimism team, but security takes precedence. As such, our
          contracts will remain centrally controlled until the system has been sufficiently battle-tested.
        </ListItem>
        <ListItem>
          Please refer to the{' '}
          <Link href="https://community.optimism.io/faqs" isExternal={true}>
            FAQs
          </Link>{' '}
          or reach out on our{' '}
          <Link href="https://discord.com/invite/jrnFEvq" isExternal={true}>
            discord
          </Link>{' '}
          if you have any questions!
        </ListItem>
      </UnorderedList>
      <Text fontWeight="bold" color="brand.primary" mt={4}>
        There is no benefit to aping into Optimism. Please use at your own risk. ♥
      </Text>
    </Box>
  );
}

export default DisclaimerContent;

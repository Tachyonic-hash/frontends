import React from 'react';
import { Text, Box, UnorderedList, ListItem, Heading, Link } from '@chakra-ui/react';

function DisclaimerContent() {
  return (
    <Box>
      <Heading mt={0} mb={8} fontSize="1.4rem" fontWeight="300 !important">
        Things to know before using Optimism:{' '}
      </Heading>
      <UnorderedList textAlign="left" pl={8}>
        <ListItem>Withdrawing requires a wait time of one week.</ListItem>
        <ListItem>
          Optimism is supported by the base-layer security of the Ethereum network, however code vulnerabilities are
          always a risk (use at your own risk)
        </ListItem>
      </UnorderedList>
      <Text mt={4}>
        Please refer to the{' '}
        <Link href="https://community.optimism.io/faqs" isExternal={true}>
          FAQs
        </Link>{' '}
        or reach out on our{' '}
        <Link href="https://discord.com/invite/jrnFEvq" isExternal={true}>
          discord
        </Link>{' '}
        if you have any questions!
      </Text>
    </Box>
  );
}

export default DisclaimerContent;

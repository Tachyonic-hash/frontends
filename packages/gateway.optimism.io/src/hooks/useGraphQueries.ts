import React from 'react';
import clients from '../graphql/clients';
import { useQuery } from '@apollo/client';
import { GET_ALL_SENT_MSGS, GET_MSG_STATS, GET_ALL_RELAYED_MSGS } from '../graphql/subgraph';

function useGraphQueries(network: string = 'mainnet') {
  const l1Client = network === 'mainnet' ? clients.mainnet.l1 : clients.kovan.l1;
  const l2Client = network === 'mainnet' ? clients.mainnet.l2 : clients.kovan.l2;

  const sentMessagesFromL1 = useQuery(GET_ALL_SENT_MSGS, {
    client: l1Client,
    skip: true,
  });
  const sentMessagesFromL2 = useQuery(GET_ALL_SENT_MSGS, {
    client: l2Client,
    skip: true,
  });

  const relayedMessagesOnL1 = useQuery(GET_ALL_RELAYED_MSGS, { client: l1Client, skip: true });
  const relayedMessagesOnL2 = useQuery(GET_ALL_RELAYED_MSGS, { client: l2Client, skip: true });
  const l1MessageStats = useQuery(GET_MSG_STATS, { client: l1Client });
  const l2MessageStats = useQuery(GET_MSG_STATS, { client: l2Client });

  return {
    sentMessagesFromL2,
    sentMessagesFromL1,
    relayedMessagesOnL1,
    relayedMessagesOnL2,
    l1MessageStats,
    l2MessageStats,
  };
}

export default useGraphQueries;

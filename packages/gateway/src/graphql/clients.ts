import { ApolloClient } from '@apollo/client';
import { InMemoryCache } from 'apollo-cache-inmemory';

export default {
  mainnet: {
    l1: new ApolloClient({
      uri: 'https://api.thegraph.com/subgraphs/name/ethereum-optimism-2/optimism-l1-mainnet',
      cache: new InMemoryCache({}) as any,
    }),
    l2: new ApolloClient({
      uri: 'https://api.thegraph.com/subgraphs/name/ethereum-optimism-2/optimism-l2-mainnet',
      cache: new InMemoryCache({}) as any,
    }),
  },
  kovan: {
    l1: new ApolloClient({
      uri: 'https://api.thegraph.com/subgraphs/name/ethereum-optimism-2/optimism-l1-kovan',
      cache: new InMemoryCache({}) as any,
    }),
    l2: new ApolloClient({
      uri: 'https://api.thegraph.com/subgraphs/name/ethereum-optimism-2/optimism-l2-kovan',
      cache: new InMemoryCache({}) as any,
    }),
  },
};

import { gql } from 'apollo-boost';

const sentMsgTxResponseParams = `
    txHash
    from
    message
    timestamp
    index
`;

export const GET_ALL_SENT_MSGS = gql`
  query sentMessages($indexTo: Int) {
    sentMessages(first: 100, orderBy: index, orderDirection: desc , where: { index_lt: $indexTo }) {
    ${sentMsgTxResponseParams}
  }
}`;

export const GET_SENT_MSGS_BY_ADDRESS = gql`
  query sentMessages($address: String!, $indexTo: Int!) {
    sentMessages(first: 100, orderBy: index, orderDirection: desc , where: { from: $address, index_lt: $indexTo }) {
    ${sentMsgTxResponseParams}
  }
}`;

const relayedMsgTxResponseParams = `
      txHash
      timestamp
      msgHash
`;

export const GET_ALL_RELAYED_MSGS = gql`{
    relayedMessages(first: 100, orderBy: index, orderDirection: desc ) {
    ${relayedMsgTxResponseParams}
    }
  }`;

export const GET_RELAYED_MSGS_BY_HASH_LIST = gql`
  query relayedMessages($searchHashes: [String!]) {
    relayedMessages(first: 100, orderBy: index, orderDirection: desc , where: { msgHash_in: $searchHashes }) {
    ${relayedMsgTxResponseParams}
  }
}`;

export const GET_MSG_STATS = gql`
  {
    messageStats(id: "1") {
      sentMessageCount
      relayedMessageCount
    }
  }
`;

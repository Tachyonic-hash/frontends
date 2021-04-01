export interface TxDirectionType {
  INCOMING: 'INCOMING';
  OUTGOING: 'OUTGOING';
}

export const txDirection: TxDirectionType = {
  INCOMING: 'INCOMING',
  OUTGOING: 'OUTGOING',
};

export const tokens: { [key: string]: TokenSelection } = {
  SNX: {
    name: 'Synthetix',
    symbol: 'SNX',
    iconURL: 'https://assets.coingecko.com/coins/images/3406/small/SNX.png?1598631139',
    id: 'havven',
  },
  ETH: {
    name: 'Ether',
    symbol: 'ETH',
    iconURL: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=010',
    id: 'ethereum',
  },
};
// The Graph's max is 100 for queries using arrays to search over (1000 for regular queries)
export const FETCH_LIMIT = 100;

export const txStatuses = {
  COMPLETE: 'COMPLETE',
  AWAITING: 'AWAITING',
  PENDING: 'PENDING',
};

export const colors = {
  darkBackground: '#1a202c',
  brandPrimary: '#f01a37',
  primaryLowOpacity: 'rgba(240, 26, 55, 0.1)',
  brandSecondary: '#169fc9',
  brandSecondaryLight: '#55bad6',
  brandSecondaryDark: '#0e7ea0',
  secondaryLowOpacity: 'rgba(85, 186, 214, 0.1)',
  complete: '#75cc74',
  awaitingRelay: '#efefa2',
  pending: '#f46969',
};

export const chainIds = {
  MAINNET_L1: 1,
  MAINNET_L2: 10,
  KOVAN_L1: 42,
  KOVAN_L2: 69,
};

// Maps each chain id to its respective layer
export const chainIdLayerMap = {
  [chainIds.MAINNET_L1]: 1,
  [chainIds.KOVAN_L1]: 1,
  [chainIds.MAINNET_L2]: 2,
  [chainIds.KOVAN_L2]: 2,
};

export const oppositeChainIdMap = {
  [chainIds.MAINNET_L1]: chainIds.MAINNET_L2,
  [chainIds.KOVAN_L1]: chainIds.KOVAN_L2,
  [chainIds.MAINNET_L2]: chainIds.MAINNET_L1,
  [chainIds.KOVAN_L2]: chainIds.KOVAN_L1,
};

export const THE_GRAPH_MAX_INTEGER = 2147483647;

declare type GenericObject = { [key: string]: any };

declare type Transaction = {
  account?: string;
  to?: string;
  from?: string;
  message?: string;
  timestamp: number;
  txHash?: string;
  layer1Hash?: string;
  layer2Hash?: string;
  awaitingRelay?: boolean;
  relayedTxTimestamp?: number;
  amount?: bigint;
  index: number;
  msgHash?: string;
  iconURL?: string;
  symbol?: string;
  tokenId?: string;
};

declare type TokenSelection = {
  name: string;
  symbol: string;
  iconURL: string;
  id: string;
};

declare type TransactionType = 'deposits' | 'withdrawals';

declare type Layer = 1 | 2;

declare type BigIntIsh = JSBI | bigint | string;

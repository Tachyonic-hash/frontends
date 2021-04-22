import React from 'react';
type PriceObjectType = { [key: string]: number };

type ContextProps = {
  connectedChainId?: number;
  connectToLayer: (layer?: number) => void;
  screenSm?: boolean;
  screenMd?: boolean;
  screenLg?: boolean;
  isShortScreen?: boolean;
  handleWithdraw?: () => void;
  handleDeposit?: () => void;
  inputValue?: string;
  setInputValue?: (val: string) => void;
  tokenSelection?: TokenSelection;
  userAddress?: string;
  setTokenSelection?: (tokenSelection?: TokenSelection) => void;
  prices?: PriceObjectType;
  setPrices?: (prices: PriceObjectType) => void;
  contracts?: GenericObject;
  isModalOpen?: boolean;
  openModal: (type: string) => void;
  closeModal?: () => void;
  balancesLoading?: boolean;
  l1Balance?: string;
  l2Balance?: string;
  txPending?: boolean;
  swapLayers?: () => void;
  handleDisconnect?: () => void;
  handleClaimWithdrawal?: () => void;
  setWithdrawalClaimMsg?: (msg?: string) => void;
  isConnecting: boolean;
  pendingTxHash?: string;
};

const AppContext = React.createContext<ContextProps>({
  openModal: () => {},
  connectToLayer: () => {},
  isConnecting: false,
});

export default AppContext;

import { ethers } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
import { abis } from '@optimism/common-ui/src/contracts';
import { chainIds, l1ETHGatewayAddress } from './constants';
import { tokens as tokenList } from './tokenLists/optimism.tokenlist.json';

const xDomainInterface = new ethers.utils.Interface(abis.xDomainMessenger);

export const formatNumber = (num: number | string) => {
  return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 20 }).format(+num);
};

export const getBrowserLocales = (options = {}) => {
  const defaultOptions = {
    languageCodeOnly: false,
  };

  const opt = {
    ...defaultOptions,
    ...options,
  };

  const browserLocales = navigator.languages === undefined ? [navigator.language] : navigator.languages;

  if (!browserLocales) {
    return undefined;
  }

  return browserLocales.map(locale => {
    const trimmedLocale = locale.trim();

    return opt.languageCodeOnly ? trimmedLocale.split(/-|_/)[0] : trimmedLocale;
  });
};

export const formatUSD = (num: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);

export const decodeSentMessage = (message: string) => xDomainInterface.decodeFunctionData('relayMessage', message);

export const capitalize = (s: string) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const shortenAddress = (address: string = '', charLength: number = 12) =>
  address.slice(0, charLength + 2) + '...' + address.slice(address.length - charLength, address.length);

export const getRpcProviders = async (chainId: number) => {
  const network = chainId === chainIds.MAINNET_L1 || chainId === chainIds.MAINNET_L2 ? 'mainnet' : 'kovan';
  const l1ProviderUrl = `https://${network}.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`;
  const l2ProviderUrl = `https://${network}.optimism.io`;

  let l1Response;
  let l2Response;
  try {
    l2Response = await fetch(l2ProviderUrl);
    l1Response = await fetch(l2ProviderUrl);
  } catch (err) {
    console.error(err);
  }
  if (l1Response?.status === 200 && l2Response?.status === 200) {
    const rpcL1 = new JsonRpcProvider(l1ProviderUrl);
    const rpcL2 = new JsonRpcProvider(l2ProviderUrl);
    return [rpcL1, rpcL2];
  } else {
    if (!l1Response?.status) {
      throw Error(`${l1ProviderUrl} not responsive`);
    } else if (l1Response?.status !== 200) {
      throw Error(`${l1ProviderUrl} returned ${l1Response?.status} error.`);
    } else if (!l2Response?.status) {
      throw Error(`${l2ProviderUrl} not responsive`);
    } else if (l2Response?.status !== 200) {
      throw Error(`${l2ProviderUrl} returned ${l2Response?.status} error.`);
    }
    return [];
  }
};

export const getAddresses = (token: string = 'ETH', connectedChainId: number = 0) => {
  const network =
    connectedChainId === chainIds.MAINNET_L1 || connectedChainId === chainIds.MAINNET_L2 ? 'mainnet' : 'kovan';

  if (!network) console.error('unsupported network!');

  // Gets token bridge addressses from token list json (ETH only exists as a token on L2 so its addresses are hardcoded)
  if (token !== 'ETH') {
    const l1Data = tokenList.find(
      (tokenData: any) =>
        tokenData.symbol === token &&
        ((tokenData.chainId === chainIds.KOVAN_L1 && network === 'kovan') ||
          (tokenData.chainId === chainIds.MAINNET_L1 && network === 'mainnet'))
    );
    const l2Data = tokenList.find(
      (tokenData: any) =>
        tokenData.symbol === token &&
        ((tokenData.chainId === chainIds.KOVAN_L2 && network === 'kovan') ||
          (tokenData.chainId === chainIds.MAINNET_L2 && network === 'mainnet'))
    );
    const l1Address =
      ethers.utils.isAddress(l1Data?.extensions.optimismBridgeAddress || '') &&
      l1Data?.extensions.optimismBridgeAddress;
    const l2Address =
      ethers.utils.isAddress(l2Data?.extensions.optimismBridgeAddress || '') &&
      l2Data?.extensions.optimismBridgeAddress;

    return [l1Address || '', l2Address || ''];
  }
  return [l1ETHGatewayAddress[network], '0x4200000000000000000000000000000000000006'];
};

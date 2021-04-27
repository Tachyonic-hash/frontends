import erc20 from './abis/erc20.json';
import SynthetixBridgeToBase from './abis/SynthetixBridgeToBase.json';
import SynthetixBridgeToOptimism from './abis/SynthetixBridgeToOptimism.json';
import xDomainMessenger from './abis/XDomainMessenger.json';
import iOVM_L1ETHGateway from './abis/iOVM_L1ETHGateway.json';
import OVM_ETH from './abis/OVM_ETH.json';
import OVM_StateCommitmentChain from './abis/OVM_StateCommitmentChain.json';

const abis = {
  l1: {
    standardBridge: iOVM_L1ETHGateway,
    snxBridge: SynthetixBridgeToOptimism,
    OVM_StateCommitmentChain,
  },
  l2: {
    standardBridge: OVM_ETH,
    snxBridge: SynthetixBridgeToBase,
  },
  erc20,
  xDomainMessenger,
};

export default abis;

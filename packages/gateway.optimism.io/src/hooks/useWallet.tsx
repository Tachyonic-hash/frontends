import React from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { Link, useColorMode, Text } from '@chakra-ui/react';
import { ethers } from 'ethers';
import Notify, { API } from 'bnc-notify';
import { Contract } from '@ethersproject/contracts';
import { abis } from '../contracts';
import useToast from './useToast';
import usePendingTxHash from '../hooks/usePendingTxHash';
import { modalTypes } from '../components/Modal';
import { chainIdLayerMap, chainIds } from '../utils/constants';
import { formatNumber, getRpcProviders, getAddresses, Sentry } from '../utils/helpers';

type UseWalletProps = {
  isModalOpen: boolean;
  openModal: (type: string) => void;
  closeModal: () => void;
};

function useWallet({ isModalOpen, openModal, closeModal }: UseWalletProps) {
  const [isConnecting, setIsConnecting] = React.useState(false);
  const { showErrorToast, showInfoToast, showSuccessToast, toastIdRef, toast, warningLinkColor } = useToast();
  const [notify, setNotify] = React.useState<API | undefined>();
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [walletProvider, setWalletProvider] = React.useState<Web3Provider | undefined>(undefined);
  const [userAddress, setUserAddress] = React.useState<string | undefined>();
  const [connectedChainId, setConnectedChainId] = React.useState<number | undefined>(undefined);
  const [balancesLoading, setBalancesLoading] = React.useState<boolean>(false);
  const [pendingTxHash, setPendingTxHash]: any = usePendingTxHash();
  const [l1Balance, setL1Balance] = React.useState('0');
  const [l2Balance, setL2Balance] = React.useState('0');
  const [contracts, setContracts] = React.useState<GenericObject | undefined>(undefined);
  const [inputValue, setInputValue] = React.useState('0');
  const { colorMode } = useColorMode();

  const handleAccountChanged = React.useCallback(
    async ([newAddress]) => {
      if (newAddress && closeModal) {
        closeModal();
        setUserAddress(newAddress);
        toast.close(toastIdRef.current as any);
        return;
      }
      // if this is reached, it means the user has disconnected metamask
      window.location.reload();
    },
    [closeModal, toast, toastIdRef]
  );

  /** Connect to wallet provider */
  const connectToLayer = React.useCallback(
    async (layer?: number) => {
      if (!closeModal) return;
      // If attempting to connect to connected network, abort
      if (connectedChainId && layer === chainIdLayerMap[connectedChainId]) {
        closeModal();
        showInfoToast('Already connected.');
        return;
      }

      if (!(window as any).ethereum) {
        const message = 'Metamask not found. Please install it before continuing. More wallet support coming soon.';
        showErrorToast(message);
        Sentry.captureEvent(Error(message));
        console.error(message);
      }

      // connect to wallet if not connected yet
      let provider = walletProvider;
      if (!provider) {
        if (!(window as any).ethereum) {
          showErrorToast('Metamask not found.');
        } else {
          try {
            await (window as any).ethereum.enable();
            // using 'any' for the network as per the instructions here https://github.com/ethers-io/ethers.js/issues/866
            provider = new ethers.providers.Web3Provider((window as any).ethereum, 'any');
          } catch (error) {
            if (error.message.includes("Request of type 'wallet_requestPermissions'")) {
              showErrorToast('Please approve connection in Metamask');
            }
            Sentry.captureEvent(error);
            console.error(error);
          }
        }
      }
      if (!provider) return;

      const chainId = (await provider.getNetwork()).chainId;

      // Bail out if this is an unsupported network
      if (!chainIdLayerMap[chainId]) {
        showErrorToast(`Network not supported. Please change to Kovan or Mainnet`);
        setBalancesLoading(false);
        return;
      }

      // If layer isn't provided, it means we're connecting programatically (ex: after browser refresh)
      if (!layer) {
        layer = chainIdLayerMap[chainId];
      }

      if (layer === 1) {
        // If connected network isn't a supported L1, abort (error message gets triggered elsewhere)
        if (!chainIdLayerMap[chainId]) {
          return;
        }
        // If user is trying to connect to L1 from an unconnected state, show message
        if (chainId === chainIds.MAINNET_L2 || chainId === chainIds.KOVAN_L2) {
          const network =
            connectedChainId === chainIds.MAINNET_L2
              ? 'Mainnet'
              : connectedChainId === chainIds.KOVAN_L2
              ? 'Kovan'
              : '';
          showInfoToast(`Please switch to layer 1 via MetaMask.`);
          return;
        }
      } else {
        // If there is a chainId, switch to the corresponding network on the other layer
        let network;
        if (chainId) {
          network = chainId === chainIds.MAINNET_L1 || chainId === chainIds.MAINNET_L2 ? 'mainnet' : 'kovan';
        } else {
          showErrorToast('Network not supported or not connected');
          return;
        }
        try {
          // add L2 network
          await provider.send('wallet_addEthereumChain', [
            {
              chainId:
                network === 'mainnet' ? '0x' + chainIds.MAINNET_L2.toString(16) : '0x' + chainIds.KOVAN_L2.toString(16),
              chainName: network === 'mainnet' ? 'Optimism' : 'Optimistic Kovan',
              rpcUrls: [`https://${network}.optimism.io`],
              nativeCurrency: {
                name: 'Optimism ETH',
                symbol: 'ETH',
                decimals: 18,
              },
              blockExplorerUrls: [`https://${network === 'kovan' ? 'kovan-' : ''}explorer.optimism.io/`],
            },
          ]);
        } catch (err) {
          showErrorToast(
            <>
              Something went wrong. If you continue to experience problems, reach out to us on{' '}
              <Link
                href="https://discord.com/invite/jrnFEvq"
                isExternal={true}
                textDecoration="underline"
                color={`${warningLinkColor} !important`}
              >
                Discord
              </Link>
              .
            </>
          );
          Sentry.captureEvent(err);
          return;
        }
      }
      try {
        const [rpcL1, rpcL2] = await getRpcProviders(chainId);
        const [l1Address, l2Address] = getAddresses('ETH', chainId);
        if (l1Address && l2Address) {
          const contracts = {
            l1: new Contract(l1Address, abis.l1.standardBridge, rpcL1),
            l2: new Contract(l2Address, abis.l2.standardBridge, rpcL2),
          };
          setContracts(contracts);
        }
      } catch (err) {
        Sentry.captureEvent(err);
        console.error(err);
      }
      setConnectedChainId(chainId);
      setWalletProvider(provider);
      const userAddress = (await provider.listAccounts())[0];
      setUserAddress(userAddress);
      closeModal();
      localStorage.setItem('previouslyConnected', 'true');
    },
    [closeModal, connectedChainId, showErrorToast, showInfoToast, walletProvider, warningLinkColor]
  );

  const handleDeposit = async () => {
    if (!walletProvider || !contracts || !notify || !openModal || !closeModal) return;
    if (Number(inputValue) <= 0) {
      showInfoToast('Please enter a deposit amount greater than zero. 😉');
      return;
    }
    if (!isModalOpen) {
      // show confirmation modal if user hasn't seen it yet
      openModal(modalTypes.CONFIRM_DEPOSIT);
    } else {
      try {
        const signer = walletProvider.getSigner();
        const receipt = await contracts.l1
          .connect(signer)
          .deposit({ value: ethers.utils.parseUnits(inputValue.toString(), 18) });
        const { emitter } = notify.hash(receipt.hash);
        setInputValue('0');
        setPendingTxHash(receipt.hash);
        openModal(modalTypes.DEPOSIT_PENDING);
        emitter.on('all', (tx: GenericObject) => {
          if (tx.status === 'confirmed') {
            notify.unsubscribe(receipt.hash);
            setBalance(1);
          }
          return {
            autoDismiss: 10000,
            link: `https://${connectedChainId === chainIds.KOVAN_L1 ? 'kovan.' : ''}etherscan.io/tx/${tx.hash}`,
          };
        });
      } catch (err) {
        console.error(err);
        Sentry.captureEvent(err);
        showErrorToast(err.message);
      }
    }
  };

  const handleWithdraw = async () => {
    if (!walletProvider || !contracts || !openModal || !closeModal) return;
    if (Number(inputValue) <= 0) {
      showInfoToast('Please enter a withdrawal amount greater than zero. 😉');
      return;
    }
    if (!isModalOpen) {
      // show confirmation modal if user hasn't seen it yet
      openModal(modalTypes.CONFIRM_WITHDRAWAL);
    } else {
      try {
        const signer = walletProvider.getSigner();
        const receipt = await contracts.l2
          .connect(signer)
          .withdraw(ethers.utils.parseUnits(inputValue.toString(), 18), { gasLimit: 21000 });
        if (receipt) {
          setPendingTxHash(receipt.hash);
          setBalance(2);
        }
        // TODO: set up etherscan to poll for pending transactions & update the balance if it changes

        setInputValue('0');
        openModal(modalTypes.WITHDRAWAL_PENDING);
      } catch (err) {
        console.error(err);
        Sentry.captureEvent(err);
        showErrorToast(err.message);
      }
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('previouslyConnected');
    window.location.reload();
  };

  const handleClaimWithdrawal = () => {
    console.log('handleClaimWithdrawal');
  };

  const setBalance = React.useCallback(
    async layer => {
      if (layer === 1) {
        const [rpcL1] = await getRpcProviders(connectedChainId as number);
        // set balances
        const ethBalance = await rpcL1.getBalance(userAddress as string);
        setL1Balance(formatNumber(ethers.utils.formatEther(ethBalance)));
      } else if (layer === 2) {
        const ethL2Balance = await (contracts as GenericObject).l2.balanceOf(userAddress);
        setL2Balance(formatNumber(ethers.utils.formatEther(ethL2Balance)));
      }
      setBalancesLoading(false);
    },
    [connectedChainId, contracts, userAddress]
  );

  /**
   * Initializer (runs only once)
   */
  React.useEffect(() => {
    (async () => {
      if (!isInitialized) {
        if ((window as any).ethereum) {
          (window as any).ethereum.on('chainChanged', async (chainIdHex: any) => {
            // const newChainId = parseInt(chainIdHex, 10);
            // if (newChainId !== connectedChainId) {
            setIsConnecting(true);
            await connectToLayer();
            setIsConnecting(false);
            // }
          });
          (window as any).ethereum.on('accountsChanged', handleAccountChanged);

          // automatically connect wallet if the user has previously connected
          if (localStorage.getItem('previouslyConnected')) {
            try {
              setIsConnecting(true);
              await connectToLayer();
              setIsConnecting(false);
            } catch (err) {
              Sentry.captureEvent(err);
              console.error(err);
            }
          }
          setIsInitialized(true);
        } else {
          const message = 'Metamask not found.';
          showErrorToast(message);
          console.error(message);
          Sentry.captureEvent(Error(message));
        }
      }
    })();
  }, [connectToLayer, connectedChainId, handleAccountChanged, isInitialized, showErrorToast]);

  /**
   * Set balances when dependencies change
   */
  React.useEffect(() => {
    (async () => {
      if (contracts && userAddress && connectedChainId) {
        try {
          setBalance(1); // layer 1
          setBalance(2); // layer 2
        } catch (err) {
          console.error(err);
          Sentry.captureEvent(err);
          showErrorToast();
        }
      }
    })();
  }, [contracts, connectedChainId, showErrorToast, userAddress, setBalance]);

  React.useEffect(() => {
    if (contracts && userAddress) {
      const depositFilter = contracts.l2.filters.DepositFinalized(userAddress);
      const withdrawalFilter = contracts.l1.filters.WithdrawalFinalized(userAddress);

      contracts.l2.on(depositFilter, async (target: string, amount: ethers.BigNumber, tx: GenericObject) => {
        const ethL2Balance = await contracts.l2.balanceOf(userAddress);
        setL2Balance(formatNumber(ethers.utils.formatEther(ethL2Balance)));
        setPendingTxHash(null);
        const network = connectedChainId === chainIds.MAINNET_L1 ? 'mainnet' : 'kovan';

        // // TODO: figure out how to prevent this from rendering multiple times
        // showSuccessToast(
        //   <>
        //     Deposit finalized on Optimism. Click{' '}
        //     <Link
        //       href={`https://${network === 'kovan' ? 'kovan-' : ''}explorer.optimism.io/tx/${tx.transactionHash}`}
        //       isExternal={true}
        //       color={'text'}
        //       textDecoration="underline"
        //     >
        //       here
        //     </Link>{' '}
        //     to see the details.
        //   </>,
        //   999999999 // arbitrarily long duration
        // );
      });
      contracts.l1.on(withdrawalFilter, (target: string, amount: ethers.BigNumber, tx: GenericObject) => {
        // TODO: this will only be triggered if the user recently did a self-withdrawal on the txs page
      });
    }
  }, [connectedChainId, contracts, setPendingTxHash, showSuccessToast, userAddress]);

  /**
   * Initializes Blocknative Notify widget
   */
  React.useEffect(() => {
    if (
      walletProvider &&
      connectedChainId &&
      (connectedChainId === chainIds.MAINNET_L1 || connectedChainId === chainIds.KOVAN_L1)
    ) {
      // Init tx notifications
      const notify = Notify({
        dappId: process.env.REACT_APP_BLOCKNATIVE_KEY, // [String] The API key created by step one above
        networkId: connectedChainId, // [Integer] The Ethereum network ID your Dapp uses.
        darkMode: colorMode === 'dark',
        notifyMessages: {
          en: {
            transaction: {
              txConfirmed: 'Deposit sent to Optimism! Click this message to see it on Etherscan.',
            },
            watched: {},
            time: {},
          },
        },
      });

      setNotify(notify);
    }
  }, [colorMode, connectedChainId, walletProvider]);

  function swapLayers() {
    if (chainIdLayerMap[connectedChainId || 0] === 1) {
      connectToLayer(2);
    } else {
      connectToLayer(1);
    }
  }

  return {
    connectToLayer,
    handleWithdraw,
    handleDeposit,
    swapLayers,
    connectedChainId,
    contracts,
    userAddress,
    inputValue,
    notify,
    balancesLoading,
    l1Balance,
    l2Balance,
    txPending: false, // TODO: replace pendingTxHash with etherscan api
    setInputValue,
    handleDisconnect,
    handleClaimWithdrawal,
    isConnecting,
    pendingTxHash,
  };
}

export default useWallet;

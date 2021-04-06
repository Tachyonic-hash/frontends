import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Container, useDisclosure, useMediaQuery } from '@chakra-ui/react';
import ETHGateway from './pages/ETHGateway';
import TxHistory from './pages/TxHistory';
import HeaderNav from './components/HeaderNav';
import Footer from './components/Footer';
import Modal, { modalTypes } from './components/Modal';
import useWallet from './hooks/useWallet';
import AppContext from './context';
import { tokens } from './constants';

function App() {
  const { isOpen: isModalOpen, onOpen: openModal, onClose: closeModal } = useDisclosure();
  const handleOpenModal = (type: string) => {
    setCurrentModal(type);
    openModal();
  };
  const {
    connectToLayer,
    handleWithdraw,
    handleDeposit,
    connectedChainId,
    contracts,
    userAddress,
    inputValue,
    setInputValue,
    balancesLoading,
    l1Balance,
    l2Balance,
    txPending,
    swapLayers,
    handleDisconnect,
  } = useWallet({ isModalOpen, openModal: handleOpenModal, closeModal });
  const { isOpen: isMobileDrawerOpen, onOpen: openMobileDrawer, onClose: closeMobileDrawer } = useDisclosure();
  const [tokenSelection, setTokenSelection] = React.useState<TokenSelection | undefined>(undefined);
  const [prices, setPrices] = React.useState({});
  const [screenSm, screenMd, screenLg] = useMediaQuery([
    '(min-width: 600px)',
    '(min-width: 1024px)',
    '(min-width: 1200px)',
  ]);
  const [currentModal, setCurrentModal] = React.useState<string>(modalTypes.WELCOME);

  React.useEffect(() => {
    const getPrices = () => {
      const tokensArray = Object.values(tokens);
      const tokenString = tokensArray.reduce((fullString, token, i) => {
        fullString += token.id;
        if (i < tokensArray.length - 1) {
          fullString += '%2C';
        }
        return fullString;
      }, '');
      fetch(`
          https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${tokenString}&order=market_cap_desc&per_page=100&page=1&sparkline=false`)
        .then(res => res.json())
        .then(tokenDataList => {
          const priceObject: { [key: string]: number } = {};
          for (const tokenData of tokenDataList) {
            priceObject[tokenData.id as string] = tokenData.current_price;
          }
          setPrices(priceObject);
        })
        .catch(console.error);
    };
    getPrices();
    const intervalId = window.setInterval(getPrices, 10000);
    return () => {
      window.clearInterval(intervalId as number);
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        prices,
        tokenSelection,
        setTokenSelection,
        connectedChainId,
        isModalOpen,
        connectToLayer,
        handleWithdraw,
        handleDeposit,
        contracts,
        userAddress,
        inputValue,
        setInputValue,
        screenSm,
        screenMd,
        screenLg,
        openModal: handleOpenModal,
        balancesLoading,
        l1Balance,
        l2Balance,
        txPending,
        swapLayers,
        handleDisconnect,
      }}
    >
      <Container maxW={'1400px'} py={2} px={4} minH="calc(100vh)">
        <Modal isOpen={isModalOpen} onClose={closeModal} currentModal={currentModal} />
        <HeaderNav
          isMobileDrawerOpen={isMobileDrawerOpen}
          openMobileDrawer={openMobileDrawer}
          closeMobileDrawer={closeMobileDrawer}
          connectedChainId={connectedChainId}
          userAddress={userAddress}
          openModal={handleOpenModal}
        />
        <Switch>
          <Route exact={true} path="/">
            <ETHGateway />
          </Route>
          <Route path="/txs/:address">
            <TxHistory />
          </Route>
          <Route exact={true} path="/txs">
            <TxHistory />
          </Route>
          <Route exact={true} path="/admin">
            <TxHistory isAdmin={true} />
          </Route>
        </Switch>
      </Container>
      <Footer />
    </AppContext.Provider>
  );
}

export default App;

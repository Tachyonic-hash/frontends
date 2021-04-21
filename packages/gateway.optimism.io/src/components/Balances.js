import React from 'react';
import {
  Box,
  Image,
  Heading,
  HStack,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useColorModeValue,
  Button,
  Spinner,
  IconButton,
  Switch,
} from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import OptimismButton from './OptimismButton';
import { ArrowDownIcon } from '@chakra-ui/icons';
import { chainIdLayerMap, chainIds } from '../constants';
import { modalTypes } from './Modal';
import AppContext from '../context';

const MaxButton = ({ onClick }) => (
  <Button opacity={0.8} bg="transparent" p={0.5} _focus={{ boxShadow: 'none' }} onClick={onClick} height="auto">
    Max
  </Button>
);

const TopRow = ({
  balancesLoading,
  balance,
  setInputValue,
  inputValue,
  heading,
  handleTransaction,
  bg,
  isDisabled,
  screenSm,
}) => {
  const handleMaxValue = () => {
    setInputValue(balance);
  };
  return (
    <>
      <Heading size="sm" mt={0} mb={2} px={2} fontWeight="400 !important">
        {heading}
      </Heading>
      <Box borderRadius="20px" pt={2} padding="1rem 1rem 1.5rem" bg={bg}>
        <Box>
          <AccentText />
          <Box d="flex" alignItems="center" mb={4} justifyContent="space-between">
            <Box fontSize="1.125rem" d="flex" alignItems="center">
              <Image d="inline" w={5} h={5} mr={2} src="/logos/ETH.svg" alt="ETH Logo" />
              <Button
                mr={2}
                fontSize="1.125rem"
                bg="transparent !important"
                fontWeight="300 !important"
                whiteSpace="pre"
                overflow="hidden"
                textOverflow="ellipsis"
                maxW={screenSm ? 'none' : '130px'}
                minW={0}
                padding={0}
                onClick={handleMaxValue}
                height="auto"
                d="inline"
              >
                {balancesLoading ? <Spinner size="xs" /> : balance}
              </Button>
              ETH
            </Box>
            <MaxButton onClick={handleMaxValue} />
          </Box>
        </Box>
        <div />
        <Box d="flex" alignItems="center" w="100%">
          <NumberInput
            placeholder="Amount"
            defaultValue={0}
            onChange={val => setInputValue(val)}
            value={inputValue}
            min={0}
            max={balance}
            step={0.1}
            w="100%"
            isDisabled={isDisabled}
          >
            <NumberInputField fontSize="1.5rem" h="50px" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Text ml={4} fontSize="1.2rem" d="flex" alignItems="center" justifyContent="center">
            ETH
          </Text>
        </Box>
      </Box>
    </>
  );
};

const AccentText = () => (
  <Text fontSize="1.125rem" opacity={0.7} mb={2} d="flex" alignItems="center">
    Balance
  </Text>
);

function Balances({ openModal }) {
  const {
    connectedChainId,
    l1Balance,
    l2Balance,
    balancesLoading,
    inputValue,
    setInputValue,
    handleDeposit,
    handleWithdraw,
    swapLayers,
    screenSm,
    isConnecting,
  } = React.useContext(AppContext);
  const sectionBg = useColorModeValue('white', 'gray.800');
  const connectedLayer = chainIdLayerMap[connectedChainId];
  const network =
    connectedChainId === chainIds.MAINNET_L1 || connectedChainId === chainIds.MAINNET_L2 ? 'mainnet' : 'kovan';

  return (
    <>
      <Box pb={12} d="flex" justifyContent="space-between">
        <Box d="flex" top="-10px" left="-10px" pos="relative" alignItems="center">
          <IconButton
            variant="outline"
            borderWidth={0}
            colorScheme="teal"
            aria-label="Call Sage"
            fontSize="20px"
            borderRadius="100%"
            opacity="0.6"
            onClick={() => openModal(modalTypes.INFO)}
            icon={<InfoOutlineIcon color="brand.secondary" />}
          />
          {/* <Box fontSize="1.2rem" opacity="0.8" ml={2}>
            {connectedLayer === 1 ? 'Deposit ETH' : connectedLayer === 2 ? 'Withdraw ETH' : ''}
          </Box> */}
        </Box>
        {connectedLayer ? (
          <Box>
            <Box as="span" mr={3} opacity={connectedLayer === 1 ? 1 : 0.5}>
              Deposit
            </Box>
            <Switch onChange={swapLayers} isChecked={connectedLayer === 2} />
            <Box as="span" ml={3} opacity={connectedLayer === 2 ? 1 : 0.5}>
              Withdraw
            </Box>
          </Box>
        ) : !isConnecting ? (
          <Text color="brand.primary">Not connected</Text>
        ) : null}
      </Box>

      {!connectedLayer || connectedLayer === 1 ? (
        <TopRow
          balance={l1Balance}
          setInputValue={setInputValue}
          heading={connectedLayer ? network.toUpperCase() : ''}
          handleTransaction={handleDeposit}
          inputValue={inputValue}
          bg={sectionBg}
          isDisabled={connectedLayer === null}
          balancesLoading={balancesLoading}
          screenSm={screenSm}
        />
      ) : (
        <TopRow
          balance={l2Balance}
          inputValue={inputValue}
          setInputValue={setInputValue}
          heading={connectedLayer ? 'OPTIMISM' : ''}
          handleTransaction={handleWithdraw}
          bg={sectionBg}
          balancesLoading={balancesLoading}
          screenSm={screenSm}
        />
      )}
      <ArrowDownIcon
        w="1.5rem"
        h="1.5rem"
        mx="auto"
        my="1rem"
        d="block"
        background="transparent !important"
        boxShadow="none !important"
        color={connectedLayer ? 'brand.primary' : 'inherit'}
      />
      <Heading size="sm" mt={0} mb={2} px={2} fontWeight="400 !important">
        {connectedLayer === 2
          ? network.toUpperCase()
          : connectedLayer === 1
          ? `${network === 'kovan' ? 'KOVAN ' : ''}OPTIMISM`
          : ''}
      </Heading>
      <Box px={4} borderWidth="1px" borderRadius="20px" py="1rem">
        <AccentText />
        <Box
          fontSize="1.125rem !important"
          whiteSpace="pre"
          textOverflow="ellipsis"
          overflow="hidden"
          justifyContent="flex-start"
        >
          <Image d="inline" w={5} h={5} mr={2} src="/logos/ETH.svg" alt="ETH Logo" />
          {balancesLoading ? <Spinner size="xs" /> : connectedLayer === 2 ? l1Balance : l2Balance} ETH
        </Box>
      </Box>
      <HStack spacing={8} pt={12}>
        {connectedLayer === 1 ? (
          <OptimismButton size="huge" onClick={handleDeposit} textTransform="uppercase">
            Deposit
          </OptimismButton>
        ) : connectedLayer === 2 ? (
          <OptimismButton size="huge" onClick={handleWithdraw} textTransform="uppercase">
            Withdraw
          </OptimismButton>
        ) : (
          <OptimismButton size="huge" onClick={() => openModal(modalTypes.CHOOSE_NETWORK)} textTransform="uppercase">
            Connect
          </OptimismButton>
        )}
      </HStack>
    </>
  );
}

export default Balances;

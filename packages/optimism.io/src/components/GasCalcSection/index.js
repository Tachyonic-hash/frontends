import React from 'react';
import {
  Input,
  Text,
  Heading,
  Box,
  Image,
  Button,
  Spinner,
  Center,
  Divider,
  useToast,
  useMediaQuery,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  SimpleGrid
} from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import styles from './GasCalc.module.css';
import { ethers } from 'ethers';
import axios from 'axios';
import coloredEthLogo from './coloredEthLogo.svg';
import Formula from './Formula';
import GasCalcResults from './GasCalcResults';

const options = {
  chainlink: {
    name: 'Chainlink',
    link:
      'https://etherscan.io/tx/0x6421837fa962982a7d74da713292e92c1989b580888fd76503d2e994349a1745',
    desc: 'Chainlink oracle update',
    iconURL:
      'https://pbs.twimg.com/profile_images/1030475757892579334/qvSHhRyC_400x400.jpg'
  },
  uniswap: {
    name: 'Uniswap',
    link:
      'https://etherscan.io/tx/0xede50390e4db646946eeacee58f0ad0f0778d46486c2da6f38da0f8a1f6c791e',
    desc: 'Uniswap trade',
    iconURL:
      'https://pbs.twimg.com/profile_images/1242184851152928769/wG2eTAfD_400x400.jpg'
  },
  synthetix: {
    name: 'Synthetix',
    link:
      'https://etherscan.io/tx/0x3a4d99fd0f1e2b14ca42cbfbf4fe8891dd969b3e2af076f194668002d83d036a',
    desc: 'Synthetix exchange',
    iconURL: '/images/snx-logo.png'
  },
  makerdao: {
    name: 'MakerDAO',
    link:
      'https://etherscan.io/tx/0x0c3b6a407d8ca407fd38409e75035f9e2df6b04a234e073e74284f0ed273c066',
    desc: 'MakerDAO pooled ETH conversion',
    iconURL: '/images/mkr-logo.png'
  },
  compound: {
    name: 'Compound',
    link:
      'https://etherscan.io/tx/0x7ce9cd92a82113a8d935d73cc55ce36ba5bd9dde3dad2c0140cf73081d8079fe',
    desc: 'Borrow DAI',
    iconURL: '/images/comp-logo.png'
  }
};

const optionLinks = Object.values(options).map(o => o.link);

const Logo = () => (
  <Box
    background="url(/images/optimism-logo.svg)"
    bgSize="contain"
    bgPos="center"
    bgRepeat="no-repeat"
    w="25px"
    h="25px"
    pos="relative"
  />
);

const GasCalcSection = () => {
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [containsLink, setContainsLink] = React.useState(true);
  const [txId, setTxId] = React.useState('chainlink');
  const [etherscanLink, setEtherscanLink] = React.useState(
    txId ? options[txId].link : null
  );
  const [isCalculating, setIsCalculating] = React.useState(true);
  const [l1Gas, setL1Gas] = React.useState(0);
  const [l2Gas, setL2Gas] = React.useState(0);
  const [zeroBytes, setZeroBytes] = React.useState(0);
  const [dataBytes, setDataBytes] = React.useState(0);
  const [gasSaved, setGasSaved] = React.useState(0);
  const [l1GasPrice, setL1GasPrice] = React.useState(0);
  const [l2UsdPrice, setL2UsdPrice] = React.useState(0);
  const [showHeading, setShowHeading] = React.useState(true);
  const toast = useToast();

  const handleInputOverride = id => {
    setTxId(id);
    setEtherscanLink(options[id].link);
    setContainsLink(true);
    setShowHeading(true);
    handleFormSubmit(null, options[id].link);
  };

  const handleFormSubmit = React.useCallback(
    async (e, link) => {
      const txLink = link || etherscanLink;
      if (e) e.preventDefault();
      if (!containsLink) {
        toast({
          title: 'Invalid link',
          description: 'Please check the link and try again',
          status: 'error',
          duration: 3000,
          isClosable: true
        });
        return;
      }

      setIsCalculating(true);
      setShowHeading(optionLinks.includes(link));

      try {
        const provider = new ethers.providers.JsonRpcProvider(
          `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`
        );
        const gasPrice = await provider.getGasPrice();
        setL1GasPrice(
          parseFloat(ethers.utils.formatUnits(gasPrice.toString(), 'gwei'))
        );
        const txHash = txLink.substr(txLink.indexOf('0x'));
        const txReceipt = await provider.getTransactionReceipt(txHash);
        const txData = await provider.getTransaction(txHash);
        const no0x = txData.data.substr(2);
        let zeroBytes = 0;
        let dataBytes = 0;
        for (let j = 0; j < no0x.length; j += 2) {
          const curByte = no0x.substr(j, 2);
          if (curByte === '00') {
            zeroBytes++;
          } else {
            dataBytes++;
          }
        }
        dataBytes += 32; // 32 byte state root
        setZeroBytes(zeroBytes);
        setDataBytes(dataBytes);
        const l2Gas = zeroBytes * 4 + dataBytes * 16 + 2661; // batch submission computational overhead (assuming 200tx per batch)
        const gasSaved = (txReceipt.gasUsed.toNumber() / l2Gas).toFixed(1);
        const l1Fee = await feeInUSD(txData.gasPrice, txReceipt.gasUsed);
        setL2UsdPrice((l1Fee / gasSaved).toFixed(2));
        setIsCalculating(false);
        setL1Gas(
          txReceipt.gasUsed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        );
        setL2Gas(l2Gas.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        setGasSaved(gasSaved);
      } catch (err) {
        console.error(err);
      }
    },
    [containsLink, etherscanLink, toast]
  );

  const feeInUSD = async (gasPrice, gasUsed) => {
    const result = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=USD',
      { timeout: 8e3 } // 8 second timeout
    );
    const feeInWei = gasPrice.mul(gasUsed);
    const feeInEth = ethers.utils.formatUnits(feeInWei, 'ether');
    return result.data.ethereum.usd * parseFloat(feeInEth);
  };

  const handleChange = event => {
    let containsLink = false;
    const etherscanLink = event.target.value;
    const hashTester = new window.RegExp(/^0x([A-Fa-f0-9]{64})$/, 'gm');
    if (
      etherscanLink.indexOf('etherscan') > 0 &&
      etherscanLink.indexOf('tx/0x') > 0 &&
      hashTester.test(etherscanLink.slice(24))
    ) {
      console.log('here');
      containsLink = true;
      setEtherscanLink(etherscanLink);
    }
    setContainsLink(containsLink);
  };

  React.useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      handleFormSubmit(null, options.chainlink.link);
    }
  }, [handleFormSubmit, isInitialized]);

  return (
    <Box m="0 auto" maxW={['none', '600px', null, 'none']}>
      <Box mb={8}>
        <Heading fontSize="1.4rem" fontWeight={400}>
          How much can Optimistic Ethereum reduce your gas pain?
        </Heading>
        <Text fontSize="1rem">
          Paste an Etherscan link to a transaction or select a preset
          transaction
        </Text>
      </Box>
      <Box
        boxShadow="-8px 8px 20px 0px #ededed"
        paddingTop="2rem"
        paddingBottom="2rem"
        px={['1rem', null, '2rem']}
      >
        <Box
          py={4}
          display="flex"
          flexDirection={['column', null, null, 'row']}
          pos="relative"
        >
          <Image
            pos="absolute"
            w="80px"
            top={'-50px'}
            right={'-60px'}
            transform="rotate(10deg)"
            src={coloredEthLogo}
            alt="Ethereum logo"
          ></Image>
          <Box
            w={['100%', null, null, '45%']}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Box
              className={styles.presets}
              d="flex"
              justifyContent="space-around"
              height="100%"
              alignItems="center"
            >
              {Object.entries(options).map(([id, option]) => {
                return (
                  <input
                    key={option.name}
                    type="image"
                    alt={option.name}
                    src={option.iconURL}
                    onClick={() => handleInputOverride(id)}
                    className={
                      styles.button + ' ' + (id === txId ? styles.active : '')
                    }
                  ></input>
                );
              })}
            </Box>

            <Box>
              <Input
                mt={8}
                mb={4}
                type="link"
                name="etherscan-link"
                placeholder="https://etherscan.io/tx/0x..."
                value={etherscanLink}
                onChange={handleChange}
              ></Input>
              <Button
                padding="8px"
                color="white"
                background="#f01a37"
                fontFamily="'Roboto'"
                fontWeight="bold"
                fontSize="17px"
                letterSpacing="0.7px"
                width="100%"
                height="50px"
                border="none"
                margin="0 auto"
                cursor="pointer"
                _hover={{
                  bg: '#f01a37'
                }}
                onClick={e => handleFormSubmit(e, etherscanLink)}
              >
                Calculate
              </Button>
            </Box>
          </Box>
          <Box
            w={['100%', null, null, '65%']}
            ml={[0, null, null, 12]}
            mt={(0, null, null, 8)}
            d="flex"
            flexDir="column"
          >
            <Divider display={'none'} />
            {showHeading && (
              <>
                <Text my={0}>Example transaction:</Text>
                <Heading mt={0} fontWeight="400" fontSize="1.8rem">
                  {txId ? options[txId].desc : 'User transaction'}
                </Heading>
              </>
            )}
            {isCalculating ? (
              <Center p={8}>
                <Spinner w="100px" h="100px" />
              </Center>
            ) : (
              <GasCalcResults
                l1Gas={l1Gas}
                l2Gas={l2Gas}
                gasSaved={gasSaved}
                l2UsdPrice={l2UsdPrice}
              />
            )}
          </Box>
        </Box>
        <Accordion allowToggle defaultIndex={0}>
          <AccordionItem>
            <AccordionButton
              background="transparent"
              border="none"
              mt={2}
              w="auto"
              cursor="pointer"
              _hover={{ background: 'transparent' }}
              px={0}
            >
              {/* <Box
                d="flex"
                alignItems="center"
                textAlign="center"
                as="span"
                mr={2}
                color="#f01a37"
              >
                Calculation details
                <AccordionIcon />
              </Box> */}
            </AccordionButton>
            <Divider />
            <AccordionPanel px={0} pt={4} lineHeight="1.7" fontSize="0.9rem">
              <Heading fontWeight="300" size="lg" mb={2}>
                Calculation details
              </Heading>
              <Text fontSize="1rem" mt={0}>
                Hover over each variable to reveal more info
              </Text>
              <SimpleGrid
                columns={[2, null, null, null, 1]}
                spacing={12}
                gridTemplateColumns={['1fr', null, null, '45fr 65fr']}
              >
                <Box d="flex" flexDir="column" justifyContent="stretch">
                  <Heading fontWeight="300" size="md">
                    Formula
                  </Heading>
                  <Formula />
                </Box>
                <Box d="flex" flexDir="column" justifyContent="stretch">
                  <Heading fontWeight="300" size="md">
                    {txId ? options[txId].desc : 'User transaction'}
                  </Heading>
                  <Formula
                    variables={{
                      zeroDataBytes: zeroBytes,
                      nonZeroDataBytes: dataBytes,
                      layer1GasPrice: l1GasPrice
                    }}
                  />
                </Box>
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    </Box>
  );
};

export default GasCalcSection;

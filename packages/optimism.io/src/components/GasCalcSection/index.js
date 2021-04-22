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
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip
} from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import styles from './GasCalc.module.css';
import { ethers } from 'ethers';
import axios from 'axios';
import coloredEthLogo from './coloredEthLogo.svg';

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
  const [gasSaved, setGasSaved] = React.useState(0);
  const [l2UsdPrice, setL2UsdPrice] = React.useState(0);
  const [showHeading, setShowHeading] = React.useState(true);
  const [congestionPercentage, setCongestionPercentage] = React.useState(0);
  const [screenSm, screenLg] = useMediaQuery([
    '(min-width: 768px)',
    '(min-width: 1200px)'
  ]);
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
      console.log(optionLinks.includes(link));
      setShowHeading(optionLinks.includes(link));

      const provider = ethers.getDefaultProvider(
        `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`
      );
      const txHash = txLink.substr(txLink.indexOf('0x'));
      const txReceipt = await provider.getTransactionReceipt(txHash);
      const txData = await provider.getTransaction(txHash);
      const no0x = txData.data.substr(2);
      let zeroBytes = 0;
      let dataBytes = 0;
      for (let j = 0; j < no0x.length; j += 2) {
        const curByte = no0x.substr(j, 2);
        if (curByte === 0) {
          zeroBytes++;
        } else {
          dataBytes++;
        }
      }
      dataBytes += 32; // 32 byte state root
      const l2Gas =
        zeroBytes * 4 +
        dataBytes * 16 +
        2000 + //20k SSTORE for a batch of 10 transctions
        2000; //20k SSTORE for a batch of 10 state roots
      const gasSaved = (txReceipt.gasUsed.toNumber() / l2Gas).toFixed(1);
      const l1Fee = await feeInUSD(txData.gasPrice, txReceipt.gasUsed);
      setL2UsdPrice((l1Fee / gasSaved).toFixed(2));
      setIsCalculating(false);
      setL1Gas(
        txReceipt.gasUsed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      );
      setL2Gas(l2Gas.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
      setGasSaved(gasSaved);
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

  const handleCongestionChange = value => {
    setCongestionPercentage(value);
  };

  React.useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      handleFormSubmit(null, options.chainlink.link);
    }
  }, [handleFormSubmit, isInitialized]);

  return (
    <Box m="0 auto" maxW={screenLg ? 'none' : '700px'}>
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
        px={screenSm ? '2rem' : '1rem'}
      >
        <Box
          display="flex"
          flexDirection={screenLg ? 'row' : 'column'}
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
            w={screenLg ? '40%' : '100%'}
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
            w={screenLg ? '60%' : '100%'}
            ml={screenLg ? 16 : 0}
            mt={screenLg ? 0 : 8}
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
        <Divider mt={12} />
        <Heading fontWeight="400" textAlign="center">
          Optimism gas math
        </Heading>
        <Box d="flex" justifyContent="center" fontSize="1.2rem">
          <code>
            <Box as="span" color="pink.600">
              const
            </Box>{' '}
            <Box as="span" color="purple.600">
              l2GasFee
            </Box>{' '}
            = l1GasPrice * (4 * zeroDataBytes + 16 * nonZeroDataBytes +
            nonCallDataL1GasOverhead) + (executionPrice * gasUsed)
          </code>
        </Box>
      </Box>
    </Box>
  );
};

// l2GasUsed = (4 * zeroDataBytes + 16 * nonZeroDataBytes + nonCallDataL1GasOverhead)

const GasCalcResults = props => (
  <div className={styles.flexContainer}>
    <div className={styles.flexColumn}>
      <div className={styles.flexOutputGas}>
        <div className={styles.result}>{props.l1Gas}</div>
        <div className={styles.description}>Gas cost on layer 1</div>
      </div>
      <div className={styles.flexOutputGas}>
        <div className={styles.result}>{props.l2Gas}</div>
        <div className={styles.description}>Gas cost on Optimism</div>
      </div>
    </div>
    <div className={styles.flexOutputDelta}>
      <div className={styles.usd}>
        Fee on Optimism: ${props.l2UsdPrice}
        {/* <InfoOutlineIcon color="brandSecondary" ml={2} /> */}
      </div>
      <div className={styles.result}>{props.gasSaved + 'x'}</div>
      <div className={styles.description}>Savings with Optimism</div>
    </div>
  </div>
);

export default GasCalcSection;

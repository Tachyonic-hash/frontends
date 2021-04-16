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
  useMediaQuery
} from '@chakra-ui/react';
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
  const [screenSm, screenMd, screenLg] = useMediaQuery([
    '(min-width: 600px)',
    '(min-width: 1024px)',
    '(min-width: 1200px)'
  ]);
  const toast = useToast();

  const handleInputOverride = id => {
    setTxId(id);
    setEtherscanLink(options[id].link);
    setContainsLink(true);
    handleFormSubmit(null, options[id].link);
  };

  const handleFormSubmit = React.useCallback(
    async (e, link) => {
      const txLink = link || etherscanLink;
      setIsCalculating(true);
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
      const l1TxFee = await feeInUSD(txData.gasPrice, txReceipt.gasUsed);
      const l2TxFee = await feeInUSD(txData.gasPrice, l2Gas);
      const gasSaved = (txReceipt.gasUsed.toNumber() / l2Gas).toFixed(1);

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

  React.useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      handleFormSubmit();
    }
  }, [handleFormSubmit, isInitialized]);

  return (
    <Box m="0 auto">
      <Box pos="relative" mb={8} pr={16}>
        <Heading fontSize="1.4rem" fontWeight={400}>
          See how much Optimistic Ethereum can reduce your gas pain
        </Heading>
        <Text fontSize="1rem">
          Paste an Etherscan link to a transaction or select a preset
          transaction below
        </Text>
        <Image
          pos="absolute"
          w="80px"
          top={'-20px'}
          right={'-50px'}
          transform="rotate(10deg)"
          src={coloredEthLogo}
          alt="Ethereum logo"
        ></Image>
      </Box>
      <Box className={styles.container}>
        <Box
          w="40%"
          minW="400px"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Box
            className={styles.presets}
            d="flex"
            justifyContent="space-around"
          >
            {Object.entries(options).map(([id, option]) => (
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
            ))}
          </Box>
          <Box>
            <Input
              my={8}
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
              onClick={handleFormSubmit}
            >
              Calculate
            </Button>
          </Box>
        </Box>
        <Box w="60%" ml={16}>
          <Divider display={'none'} />
          <Text my={0}>Example transaction:</Text>
          <Heading mt={0} fontWeight="400">
            {txId ? options[txId].desc : 'User transaction'}
          </Heading>
          {isCalculating ? (
            <Center p={8}>
              <Spinner w="80px" h="80px" />
            </Center>
          ) : (
            <GasCalcResults l1Gas={l1Gas} l2Gas={l2Gas} gasSaved={gasSaved} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

const GasCalcResults = props => (
  <div className={styles.flexContainer}>
    <div className={styles.flexColumn}>
      <div className={styles.flexOutputGas}>
        <div className={styles.result}>{props.l1Gas}</div>
        <div className={styles.description}>Gas cost on layer 1</div>
      </div>
      <div className={styles.flexOutputGas}>
        <div className={styles.result}>{props.l2Gas}</div>
        <div className={styles.description}>Cost with the OVM</div>
      </div>
    </div>
    <div className={styles.flexOutputDelta}>
      <div className={styles.result}>{props.gasSaved + 'x'}</div>
      <div className={styles.description}>Savings with Optimism</div>
    </div>
  </div>
);

export default GasCalcSection;

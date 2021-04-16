import React from 'react';
import { Box, SimpleGrid, useMediaQuery } from '@chakra-ui/react';
import { JsonRpcProvider } from '@ethersproject/providers';
import Container from '../../components/Container';
import { PageHeader } from '../../components/Headers';
import NetworkCard from '../../components/NetworkCard';

function NetworkStatus() {
  const [smallScreen] = useMediaQuery('(max-width: 900px)');
  const [isMainnetDown, setIsMainnetDown] = React.useState(null);
  const [isKovanDown, setIsKovanDown] = React.useState(null);

  React.useEffect(() => {
    const mainnet = new JsonRpcProvider(`https://mainnet.optimism.io`);
    const kovan = new JsonRpcProvider(`https://kovan.optimism.io`);

    mainnet.getBlock().then(() => {
      setIsMainnetDown(isDown => isDown === null && false);
    });
    kovan.getBlock().then(() => {
      setIsKovanDown(isDown => isDown === null && false);
    });

    setTimeout(() => {
      setIsKovanDown(isDown => isDown === null);
      setIsMainnetDown(isDown => isDown === null);
    }, 5000);
  }, []);

  return (
    <Container>
      <PageHeader mb={16}>Network Status</PageHeader>
      <Box>
        <SimpleGrid
          spacing={smallScreen ? 8 : 24}
          columns={smallScreen ? 1 : 2}
        >
          {[
            { network: 'Mainnet Optimism', isDown: isMainnetDown },
            { network: 'Kovan Optimism', isDown: isKovanDown }
          ].map(data => (
            <NetworkCard
              key={data.network}
              network={data.network}
              isDown={data.isDown}
              smallScreen={smallScreen}
            />
          ))}
        </SimpleGrid>
      </Box>
    </Container>
  );
}

export default NetworkStatus;

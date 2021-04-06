import React from 'react';
import { Box, SimpleGrid, useMediaQuery } from '@chakra-ui/react';
import Container from '../../components/Container';
import { PageHeader } from '../../components/Headers';
import NetworkCard from '../../components/NetworkCard';

function NetworkStatus() {
  const [smallScreen] = useMediaQuery('(max-width: 900px)');

  React.useEffect(() => {
    // TODO
    // axios
    //   .get("https://api.pingdom.com/api/3.1/checks", {
    //     headers: new Headers({
    //       Authorization: "Bearer " + process.env.REACT_APP_PINGDOM,
    //     }),
    //   })
    //   .then(console.log);
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
            { network: 'Mainnet Optimism', isDown: false },
            { network: 'Kovan Optimism', isDown: true }
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

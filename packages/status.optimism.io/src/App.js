import React from "react";
import axios from "axios";
import {
  ChakraProvider,
  Center,
  SimpleGrid,
  Heading,
  Box,
} from "@chakra-ui/react";
import NetworkCard from "./NetworkCard";

function App() {
  React.useEffect(() => {
    axios
      .get("https://api.pingdom.com/api/3.1/checks", {
        headers: new Headers({
          Authorization: "Bearer " + process.env.REACT_APP_PINGDOM,
        }),
      })
      .then(console.log);
  }, []);

  return (
    <ChakraProvider>
      <Center h="100vh" w="100vw" px={2}>
        <Box mb={16}>
          <Heading
            as="h1"
            fontWeight="300"
            fontSize="3rem"
            mb={16}
            textAlign="center"
          >
            Network Status
          </Heading>
          <SimpleGrid spacing={16} columns="2">
            {[
              { network: "Mainnet Optimism", isDown: false },
              { network: "Kovan Optimism", isDown: true },
            ].map((data) => (
              <NetworkCard network={data.network} isDown={data.isDown} />
            ))}
          </SimpleGrid>
        </Box>
      </Center>
    </ChakraProvider>
  );
}

export default App;

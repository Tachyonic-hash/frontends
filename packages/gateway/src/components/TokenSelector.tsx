import React from 'react';
import { Select, Box, FormLabel } from '@chakra-ui/react';

type Props = {
  handleTokenSelection: (e: React.FormEvent<HTMLSelectElement>) => void;
  tokenSymbol: string;
};

function TokenSelector({ handleTokenSelection, tokenSymbol }: Props) {
  return (
    <Box maxW="320px" mb={16}>
      <FormLabel opacity="0.7">Filter by asset</FormLabel>
      <Select placeholder="Choose token" onChange={handleTokenSelection} value={tokenSymbol || ''}>
        {/* <option value="ETH">Ethereum | ETH</option> */}
        <option value="SNX">Synthetix | SNX</option>
      </Select>
    </Box>
  );
}

export default TokenSelector;

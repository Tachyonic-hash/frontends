import React from 'react';
import { Input, FormLabel, Button, HStack, Box } from '@chakra-ui/react';

function SearchInput({ handleAddressSearch }) {
  const [inputVal, setInputVal] = React.useState('');

  const handleSearch = () => {
    handleAddressSearch(inputVal);
    setInputVal('');
  };

  const handleKeypress = e => {
    if (e.key === 'Enter') {
      handleSearch();
    } else {
      setInputVal(e.target.value);
    }
  };

  return (
    <HStack maxW="500px" w="100%" alignItems="flex-end" mb={4}>
      <Box w="100%">
        <FormLabel>Address</FormLabel>
        <Input
          size="md"
          placeholder="Enter address"
          bgColor="white"
          color="#333"
          _placeholder={{ color: '#aaa' }}
          onChange={e => setInputVal(e.target.value)}
          onKeyPress={handleKeypress}
          value={inputVal}
        />
      </Box>
      <Button size="md" onClick={handleSearch}>
        Search
      </Button>
    </HStack>
  );
}

export default SearchInput;

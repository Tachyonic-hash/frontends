import React from 'react';
import { Box } from '@chakra-ui/react';
import { colors } from '../constants';

function Pulse(props) {
  return (
    <Box {...props} position="relative" height="20px" width="20px">
      <Box
        border={`3px solid ${colors.brandSecondary}`}
        borderRadius="30px"
        width="100%"
        height="100%"
        position="absolute"
        left="0"
        top="0"
        animation="pulsate 1s ease-out infinite"
        opacity="0"
      />
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="30" fill={colors.brandSecondary} />
      </svg>
    </Box>
  );
}

export default Pulse;

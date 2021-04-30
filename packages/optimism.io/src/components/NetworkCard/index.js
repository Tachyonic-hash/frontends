import React from 'react';
import { Heading, Box, Text, Spinner, Link } from '@chakra-ui/react';
import DateTime from 'luxon/src/datetime.js';
import Interval from 'luxon/src/interval.js';
import { networkStates } from '../../pages/NetworkStatus';

function NetworkCard({
  network,
  networkCondition,
  millisSinceLastBatch,
  smallScreen,
  errorMessage
}) {
  const intervalSinceLastBatch = Interval.fromDateTimes(
    DateTime.fromMillis(Date.now() - millisSinceLastBatch),
    DateTime.fromMillis(Date.now())
  );

  let formattedInterval;
  // 86_400_000 == 1 day in millis
  if (intervalSinceLastBatch.count() > 86_400_000) {
    // if over 1 day, display as days
    formattedInterval = intervalSinceLastBatch
      .toDuration()
      .toFormat("d 'days and' h 'hours'");
    // 3_600_000 == 1 hour in millis
  } else if (intervalSinceLastBatch.count() > 3_600_000) {
    // else display as hours
    formattedInterval = intervalSinceLastBatch
      .toDuration()
      .toFormat("h 'hours and' m 'minutes'");
  } else {
    formattedInterval = intervalSinceLastBatch
      .toDuration()
      .toFormat("m 'minutes'");
  }

  return (
    <Box
      borderWidth="4px"
      p={4}
      fontSize="1rem"
      borderRadius={10}
      textAlign="center"
      borderColor={
        networkCondition === networkStates.ALL_GRAVY
          ? 'green.400'
          : networkCondition
          ? 'red.500'
          : '#eee'
      }
      borderStyle="solid"
      w="100%"
    >
      <Heading as="h2" size="xl" fontWeight="400">
        {network}
      </Heading>
      <Box fontSize={'180px'} mb={4} lineHeight="1.1">
        {networkCondition || <Spinner w="90px" h="90px" />}
      </Box>
      <Box>
        {networkCondition && (
          <>
            <Text
              d="block"
              fontSize={'1.6rem'}
              lineHeight="normal"
              fontWeight="bold"
              color={
                networkCondition === networkStates.ALL_GRAVY
                  ? 'green.400'
                  : 'red.500'
              }
            >
              {networkCondition === networkStates.ALL_GRAVY
                ? 'All systems operational!'
                : 'Experiencing problems'}
            </Text>
            {errorMessage && <Text d="inline">{errorMessage}</Text>}
            {!!millisSinceLastBatch && (
              <Text
                d={
                  networkCondition === networkStates.ALL_GRAVY
                    ? 'block'
                    : 'inline'
                }
                mt={4}
                ml={networkCondition === networkStates.ALL_GRAVY ? 0 : 2}
              >
                The last transaction batch was submitted {formattedInterval}{' '}
                ago.
              </Text>
            )}
          </>
        )}

        {networkCondition && networkCondition !== networkStates.ALL_GRAVY && (
          <Text>
            For updates, please check our{' '}
            <Link href="https://discord.com/invite/jrnFEvq" isExternal={true}>
              discord
            </Link>
            .
          </Text>
        )}
      </Box>
    </Box>
  );
}

export default NetworkCard;

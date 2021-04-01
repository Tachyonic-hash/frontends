import React, { ReactNode } from 'react';
import { ToastId, useToast, Text, Link, useColorModeValue } from '@chakra-ui/react';

function useCustomToast() {
  const toast = useToast();
  const toastIdRef = React.useRef<ToastId>();
  const warningLinkColor = useColorModeValue('inherit', '#171923');

  const showErrorToast = React.useCallback(
    (message?: string | ReactNode) => {
      toastIdRef.current = toast({
        title: 'Error',
        position: 'bottom-right',
        description: (
          <Text>
            {message || (
              <>
                Please try again. Note that the gateway currently only supports Metamask. If you continue to experience
                problems, please reach out to us on{' '}
                <Link
                  href="https://discord.com/invite/jrnFEvq"
                  isExternal={true}
                  textDecoration="underline"
                  color={`${warningLinkColor} !important`}
                >
                  Discord
                </Link>
                .
              </>
            )}
          </Text>
        ),
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    },
    [toast, warningLinkColor]
  );

  const showInfoToast = React.useCallback(
    (message: string | ReactNode) => {
      toastIdRef.current = toast({
        title: '', // TODO: remove "to Kovan" when mainnet support is added https://github.com/ethereum-optimism/roadmap/issues/847
        description: message,
        status: 'info',
        duration: 3000,
        isClosable: true,
        position: 'bottom-right',
      });
    },
    [toast]
  );

  return { showErrorToast, showInfoToast, toast, toastIdRef, warningLinkColor };
}

export default useCustomToast;

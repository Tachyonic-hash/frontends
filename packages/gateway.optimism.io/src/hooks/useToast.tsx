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
        position: 'bottom-left',
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
        title: '',
        description: message,
        status: 'info',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left',
      });
    },
    [toast]
  );

  const showSuccessToast = React.useCallback(
    (message: string | ReactNode, duration: number) => {
      toastIdRef.current = toast({
        title: 'Success!',
        description: message,
        status: 'success',
        duration: duration || 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    },
    [toast]
  );

  return { showErrorToast, showInfoToast, showSuccessToast, toast, toastIdRef, warningLinkColor };
}

export default useCustomToast;

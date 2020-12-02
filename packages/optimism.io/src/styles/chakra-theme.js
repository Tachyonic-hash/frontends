import { extendTheme } from "@chakra-ui/react"

const theme = {
  colors: {
    brandPrimary: '#f01a37'
  },
  styles: {
    global: {
      body: {
        color: 'gray.700',
        margin: '0 !important',
      },
      // a: {
      //   color: 'teal.300',
      //   outline: 'none',
      //   textDecoration: 'none',
      //   cursor: 'pointer',
      //   transition: 'color 300ms',
      //   _hover: {
      //     color: 'teal.100'
      //   },
      //   _focus: {
      //     color: 'teal.100'
      //   }
      // },
      // p: {
      //   fontWeight: '300 !important',
      //   marginTop: '1rem',
      //   fontSize: '16px',
      // },
      h1: {
        fontSize: ['2.488rem', '4.209rem'],
      },
      h2: {
        fontSize: ['2.074rem', '3.157rem'],
      },
      h3: {
        fontSize: ['1.728rem', '2.369rem'],
      },
      h4: {
        fontSize: ['1.44rem', '1.777rem'],
      },
      h5: {
        fontSize: ['1.2rem', '1.333rem'],
      },
      // input: {
      //   backgroundColor: 'white !important',
      //   fontSize: '16px !important',
      //   _focus: {
      //     boxShadow: 'none !important'
      //   }
      // },
      '.chakra-container': {
        maxWidth: '80ch !important'
      },
    },
  },
};

export default extendTheme(theme)
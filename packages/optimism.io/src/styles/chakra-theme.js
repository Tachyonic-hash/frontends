import { extendTheme } from '@chakra-ui/react';

const theme = {
  colors: {
    brandPrimary: '#f01a37',
    brandPrimary_halfOpacity: 'rgb(240, 26, 55, 0.2)',
    brandPrimaryDark: '#c71129',
    bodyText: '#2D3748',
    headingText: '#1A202C',
  },
  fonts: {
    primaryFont:
      'Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
    monoFont:
      'Roboto Mono, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
    serifFont: 'Cormorant Garamond, serif',
  },
  styles: {
    global: {
      body: {
        color: 'bodyText',
        margin: '0 !important',
        fontFamily: 'primaryFont',
      },
      a: {
        color: 'brandPrimary',
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'color 300ms',
      },
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
    },
  },
  sizes: {
    containerLg: '1000px',
  },
  components: {
    Link: {
      baseStyle: {
        color: 'brandPrimary',
        textDecoration: 'none !important',
      },
    },
  },
};

export default extendTheme(theme);

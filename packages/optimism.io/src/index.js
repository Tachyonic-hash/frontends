import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import theme from './styles/chakra-theme.js';
import './styles/index.scss';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme} resetCSS={false}>
      <BrowserRouter>
        <ColorModeScript initialColorMode={'light'} />
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

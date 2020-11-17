import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom'
import Navigation from './navigation/Navigation';
import Main from './Main'
import Footer from './footer-section/Footer'

function App() {
  return (
    <div className="App">
      <Navigation />
      <Main />
      <Footer />
    </div>
  );
}

export default App;

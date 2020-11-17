import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom'
import Navigation from './components/navigation/Navigation';
import Main from './Main'
import Footer from './components/footer-section/Footer'

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

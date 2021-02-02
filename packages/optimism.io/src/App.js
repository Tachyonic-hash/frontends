import React from 'react';
import './App.css';
import Navigation from './navigation/Navigation';
import Main from './Main'
import Footer from './footer-section/Footer'

function App() {
  return (
    <div className="App">
      <Navigation/>
      <Main/>
      <Footer/>
    </div>
  );
}

export default App;

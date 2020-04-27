import React from 'react';
import logo from './logo.svg';
import './App.css';
import Navigation from './navigation/Navigation';
import Roadmap from './roadmap-section/Roadmap';

function App() {
  return (
    <div className="App">
      <Navigation></Navigation>

      <div>
        Together we made it!
        <Roadmap> </Roadmap>
      </div>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

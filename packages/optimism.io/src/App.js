import React from 'react';
import logo from './logo.svg';
import './App.css';
import Navigation from './navigation/Navigation';
import Roadmap from './roadmap-section/Roadmap';
import News from './news-section/News';
import Philosophy from './philosophy-section/Philosophy';
import Team from './team-section/Team';

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
          Edit <code>src/App.js</code> and save to reload jsrtj.
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
      <News></News>
      <Philosophy></Philosophy>
      <Team></Team>
    </div>
  );
}

export default App;

import React from 'react';
import logo from './logo.svg';
import './App.css';
import Navigation from './navigation/Navigation';
import Roadmap from './roadmap-section/Roadmap';
import Features from './features-section/Features';
import News from './news-section/News';
import Philosophy from './philosophy-section/Philosophy';
import Team from './team-section/Team';
import Demo from './demo-section/Demo';
import Quote from './quote-section/Quote';
import Hero from './hero-section/Hero';

function App() {
  return (
    <div className="App">
      <Navigation></Navigation>
      <Hero></Hero>
      <Demo></Demo>
      <Quote></Quote>
      <Features></Features>
      <Roadmap></Roadmap>
      <News></News>
      <Philosophy></Philosophy>
      <Team></Team>
    </div>
  );
}

export default App;

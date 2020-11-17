import React from 'react';
import Roadmap from '../components/roadmap-section/Roadmap';
import Features from '../components/features-section/Features';
import News from '../components/news-section/News';
import Philosophy from '../components/philosophy-section/Philosophy';
import Team from '../components/team-section/Team';
import Demo from '../components/demo-section/Demo';
import Hero from '../components/hero-section/Hero';
import GasCalc from '../components/gas-calc-section/GasCalc'

function Homepage() {
  return (
    <div>
      <Hero />
      <News />
      <Roadmap />
      <Philosophy />
    </div>
  );
}

export default Homepage;

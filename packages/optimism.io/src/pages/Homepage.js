import React from 'react';
import Roadmap from '../components/RoadmapSection/Roadmap';
import News from '../components/NewsSection';
import Philosophy from '../components/PhilosophySection';
import Hero from '../components/Hero';

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

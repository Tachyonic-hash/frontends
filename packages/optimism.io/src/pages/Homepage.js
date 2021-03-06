import React from 'react';
import Roadmap from '../components/RoadmapSection/Roadmap';
import News from '../components/NewsSection';
import Philosophy from '../components/PhilosophySection';
import Hero from '../components/Hero';

function Homepage() {
  return (
    <div>
      <Hero />
      <Roadmap />
      <News />
      <Philosophy />
    </div>
  );
}

export default Homepage;

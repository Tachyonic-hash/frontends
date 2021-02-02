import React from 'react';
import Roadmap from '../components/roadmap-section/Roadmap';
import Features from '../components/features-section/Features';
import News from '../components/news-section/News';
import Philosophy from '../components/philosophy-section/Philosophy';
import Demo from '../components/demo-section/Demo';
import Quote from '../components/quote-section/Quote';
import Hero from '../components/hero-section/Hero';

function Homepage() {
  return (
    <div>
      <Hero/>
      <Demo/>
      <Quote></Quote>
      <Features></Features>
      <Roadmap></Roadmap>
      <News></News>
      <Philosophy></Philosophy>
    </div>
  );
}

export default Homepage;

import React from 'react';
import Navigation from '../navigation/Navigation';
import Roadmap from '../roadmap-section/Roadmap';
import Features from '../features-section/Features';
import News from '../news-section/News';
import Philosophy from '../philosophy-section/Philosophy';
import Team from '../team-section/Team';
import Demo from '../demo-section/Demo';
import Quote from '../quote-section/Quote';
import Hero from '../hero-section/Hero';
import Footer from '../footer-section/Footer';

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
      <Footer></Footer>
    </div>
  );
}

export default Homepage;

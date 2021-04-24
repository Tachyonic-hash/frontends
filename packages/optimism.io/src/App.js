import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Homepage';
import NotFound from './pages/NotFound';
import Demos from './pages/Demos';
import SNXHistory from './pages/SNXHistory';
import NetworkStatus from './pages/NetworkStatus';
import { images } from './utils/constants';

function App() {
  React.useEffect(() => {
    // removes blue outline when user is using mouse
    function handleFirstTab(e) {
      if (e.keyCode === 9) {
        document.body.classList.add('user-is-tabbing');

        window.removeEventListener('keydown', handleFirstTab);
        window.addEventListener('mousedown', handleMouseDownOnce);
      }
    }

    function handleMouseDownOnce() {
      document.body.classList.remove('user-is-tabbing');

      window.removeEventListener('mousedown', handleMouseDownOnce);
      window.addEventListener('keydown', handleFirstTab);
    }

    window.addEventListener('keydown', handleFirstTab);

    // preloads images
    window.onload = () => {
      Object.values(images).forEach((imgSrc, i) => {
        const img = new Image();
        img.src = '/images/' + imgSrc;
      });
    };
  }, []);

  return (
    <div className="App">
      <Navigation />
      <ScrollToTop />
      <Switch>
        {/* The Switch decides which component to show based on the current URL.*/}
        <Route exact path="/" component={Home} />
        <Route path="/demos" component={Demos} />
        <Route path="/status" component={NetworkStatus} />
        <Route path="/snx-history" component={SNXHistory} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </div>
  );
}

export default App;

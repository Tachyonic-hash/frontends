import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Homepage';
import FAQ from './pages/FAQ';
import Philosophy from './pages/Philosophy';
import Demos from './pages/Demos';

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
  }, []);

  return (
    <div className="App">
      <Navigation />
      <ScrollToTop />
      <Switch>
        {/* The Switch decides which component to show based on the current URL.*/}
        <Route exact path="/" component={Home} />
        <Route exact path="/faq" component={FAQ} />
        <Route exact path="/philosophy" component={Philosophy} />
        <Route exact path="/demos" component={Demos} />
      </Switch>
      <Footer />
    </div>
  );
}

export default App;

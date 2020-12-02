import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import Navigation from './components/Navigation';
import Main from './Main';
import Footer from './components/Footer';

function App() {
  React.useEffect(() => {
    // removes blue outline when user is using mouse
    function handleFirstTab(e) {
      console.log('hey');
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
      <Main />
      <Footer />
    </div>
  );
}

export default App;

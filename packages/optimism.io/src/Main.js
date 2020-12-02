import React from 'react';
import {
  Switch,
  Route,
  Link
} from "react-router-dom";

import Home from './pages/Homepage';
import FAQ from './pages/FAQ'
import Philosophy from './pages/Philosophy'

const Main = () => {
  return (
    <Switch> {/* The Switch decides which component to show based on the current URL.*/}
      <Route exact path='/' component={Home} />
      <Route exact path='/faq' component={FAQ} />
      <Route exact path='/philosophy' component={Philosophy} />
    </Switch >
  );
}

export default Main;
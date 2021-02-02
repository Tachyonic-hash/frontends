import React from 'react';
import {
  Switch,
  Route,
} from "react-router-dom";

import Home from './pages/Homepage';
import FAQ from './pages/FAQ'

const Main = () => {
  return (
    <Switch> {/* The Switch decides which component to show based on the current URL.*/}
      <Route exact path='/'>
      	<Home/>
      </Route>
      <Route exact path='/FAQ'>
      	<FAQ/>
      </Route>
    </Switch>
  );
}

export default Main;
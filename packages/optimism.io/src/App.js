import React from 'react';
import {BrowserRouter as Router, Link} from 'react-router-dom'
import './App.css';
import Navigation from './navigation/Navigation';
import Main from "./Main"

function App() {
  return (
    <div className="App">
      <Navigation/>
      <Main/>
    </div>
  );
}

export default App;

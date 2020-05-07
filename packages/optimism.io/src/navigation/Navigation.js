import styles from './Navigation.module.css';
import React, { Component } from 'react';
import {Link} from 'react-router-dom'

class Navigation extends Component {
  render() {
    return (
      <div class={styles.componentBody}>
	      <header class={styles.header}>
	      	<h1 class={styles.logo}><Link to="/">Optimism</Link></h1>
            <ul class={styles.mainNav}>
                <li><Link to="/FAQ">FAQ</Link></li>
                <li><a href="https://github.com/ethereum-optimism/optimism-monorepo">GITHUB↗</a></li>
                <li><a href="https://medium.com/ethereum-optimism">BLOG↗</a></li>
            </ul>
	      </header> 
      </div>
    )
  }
}

export default Navigation;

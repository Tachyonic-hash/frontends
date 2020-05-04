import styles from './Navigation.module.css';
import React, { Component } from 'react';

class Navigation extends Component {
  render() {
    return (
      <div class={styles.componentBody}>
	      <header class={styles.header}>
	      	<h1 class={styles.logo}><a href="#">Optimism</a></h1>
            <ul class={styles.mainNav}>
                <li><a href="#">FAQ</a></li>
                <li><a href="https://github.com/ethereum-optimism/optimism-monorepo">GITHUB↗</a></li>
                <li><a href="#">BLOG↗</a></li>
            </ul>
	      </header> 
      </div>
    )
  }
}

export default Navigation;

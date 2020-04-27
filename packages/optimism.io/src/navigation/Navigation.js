import styles from './Navigation.module.css';
import React, { Component } from 'react';

class Navigation extends Component {
  render() {
    return (
      <div class={styles.componentBody}>
	      <header class={styles.header}>
	      	<h1 class={styles.logo}><a href="#">Flexbox</a></h1>
            <ul class={styles.mainNav}>
                <li><a href="#">Home</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Portfolio</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
	      </header> 
      </div>
    )
  }
}

export default Navigation;

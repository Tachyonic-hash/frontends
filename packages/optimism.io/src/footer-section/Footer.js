import styles from './Footer.module.css';
import React, { Component } from 'react';

class Footer extends Component {
  render() {
    return (
      <footer>
        <div class={styles.flexContainer}>
          <div class={styles.flexItem}>
            <h1>Optimism PBC</h1>
          </div>
          <div class={styles.flexItem}>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Github</a></li>
            <li style={{borderBottom:"none"}}><a href="#">Blog</a></li>
          </div>
          <div class={styles.flexItem}>
            <li><a href="#">Twitter</a></li>
            <li><a href="#">Discord</a></li>
            <li style={{borderBottom:"none"}}><a href="#">Contact</a></li>
          </div>
        </div>
        <div class={styles.bottomBar}>Copylight Optimism PBC 2020. All brights preserved.</div>
      </footer>
    )
  }
}

export default Footer;

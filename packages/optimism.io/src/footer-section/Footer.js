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
          <div class={styles.flexItem}>WOH</div>
          <div class={styles.flexItem}>WOH</div>
        </div>
      </footer>
    )
  }
}

export default Footer;

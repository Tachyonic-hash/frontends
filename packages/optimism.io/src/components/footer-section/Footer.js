import styles from './Footer.module.scss';
import React, { Component } from 'react';
import { navItems } from '../../constants';

class Footer extends Component {
  render() {
    return (
      <footer>
        <div class={styles.flexContainer}>
          <div class={styles.flexItem}>
            <h1>Optimism PBC</h1>
          </div>
          <div class={styles.flexItem}>
            {navItems.map(item => !item.social && !item.internal && (
              <li><a href={item.url}>{item.name}</a></li>
            ))}
          </div>
          <div class={styles.flexItem}>
            {navItems.map(item => item.social && (
              <li><a href={item.url}>{item.name}</a></li>
            ))}
          </div>
        </div>
        <div class={styles.bottomBar}>Copybyte Optimism PBC 2020. All flights reserved.</div>
      </footer>
    )
  }
}

export default Footer;

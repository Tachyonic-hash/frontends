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
            <li><a href="https://github.com/ethereum-optimism/optimism-monorepo">Github</a></li>
            <li style={{borderBottom:"none"}}><a href="https://community.optimism.io/">Community</a></li>
            <li style={{borderBottom:"none"}}><a href="https://medium.com/ethereum-optimism">Blog</a></li>
          </div>
          <div class={styles.flexItem}>
            <li><a href="https://twitter.com/optimismPBC">Twitter</a></li>
            <li><a href="https://discord.com/invite/jrnFEvq">Discord</a></li>
            <li><a href="https://www.youtube.com/playlist?list=PLX_rXoLYCf5HqTWygUfoMfzRirGz5lekH">YOUTUBE</a></li>  
          </div>
        </div>
        <div class={styles.bottomBar}>Copybyte Optimism PBC 2020. All flights reserved.</div>
      </footer>
    )
  }
}

export default Footer;

import styles from './Navigation.module.css';
import React, { Component } from 'react';
import { HamburgerSpin } from 'react-animated-burgers'
import {Link} from 'react-router-dom'

class Navigation extends Component {
  state = {
    isActive: false
  }

  toggleButton = () => {
    this.setState({
      isActive: !this.state.isActive
    })
  }

  render() {
    // const menuDisplay = {
    //   display: (this.state.isActive) ? 'block' : 'none'
    // }
    let menuDisplay
    if (this.state.isActive) {
      menuDisplay = {
        display: 'block',
        paddingTop: '100px' 
      }
    } else {
      menuDisplay = {
        display: 'none'
      }
    }

    return (
      <div class={styles.componentBody}>
	      <header class={styles.header}>
	      	<h1 class={styles.logo}><Link to="/">Optimism</Link></h1>
          {/* Mobile Menu */}
          <ul class={styles.mobileNav} style={menuDisplay}>
            {/*<li><Link to="/FAQ">FAQ</Link></li>*/}
            <h1>OPTIMISM</h1>
            <li><a href="https://github.com/ethereum-optimism/optimism-monorepo">GITHUB↗</a></li>
            <li><a href="https://docs.optimism.io/">DOCUMENTATION</a></li>
            <li><a href="https://medium.com/ethereum-optimism">BLOG↗</a></li>
            <li><a href="">YOUTUBE</a></li>
            <li><a href="https://twitter.com/optimismPBC">TWITTER</a></li>
            <li><a href="https://medium.com/ethereum-optimism">DISCORD</a></li>
          </ul>
          {/* Desktop Menu */}
          <ul class={`${styles.mobileNav}, ${styles.desktopNav}`}>
            <li><a href="https://github.com/ethereum-optimism/optimism-monorepo">GITHUB↗</a></li>
            <li><a href="https://docs.optimism.io/">DOCUMENTATION</a></li>
            <li><a href="https://medium.com/ethereum-optimism">BLOG↗</a></li>
          </ul>
          <div className={styles.burger}>
            <HamburgerSpin className={styles.burger} isActive={this.state.isActive} toggleButton={this.toggleButton} buttonColor="white" barColor="black" />
          </div>
        </header> 
      </div>
    )
  }
}

export default Navigation;

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
        display: 'none'
      }
    } else {
      menuDisplay = {
        display: 'block'
      }
    }

    return (
      <div class={styles.componentBody}>
	      <header class={styles.header}>
	      	<h1 class={styles.logo}><Link to="/">Optimism</Link></h1>
            <ul class={styles.mainNav}>
                <li><Link to="/FAQ">FAQ</Link></li>
                <li><a href="https://github.com/ethereum-optimism/optimism-monorepo">GITHUB↗</a></li>
                <li><a href="https://medium.com/ethereum-optimism">BLOG↗</a></li>
            </ul>

          <HamburgerSpin isActive={this.state.isActive} toggleButton={this.toggleButton} buttonColor="#FFBC67" barColor="white" />

          <div style={menuDisplay}>test</div>
	      </header> 
      </div>
    )
  }
}

export default Navigation;

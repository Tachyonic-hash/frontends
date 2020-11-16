import styles from './Navigation.module.css';
import React, { Component } from 'react';
import { HamburgerSpin } from 'react-animated-burgers'
import { Link } from 'react-router-dom'
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'

const mobileNavId = 'mobileNavId'

class Navigation extends Component {
  state = {
    isActive: false
  }
  targetElement = null


  toggleButton = () => {
    this.setState({
      isActive: !this.state.isActive
    })
  }

  componentDidMount() {
    this.targetElement = document.querySelector(`#${mobileNavId}`)
  }

  showTargetElement = () => {
    disableBodyScroll(this.targetElement)
  };

  hideTargetElement = () => {
    enableBodyScroll(this.targetElement)
  };

  componentWillUnmount() {
    clearAllBodyScrollLocks()
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
          <ul class={styles.mobileNav} id={mobileNavId} style={menuDisplay}>
            <h1>OPTIMISM</h1>
            <li><a href="https://github.com/ethereum-optimism/optimism-monorepo" target="_blank" rel="noopenner noreferrer">GITHUB↗</a></li>
            <li><a href="https://docs.optimism.io/">DOCUMENTATION</a></li>
            <li><a href="https://medium.com/ethereum-optimism" target="_blank" rel="noopenner noreferrer">BLOG↗</a></li>
            <li><a href="https://www.youtube.com/playlist?list=PLX_rXoLYCf5HqTWygUfoMfzRirGz5lekH" target="_blank" rel="noopenner noreferrer">YOUTUBE</a></li>
            <li><a href="https://twitter.com/optimismPBC" target="_blank" rel="noopenner noreferrer">TWITTER</a></li>
            <li><a href="https://medium.com/ethereum-optimism" target="_blank" rel="noopenner noreferrer">DISCORD</a></li>
          </ul>
          {/* Desktop Menu */}
          <ul class={`${styles.mobileNav}, ${styles.desktopNav}`}>
            <Link to="/FAQ">FAQ</Link>
            <li><a href="https://github.com/ethereum-optimism/optimism-monorepo" target="_blank" rel="noopenner noreferrer">GITHUB↗</a></li>
            <li><a href="https://docs.optimism.io/" target="_blank" rel="noopenner noreferrer">DOCUMENTATION</a></li>
            <li><a href="https://medium.com/ethereum-optimism" target="_blank" rel="noopenner noreferrer">BLOG↗</a></li>
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

import styles from './Navigation.module.scss';
import React, { Component } from 'react';
import { HamburgerSpin } from 'react-animated-burgers'
import { Link } from 'react-router-dom'
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import { navItems } from '../../constants';

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
      }
    } else {
      menuDisplay = {
        display: 'none'
      }
    }

    return (
      <div class={styles.componentBody}>
        <header class={styles.header}>
          {/* Mobile Menu */}
          <ul class={styles.mobileNav} id={mobileNavId} style={menuDisplay}>
            <h1 class={styles.logo}><Link to="/">Optimism</Link></h1>
            {navItems.map(item => item.internal ? (
              <Link className={styles.navItem} to={item.url}>{item.name}</Link>
            ) : (
                <li className={styles.navItem}><a href={item.url} target="_blank" rel="noopenner noreferrer">{item.name}</a></li>
              ))}
          </ul>
          {/* Desktop Menu */}
          <h1 class={styles.logo}><Link to="/">Optimism</Link></h1>
          <ul class={`${styles.mobileNav}, ${styles.desktopNav}`}>
            {navItems.map(item => item.internal ? (
              <Link className={styles.navItem} to={item.url}>{item.name}</Link>
            ) : !item.social ? (
              <li className={styles.navItem}><a href={item.url} target="_blank" rel="noopenner noreferrer">{item.name}</a></li>
            ) : null)}
          </ul>
          <HamburgerSpin buttonWidth={40} className={styles.burger} isActive={this.state.isActive} toggleButton={this.toggleButton} barColor={this.state.isActive ? 'white' : '#f01a37'} />
        </header>
      </div>
    )
  }
}

export default Navigation;

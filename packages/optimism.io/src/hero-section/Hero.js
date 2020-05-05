import React, { Component } from 'react';
import styles from './Hero.module.css';
import heroImage from './hero.svg';

class Hero extends Component {
  render() {
    return (
    	<div  class={styles.hero}>
	    	<div>

	    		<div class={styles.welcomeMessage}>
	    			<h1>The New Scalability Stack for Ethereum</h1>
	    			<p>The Optimistic Virtual Machine (OVM) is the 
	    			best software platform for running your Ethereum dApp.</p>
	    		</div>
	    		<div class={styles.transitionMessage}>
	    			<h2>SYNTHETIX.EXCHANGE</h2>
	    			<h2>CASE STUDY</h2>
	    			<div class={styles.roundButton}>
	    				<a class={styles.roundButtonLink} href={"#Demo"}>⇩</a>
	    			</div>
	    		</div>
	    		<div class={styles.bg}></div>
	    	</div>

    	</div>
    )
  }
}

export default Hero;

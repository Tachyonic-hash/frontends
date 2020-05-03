import React, { Component } from 'react';
import styles from './Quote.module.css';
import quotationMarks from './quotes.png'
import kain from './kain.png'
import ethTiltedLogo from './ethTiltedLogo.svg'

class Demo extends Component {
  render() {
    return (
    	<div>
	    	<div class={styles.quoteSection}>
	    		<div class={styles.logo}>
		    			<img src={ethTiltedLogo}></img>
		    	</div>
	    		<div class={styles.quote}>
		    		<img src={quotationMarks}></img>
		    		<h1>The OVM is one of the most exciting 
		    		developments in Ethereum history, 
		    		and will for the first time reveal the full 
		    		potential of Ethereum when it launches later 
		    		this year.</h1>
		    		<div class={styles.flexContainer}>
		    			<div class={styles.flexItem}>
		    				<img src={kain}></img>
		    			</div>
		    			<div class={styles.flexItem}>
		    				<div>Kain Warwick</div>
		    				<div style={{fontWeight: "Bold"}}>Synthetix CEO</div>
		    			</div>
		    		</div>
		    	</div>
	    	</div>
    	</div>
    )
  }
}

export default Demo;

import React, { Component } from 'react';
import styles from './Quote.module.css';
import quotationMarks from './quotes.png'
import justin from './justin.png'
import ethTiltedLogo from './ethTiltedLogo.svg'

class Demo extends Component {
  render() {
    return (
    	<div>
	    	<div class={styles.quoteSection}>
				<div class={styles.logo}>
		    			<img alt="" src={ethTiltedLogo}></img>
		    	</div>
				<img alt="" class={styles.quotationMark} src={quotationMarks}></img>
	    		<div class={styles.quote}>
					<h1>The OVM is one of the most exciting developments for Ethereum today. It
		    		tackles one of the biggest problems a project like ours has - how to 
		    		empower users with near-instant trading and subsecond tick data. Optimism has 
		    		consistently demonstrated their commitment to L1 compatability - both in terms of reusing our existing 
		    		infrastructure and in connecting to other L1 services we rely on, such as The Graph.”</h1>
		    		<div class={styles.flexContainer}>
		    			<div class={styles.flexItem}>
		    				<img alt="" src={justin}></img>
		    			</div>
		    			<div class={styles.flexItem}>
		    				<div>Justin J. Moses</div>
		    				<div style={{fontWeight: "Bold"}}>Synthetix CTO</div>
		    			</div>
		    		</div>
		    	</div>
	    	</div>
    	</div>
    )
  }
}

export default Demo;

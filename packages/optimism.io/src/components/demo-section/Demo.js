import React, { Component } from 'react';
import styles from './Demo.module.css';
import synthetixlogo from './synthetix.png'

class Demo extends Component {
  render() {
    return (
		<div>
		<div class={styles.demoSection} id="Demo">
			<div class={styles.header}>
				<h1>Synthetix Exchange on the OVM Demo</h1>
				<p>This demo represents a milestone in our journey to bring 
				the speed of centralized finance to the world of decentralized 
				finance.</p>
			</div>
    		<div class={styles.demoCard}>
	    		<div class={styles.flexDemoHeader}>
		    		<div class={styles.flexItem}><img alt="" className={styles.synthetixLogo} src={synthetixlogo}></img></div>
					<a href='https://blog.synthetix.io/l2-sx-ovm-demo-results/' target="_blank" rel="noopener noreferrer">
						<div class={styles.flexItem}><button>Demo Recap↗</button></div>
					</a>
	    		</div>
	    		<div style={{background: "white", textAlign: "left", padding: "1.5rem", overflow: "hidden"}}>
	    			<h2>Demo Results</h2>
	    		</div>
	    		<div class={styles.flexDemoBody}>
		    		<div class={styles.flexItemLeft}>
		    			<div class={styles.curveHighlight}>
			    			<h4><span style={{color: "red", fontSize: "14"}}>↓</span>143x</h4>
			    			<h3>Decrease in L1 Gas Cost</h3>
			    			<br></br>
			    			<h5> Optimistic Ethereum: 3.3k GAS</h5>
			    			<h5> Ethereum: 472.2k GAS</h5>
		    			</div>
		    		</div>
		    		<div class={styles.flexItemRight}>
		    			<div class={styles.curveHighlight}>
			    			<h4>0.3s</h4>
			    			<h3>Confirmation Time</h3>
			    			<br></br>
			    			<h5> Optimistic Ethereum: 0.3 SEC</h5>
			    			<h5> Ethereum: 15.0 SEC</h5>
		    			</div>
		    			
		    		</div>
	    		</div>
	    	</div>

    	</div>
    	</div>
    )
  }
}

export default Demo;

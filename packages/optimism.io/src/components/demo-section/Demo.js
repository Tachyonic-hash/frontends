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
		    		<div class={styles.flexItem}><img className={styles.synthetixLogo} src={synthetixlogo}></img></div>
					<a href='https://l2.synthetix.exchange/' target="_blank">
						<div class={styles.flexItem}><button>View Demo↗</button></div>
					</a>
	    		</div>
	    		<div style={{background: "white", textAlign: "left", padding: "1.5rem", overflow: "hidden"}}>
	    			<h2>Demo Results</h2>
	    		</div>
	    		<div class={styles.flexDemoBody}>
		    		<div class={styles.flexItemLeft}>
		    			<div class={styles.curveHighlight}>
			    			<h4><span style={{color: "red", fontSize: "14"}}>↓</span>600x</h4>
			    			<h3>Reductions in Cost</h3>
			    			<br></br>
			    			<h5> Optimistic Ethereum: 10k GAS</h5>
			    			<h5> Ethereum: 1 MILLION GAS</h5>
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

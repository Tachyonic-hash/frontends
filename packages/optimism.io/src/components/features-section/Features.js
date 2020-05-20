import styles from './Features.module.css';
import React, { Component } from 'react';
import unipig from './unipig.png';
import integrations from './integrations.png'
import babyeth from './babyeth.png'

class Features extends Component {
  render(){
    return(
    	<div>
    		<div class ={styles.heading}>
    			<p>FEATURES OF THE</p>
    			<h1>Optimistic Virtual Machine</h1>
    		</div>
    		<div class={`${styles.flexContainer} ${styles.wrap}`}>
                <div class={`${styles.flexItem} ${styles.info}`}>
                    <h2>Instant Confirmations</h2>
    				<p>Optimistic Rollup brings Web 2 UX to 
    				Web 3 apps with a 10-100x reduction in gas cost.</p>
    				<a href="https://unipig.exchange/welcome">UNISWAP DEMO COLLAB ↗</a>
    			</div>
    			<div class={styles.flexItem}>
    				<img src={unipig}></img>
    			</div>
    		</div>
    		<div class={`${styles.flexContainer} ${styles.wrap}`} style={{backgroundColor: "#EFF0F8"}}>
                <div class={`${styles.flexItem} ${styles.info}`}>
    				<h2>(Theoretically) Effortless Migration</h2>
    				<p>OVM smart contracts scale with a few lines of code  
    				and no changes to your workflow. We're adding more support 
    				for features every day.</p>
    				<a href="https://github.com/ethereum-optimism/optimism-monorepo">
    					CHECK OUT OUR GITHUB↗
    				</a>
    			</div>
    			<div class={styles.flexItem}>
    				<img src={integrations}></img>
    			</div>
    		</div>
    		<div class={`${styles.flexContainerDark} ${styles.wrap}`}>
                <div class={`${styles.flexItem} ${styles.small}  ${styles.info}`}>
    				<h2>Secure and Unstoppable</h2>
    				<p>Make no sacrifices for scalability. 
    				Security and censorship resistance ensured 
    				by Ethereum.</p>
    			</div>
    			<div class={styles.flexItem}>
    				<img src={babyeth}></img>
    			</div>
    		</div>
	    </div>
    )
  }
}

export default Features;

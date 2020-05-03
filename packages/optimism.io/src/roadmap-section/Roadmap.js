import React, { Component } from 'react';
import styles from './Roadmap.module.css';

class Roadmap extends Component {
  render() {
    return (
    	<div>
    		<div class ={styles.heading}>
    			<p>FOLLOW OUR JOURNEY</p>
    			<h1>Roadmap to Launch</h1>
    		</div>
    		<div class={styles.flexContainer}>
	    		<table>
	    			<tr>
	    				<td>JUN 2019</td>
	    				<td> ✓ </td>
	    				<td>Introduced Optimistic Rollup</td>
	    			</tr>
	    			<tr>
	    				<td>OCT 2019</td>
	    				<td> ✓ </td>
	    				<td>Launched PoC Unipig Exchange</td>
	    			</tr>
	    			<tr>
	    				<td>OCT 2019</td>
	    				<td> ✓ </td>
	    				<td>Launched PoC Unipig Exchange</td>
	    			</tr>
	    			<tr>
	    				<td>DEC 2019</td>
	    				<td> ✓ </td>
	    				<td>Optimism PBC raises $3.5m</td>
	    			</tr>
	    			<tr>
	    				<td>FEB 2020</td>
	    				<td> ✓ </td>
	    				<td>Release OVM Alpha</td>
	    			</tr>
	    			<tr className={styles.current}>
	    				<td style={{color: "#F01A37"}}><b>APR 2020</b></td>
	    				<td></td>
	    				<td><b>SYNTHETIX DEMO & TRADING COMP</b></td>
	    			</tr>
	    			<tr className={styles.new}>
	    				<td>SEP 2020</td>
	    				<td> </td>
	    				<td>Optimistic Rollup Testnet</td>
	    			</tr>
	    			<tr className={styles.new}>
	    				<td>Q4 2020</td>
	    				<td> </td>
	    				<td>Single Sequencer Mainnet</td>
	    			</tr>
	    			<tr className={styles.new}>
	    				<td>Q2 2021</td>
	    				<td> </td>
	    				<td>Decentralized Sequencer</td>
	    			</tr>
	    			<tr className={styles.new}>
	    				<td>Q4 2021</td>
	    				<td> </td>
	    				<td>MEVA Powered Ecosystem Launch</td>
	    			</tr>
	    		</table>
    		</div>
    	</div>
    )
  }
}

export default Roadmap;

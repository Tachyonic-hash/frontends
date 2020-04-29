import styles from './Philosophy.module.css';
import React, { Component } from 'react';
import ethlogo from './ethPlanetPhilosophy.svg';

class Philosophy extends Component {
	render(){
		return(
			<div>
			<div class={styles.header}></div>

			<div class={styles.body}>	

				<img src={ethlogo} alt="ethlogo" />

				<h1>Our Philosophy</h1>
				<p>Optimism is a Public Benefit Corporation (PBC):
				 a for-profit corporation intended to produce a public
				  benefit and operate in a responsible and sustainable manner. 
				  This means that we are obligated to balance the pecuniary
				  interests of our stockholders with the best interests of
				  those materially affected by our conduct, as well as a
				  specific "public benefit charter" we incorporated with.</p>
				  <p>Optimism is a Public Benefit Corporation (PBC):
				 a for-profit corporation intended to produce a public
				  benefit and operate in a responsible and sustainable manner. 
				  This means that we are obligated to balance the pecuniary
				  interests of our stockholders with the best interests of
				  those materially affected by our conduct, as well as a
				  specific "public benefit charter" we incorporated with.</p>
				  <p>Optimism is a Public Benefit Corporation (PBC):
				 a for-profit corporation intended to produce a public
				  benefit and operate in a responsible and sustainable manner. 
				  This means that we are obligated to balance the pecuniary
				  interests of our stockholders with the best interests of
				  those materially affected by our conduct, as well as a
				  specific "public benefit charter" we incorporated with.</p>
			</div>

			</div>

		)
	}
}

export default Philosophy;
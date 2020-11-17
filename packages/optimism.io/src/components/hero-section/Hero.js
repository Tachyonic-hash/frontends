import React, { Component } from 'react';
import styles from './Hero.module.scss';
import heroImage from './hero.svg';

class Hero extends Component {
	render() {
		return (
			<div class={styles.hero}>
				<div>

					<div class={styles.welcomeMessage}>
						<h1>The New Scalability Stack for Ethereum</h1>
						<p>Instant transactions and scalable smart contracts on Ethereum.</p>
					</div>
					<div class={styles.bg}></div>
				</div>

			</div>
		)
	}
}

export default Hero;

import styles from './News.module.scss';
import React, { Component } from 'react';
import news1 from './news1.png'
import news2 from './news2.png'
import news3 from './news3.png'

class News extends Component {
	render() {
		return (
			<div>
				<h2 class={styles.underline}>Light Bedtime Reading</h2>
				<div class={`${styles.flexNews} ${styles.wrap}`}>
					<div class={styles.flexItem}>
						<div class={styles.date}>15 Jan</div>
						<img src={news1}></img>
						<h3>The Block | Non-techincal</h3>
						<h2><a href="https://www.theblockcrypto.com/post/53017/plasma-group-researchers-
		        	raise-3-5m-from-paradigm-and-ideo-to-start-new-company">
							PG Researchers raise $3.5m from Paradigm and IDEO to start Optimism</a></h2>
					</div>
					<div class={styles.flexItem}>
						<div class={styles.date}>11 Feb</div>
						<img src={news2}></img>
						<h3>Our Blog | Mildly technical</h3>
						<h2><a href="https://medium.com/ethereum-optimism/optimistic-
		        	virtual-machine-alpha-cdf51f5d49e">
							Announcing the Optimistic Virtual Machine (OVM) Alpha</a></h2>
					</div>
					<div class={styles.flexItem}>
						<div class={styles.date}>15 Jan</div>
						<img src={news3}></img>
						<h3>Ethresearch | Very technical</h3>
						<h2><a href="https://ethresear.ch/t/mev-auction-auctioning-transaction-ordering-
		        	rights-as-a-solution-to-miner-extractable-value/6788">
							Funding public goods: MEV Auction as a solution to Miner Extractable Value</a></h2>
					</div>
				</div>
			</div>
		)
	}
}

export default News;

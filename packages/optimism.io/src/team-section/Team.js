import styles from './Team.module.css';
import React, { Component } from 'react';

class Team extends Component {
	render(){
		return(
			<div>
				<div class={styles.flexContainer}>
					<div class={styles.leftFlex}><h1>Meet The Team</h1></div>
					<div class={styles.bigFlex}>	
						<div class={styles.card}>
							<img src="http://placehold.it/190x190"></img>
							<p>Karl Floersch</p>
						</div>
						<div class={styles.card}>
							<img src="http://placehold.it/190x190"></img>
							<p>Mason Fischer</p>
						</div>
						<div class={styles.card}>
							<img src="http://placehold.it/190x190"></img>
							<p>Kevin Ho</p>
						</div>
						<div class={styles.card}>
							<img src="http://placehold.it/190x190"></img>
							<p>Ben Jones</p>
						</div>
						<div class={styles.card}>
							<img src="http://placehold.it/190x190"></img>
							<p>Will Meister</p>
						</div>
						<div class={styles.card}>
							<img src="http://placehold.it/190x190"></img>
							<p>Jinglan Wang</p>
						</div>
					</div>
					<div class={styles.rightFlex}></div>
				</div>
			</div>

		)
	}
}

export default Team;
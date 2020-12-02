import React, { Component } from 'react';
import { Center, Container, Heading } from "@chakra-ui/react"
import styles from './Hero.module.scss';
import heroImage from './hero.svg';

class Hero extends Component {
	render() {
		return (
			<Container>
				<Center height="100vh">
					<div >
						<Heading as="h1">The New Scalability Stack for Ethereum</Heading>
						<p>Instant transactions and scalable smart contracts</p>
						<div class={styles.bg}></div>
					</div>
				</Center>
			</Container>
		)
	}
}

export default Hero;

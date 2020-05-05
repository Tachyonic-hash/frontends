import React, { Component } from 'react';
import styles from './GasCalc.module.css';

class GasCalc extends Component {
  state = { etherscanLink: ''};
  handleFormSubmit(e) {
    e.preventDefault();
    console.log(this.state.etherscanLink)
  }

  render() {
    return (
    	<div>
    		<div class ={styles.heading}>
    			<h1>See how much Gas the OVM saves you.</h1>
    			<p>Paste an Etherscan link to a transaction to see how much you would save on Optimistic Ethereum</p>
    		</div>
    		<div class={styles.flexContainer}>
				<form className={styles.form} onSubmit={this.handleFormSubmit}>
					<input 
				  		className={styles.input} 
				  		type="link"
				  		name="etherscan-link"
				  		placeholder="https://etherscan.io/tx/0x..."
				  		onChange={event => this.setState({ etherscanLink: event.target.value })}
					></input>
					<button className={styles.button} type="submit">Calculate</button>
				</form>
    		</div>
    	</div>
    )
  }
}

export default GasCalc;

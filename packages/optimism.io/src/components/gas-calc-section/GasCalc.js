import React, { Component } from 'react';
import styles from './GasCalc.module.css';
import { ethers } from 'ethers'
import axios from 'axios'

class GasCalc extends Component {
  state = { etherscanLink: ''};
  async handleFormSubmit(e) {
    e.preventDefault();
    console.log(this.state.etherscanLink)
    const provider =  ethers.getDefaultProvider()
    const txReceipt = await provider.getTransactionReceipt(this.state.etherscanLink)
    const txData = await provider.getTransaction(this.state.etherscanLink)
    const no0x = txData.raw.substr(2)
    let zeroBytes = 0
    let dataBytes = 0
    for (let j = 0; j < no0x.length; j+=2) {
      const curByte = no0x.substr(j, 2)
      if(curByte == 0) {
        zeroBytes++
      } else {
        dataBytes++
      }
    }
    dataBytes += 32 // 32 byte state root
    const l2Gas =
      (zeroBytes * 4) + 
      (dataBytes * 16) + 
      2000 + //20k SSTORE for a batch of 10 transctions
      2000   //20k SSTORE for a batch of 10 state roots
    console.log(zeroBytes, 'zero bytes,', dataBytes, 'data bytes')
    console.log('Ethereum Gas:', txReceipt.gasUsed.toNumber())
    console.log('Optimistic Ethereum Gas:', l2Gas)
    const l1TxFee = await this.feeInUSD(txData.gasPrice, txReceipt.gasUsed)
    console.log('Ethereum Tx Fee: ', l1TxFee)
    const l2TxFee = await this.feeInUSD(txData.gasPrice, l2Gas)
    console.log('Total Optimistic Ethereum Tx Fee: ', l2TxFee, '(L1 gas cost) +', l2TxFee, '(L2 tx fee) = ', l2TxFee*2)
    this.setState({
      l1Gas: txReceipt.gasUsed.toNumber(),
      l2Gas,
      l1TxFee,
      l2TxFee
    })
  }

  async feeInUSD(gasPrice, gasUsed) {
    const result = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=USD',
      { timeout: 8e3 }, // 8 second timeout
    );
    const feeInWei = gasPrice.mul(gasUsed)
    const feeInEth = ethers.utils.formatUnits(feeInWei, 'ether')
    return result.data.ethereum.usd * parseFloat(feeInEth)

  }


  render() {
    const {l1Gas, l2Gas, l1TxFee, l2TxFee} = this.state
    return (
    	<div>
    		<div class ={styles.heading}>
    			<h1>See how much Gas the OVM saves you.</h1>
    			<p>Paste an Etherscan link to a transaction to see how much you would save on Optimistic Ethereum</p>
    		</div>
    		<div class={styles.flexContainer}>
				<form className={styles.form} onSubmit={this.handleFormSubmit.bind(this)}>
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
        <div>
          {l1Gas} {l2Gas} {l1TxFee} {l2TxFee}
        </div>
    	</div>
    )
  }
}

export default GasCalc;

import React, { Component } from 'react';
import styles from './GasCalc.module.css';
import { ethers } from 'ethers'
import axios from 'axios'

class GasCalc extends Component {
  state = {
    containsLink: false,
    etherscanLink: '',
    uniswap: 'https://etherscan.io/tx/0xede50390e4db646946eeacee58f0ad0f0778d46486c2da6f38da0f8a1f6c791e',
    chainlink: 'https://etherscan.io/tx/0x6421837fa962982a7d74da713292e92c1989b580888fd76503d2e994349a1745',
    synthetix: 'https://etherscan.io/tx/0x3a4d99fd0f1e2b14ca42cbfbf4fe8891dd969b3e2af076f194668002d83d036a',
    makerdao: 'https://etherscan.io/tx/0xbe00a3a6c2c8d49243e6f4b5c5723aefca24108da875db7787ad752e21dce61a',
    compound: 'https://etherscan.io/tx/0x7ce9cd92a82113a8d935d73cc55ce36ba5bd9dde3dad2c0140cf73081d8079fe'
  };
  handleInputOverride(button) {
    this.setState({
      etherscanLink: this.state[button],
      selected: button,
      containsLink: true
    })

  }
  async handleFormSubmit(e) {
    e.preventDefault();
    if (!this.state.containsLink) return
    const provider =  ethers.getDefaultProvider()
    const txHash = this.state.etherscanLink.substr(this.state.etherscanLink.indexOf('0x'))
    console.log('txHash', txHash)
    const txReceipt = await provider.getTransactionReceipt(txHash)
    const txData = await provider.getTransaction(txHash)
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
    const gasSaved = (txReceipt.gasUsed.toNumber()/l2Gas).toFixed(1)
    this.setState({
      isCalculated: true,
      l1Gas: txReceipt.gasUsed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      l2Gas: l2Gas.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      l1TxFee,
      l2TxFee,
      gasSaved
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
  isActive(value){
    return styles.button + ' ' + ((value === this.state.selected) ? styles.active : '');
  }
  handleChange(event) {
    let containsLink = false
    const etherscanLink = event.target.value
    if (etherscanLink.indexOf('etherscan') > 0 && etherscanLink.indexOf('tx/0x') > 0) {
      containsLink = true
    }
    this.setState({
      etherscanLink,
      selected: '',
      containsLink
    })
  }
  render() {
    const {l1Gas, l2Gas, l1TxFee, l2TxFee, etherscanLink, isCalculated, gasSaved, containsLink} = this.state
    return (
    	<div>
    		<div class ={styles.heading}>
    			<h1>See how much Gas the OVM saves you.</h1>
    			<p>Paste an Etherscan link to a transaction to see how much you would save on Optimistic Ethereum</p>
    		</div>
        <div class={styles.flexContainer}>
          <button className={this.isActive('uniswap')} onClick={this.handleInputOverride.bind(this, 'uniswap')}>Uniswap</button>
          <button className={this.isActive('chainlink')} onClick={this.handleInputOverride.bind(this, 'chainlink')}>Chainlink</button>
          <button className={this.isActive('synthetix')} onClick={this.handleInputOverride.bind(this, 'synthetix')}>Synthetix</button>
          <button className={this.isActive('makerdao')} onClick={this.handleInputOverride.bind(this, 'makerdao')}>MakerDAO</button>
          <button className={this.isActive('compound')} onClick={this.handleInputOverride.bind(this, 'compound')}>Compound</button>
        </div>
    		<div class={styles.flexContainer}>
  				<form className={styles.form} onSubmit={this.handleFormSubmit.bind(this)}>
  					<input 
				  		className={styles.input} 
				  		type="link"
				  		name="etherscan-link"
				  		placeholder="e.g. https://etherscan.io/tx/0x..."
              value={etherscanLink}
				  		onChange={this.handleChange.bind(this)}
  					></input>
            {
              containsLink
              ? <a className={styles.button} href={etherscanLink} target="_blank">↗️</a>
              : <a className={`${styles.button} ${styles.disabled}`} name ='disabled_link'>↗️</a>
            }
  					<button className={styles.button + (containsLink ? '' : styles.disabled)} type="submit" onSubmit={this.handleFormSubmit.bind(this)}>Calculate</button>
  				</form>
          { !!isCalculated ? <GasCalcResults l1Gas={l1Gas} l2Gas = {l2Gas} gasSaved = {gasSaved}/> : null }
    		</div>
    	</div>
    )
  }
}

const GasCalcResults = (props) => (
  <div class={styles.flexContainer}>
    <div>
      {'Ethereum (Gas Cost): ' + props.l1Gas}
    </div>
    <div>
      {'Optimism (Gas Cost): ' + props.l2Gas}
    </div>
    <div>
      {'Gas Cost Reduction on Optimistic Rollup: ' + props.gasSaved + 'x'}
    </div>
  </div>
)

export default GasCalc;

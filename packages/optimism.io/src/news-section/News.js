import styles from './News.module.css';
import React, { Component } from 'react';

class News extends Component {
  render(){
    return(
    	<div>
    		<div class={styles.underline}>In the News</div>
	    	<div class={`${styles.flexContainer} ${styles.wrap}`}>
		        <div class={styles.flexItem}>
		        	<div class={styles.date}>09 Jan</div>
		        	<img src="http://placehold.it/200x150"></img>
		        	<h3>Decrypt</h3>
		        	<h2>Plasma Group and Uniswap Release New Scaling Solution</h2>
		        </div>
		        <div class={styles.flexItem}>
		        	<div class={styles.date}>09 Jan</div>
		        	<img src="http://placehold.it/200x150"></img>
		        	<h3>The Block</h3>
		        	<h2>Plasma Group and Uniswap Release New Scaling Solution</h2>
		        </div>
		        <div class={styles.flexItem}>
		        	<div class={styles.date}>09 Jan</div>
		        	<img src="http://placehold.it/200x150"></img>
		        	<h3>Coindesk</h3>
		        	<h2>Plasma Group and Uniswap Release New Scaling Solution</h2>
		        </div>
		    </div>
	    </div>
    )
  }
}

export default News;

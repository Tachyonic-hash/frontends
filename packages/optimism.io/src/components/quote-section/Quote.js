import React, { Component } from 'react';
import styles from './Quote.module.css';
import quotationMarks from './quotes.png';
import ethTiltedLogo from './ethTiltedLogo.svg';

function Quote({ quote, author, title, imageUrl }) {
  return (
    <div>
      <div class={styles.quoteSection}>
        <div class={styles.logo}>
          <img src={ethTiltedLogo} />
        </div>
        <img class={styles.quotationMark} src={quotationMarks} />
        <div class={styles.quote}>
          <h1>{quote}"</h1>
          <div class={styles.flexContainer}>
            <div class={styles.flexItem}>
              <img src={imageUrl} />
            </div>
            <div class={styles.flexItem}>
              <div>{author}</div>
              <div style={{ fontWeight: 'Bold' }}>{title}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quote;

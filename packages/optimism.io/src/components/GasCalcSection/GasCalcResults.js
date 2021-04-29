import React from 'react';
import styles from './GasCalc.module.css';

const GasCalcResults = props => {
  const { l1Gas, l2Gas, l2UsdPrice, gasSaved } = props;
  return (
    <div className={styles.flexContainer}>
      <div className={styles.flexColumn}>
        <div className={styles.flexOutputGas}>
          <div className={styles.result}>{l1Gas}</div>
          <div className={styles.description}>Gas cost on layer 1</div>
        </div>
        <div className={styles.flexOutputGas}>
          <div className={styles.result}>{l2Gas}</div>
          <div className={styles.description}>Gas cost on Optimism</div>
        </div>
      </div>
      <div className={styles.flexOutputDelta}>
        <div className={styles.usd}>
          Fee on Optimism: ${l2UsdPrice}
          {/* <InfoOutlineIcon color="brandSecondary" ml={2} /> */}
        </div>
        <div className={styles.result}>{gasSaved + 'x'}</div>
        <div className={styles.description}>Savings with Optimism</div>
      </div>
    </div>
  );
};

export default GasCalcResults;

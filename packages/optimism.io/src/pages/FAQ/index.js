import React from 'react';
import styles from './styles.module.css';
import faqData from './faqData.yaml';

console.log(faqData)

function FAQ() {
  return (
    <div>
      <div class={styles.header}>
        FAQ
      </div>
      <ul class={styles.body}>
        {/* {faqData.map(item => (
          <li>
            <p>{item.question}</p>
            <p>{item.answer}</p>
          </li>
        ))} */}
      </ul>
    </div>
  );
}

export default FAQ;

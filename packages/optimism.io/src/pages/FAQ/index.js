import React from 'react';
import styles from './FAQ.module.scss';
import faqs from './faqData.yaml';

function FAQ() {
  return (
    <div class={styles.body}>
      <header class={styles.pageHeader}>
        Frequently Asked Questions
      </header>
      <ul class={styles.list}>
        {faqs.map(item => (
          <li>
            <p>{item.question}</p>
            <p>{item.answer}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FAQ;

import React from 'react';
import styles from './FAQ.module.scss';
import faqs from './faqData.yaml';
import PageHeader from '../../components/PageHeader';

function FAQ() {
  return (
    <div class={styles.body}>
      <PageHeader>Frequently Asked Questions</PageHeader>
      <ul class={styles.list}>
        {faqs.map((item) => (
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

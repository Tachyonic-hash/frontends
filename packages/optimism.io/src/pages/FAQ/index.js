import React from 'react';
import styles from './FAQ.module.scss';
import faqs from './faqData.yaml';
import { PageHeader } from '../../components/Headers';

function FAQ() {
  return (
    <div className={styles.body}>
      <PageHeader>Frequently Asked Questions</PageHeader>
      <ul className={styles.list}>
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

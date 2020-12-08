import React from 'react';
import styles from './FAQ.module.scss';
import faqs from './faqData.yaml';
import { PageHeader } from '../../components/Headers';
import Container from '../../components/Container';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  AccordionIcon,
  AccordionPanel,
} from '@chakra-ui/react';

function FAQ() {
  return (
    <Container>
      <PageHeader>Frequently Asked Questions</PageHeader>
      <Accordion>
        {faqs.map((item) => (
          <AccordionItem mt={4}>
            <AccordionButton
              bgColor="transparent !important"
              border="none"
              borderBottom="1px solid #ccc"
              py={4}
              px={0}
              fontSize="xl"
              cursor="pointer"
            >
              <Box flex="1" textAlign="left">
                {item.question}
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel py={4}>{item.answer}</AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Container>
  );
}

export default FAQ;

import React from 'react';
import faqs from './faq.yaml';
import { PageHeader } from '../../components/Headers';
import Container from '../../components/Container';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  AccordionIcon,
  AccordionPanel,
  useMediaQuery,
} from '@chakra-ui/react';

function FAQ() {
  const [smallScreen] = useMediaQuery('(max-width: 900px)');
  return (
    <Container>
      <PageHeader>
        {smallScreen ? 'FAQ' : 'Frequently Asked Questions'}
      </PageHeader>
      <Accordion allowToggle>
        {faqs.map((item) => (
          <AccordionItem mt={4} key={item.question}>
            <AccordionButton
              bgColor="transparent !important"
              border="none"
              borderBottom="1px solid #ccc"
              py={4}
              px={0}
              fontSize={('xl', '2xl')}
              fontStyle="italic"
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

import React from 'react';
import Container from '../../components/Container';
import { PageHeader } from '../../components/Headers';
import GasCalcSection from '../../components/GasCalcSection';

function GasComparison() {
  return (
    <Container maxW="1200px">
      <PageHeader>Gas Comparison</PageHeader>
      <GasCalcSection />
    </Container>
  );
}

export default GasComparison;

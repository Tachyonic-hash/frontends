import React, { Component } from 'react';
import { Box, Text, Divider } from '@chakra-ui/react';
import { SectionHeader } from '../../components/Headers';
import ButtonLink from '../../components/ButtonLink';
import Container from '../../components/Container';
import styles from './Roadmap.module.scss';

class Roadmap extends Component {
  render() {
    return (
      <Container maxW="containerLg">
        <div className={styles.heading}>
          {/* <p>FOLLOW OUR JOURNEY</p> */}
          <SectionHeader>Roadmap to Launch</SectionHeader>
        </div>

        <Box fontSize={['sm', 'md']}>
          <table className={styles.roadMapTable}>
            <tbody>
              <tr className={styles.old}>
                <td>JUN 2019</td>
                <td> ✓ </td>
                <td>Introduced Optimistic Rollup</td>
              </tr>
              <tr className={styles.old}>
                <td>OCT 2019</td>
                <td> ✓ </td>
                <td>Launched PoC Unipig Exchange</td>
              </tr>
              <tr className={styles.old}>
                <td>SEP 2020</td>
                <td> ✓ </td>
                <td>Testnet Trial</td>
              </tr>
              <tr className={styles.old}>
                <td>JAN 2021</td>
                <td> ✓ </td>
                <td>Test-in-prod Mainnet</td>
              </tr>
              <tr className={styles.current}>
                <td style={{ color: '#F01A37' }}>
                  <b>APR 2021</b>
                </td>
                <td></td>
                <td>
                  <b>Hackathon Testnet</b>
                </td>
              </tr>
              <tr className={styles.new}>
                <td>JUL 2021</td>
                <td> </td>
                <td>Public Mainnet</td>
              </tr>
              <tr className={styles.new}>
                <td>Qz 202a</td>
                <td> </td>
                <td>Decentralized Sequencer</td>
              </tr>
              <tr className={styles.new}>
                <td>Qb 202c</td>
                <td> </td>
                <td>MEVA Powered Ecosystem Launch</td>
              </tr>
            </tbody>
          </table>
          <Divider borderColor="brandPrimary" mb={[8, 16]} mt={20} />
          <Box my={20} mx="auto" textAlign="center">
            <Text fontSize={[20, 24, 28]}>
              Interested in deploying your app on Optimism?
            </Text>
            <ButtonLink href="https://docs.google.com/forms/d/e/1FAIpQLSdKyXpXY1C4caWD3baQBK1dPjEboOJ9dpj9flc-ursqq8KU0w/viewform">
              Sign up here
            </ButtonLink>
          </Box>
        </Box>
      </Container>
    );
  }
}

export default Roadmap;

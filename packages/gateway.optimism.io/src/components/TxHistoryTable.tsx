import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  Spinner,
  Center,
  Button,
  Text,
  Box,
  Flex,
  HStack,
  Link as ExternalLink,
  useToast,
  Tooltip,
} from '@chakra-ui/react';
import { useHistory, Link, useRouteMatch } from 'react-router-dom';
import { ethers } from 'ethers';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import DateTime from 'luxon/src/datetime.js';
import Interval from 'luxon/src/interval.js';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { formatNumber, formatUSD, shortenAddress } from '../helpers';
import { txDirection, chainIds, TxDirectionType, THE_GRAPH_MAX_INTEGER, FETCH_LIMIT } from '../constants';
import { modalTypes } from './Modal';
import AppContext from '../context';

const Dot = ({ color }: { color: string }) => (
  <Box d="inline-block" h="12px" w="12px" bgColor={`${color} !important`} mr="10px" borderRadius="100%" />
);

type TxHistoryProps = {
  filterAddress?: string;
  currentTableView?: string;
  setCurrentTableView: (view: keyof TxDirectionType) => void;
  setWithdrawalAmountPending: (amount: string) => void;
  setDepositAmountPending: (amount: string) => void;
  setl1TotalAmt: (amount: string) => void;
  setl2TotalAmt: (amount: string) => void;
  queryParams?: URLSearchParams;
  fetchTransactions: (props: any) => Promise<Transaction[] | undefined>;
  transactions?: Transaction[];
  txsLoading: boolean;
  isFetchingMore: boolean;
  totalTxCount: number;
};

function TxHistoryTable({
  currentTableView,
  setCurrentTableView,
  queryParams,
  fetchTransactions,
  transactions,
  txsLoading,
  isFetchingMore,
  totalTxCount,
}: TxHistoryProps) {
  const { connectedChainId, prices, userAddress } = React.useContext(AppContext);
  const history = useHistory();
  const [lastBtnClicked, setLastBtnClicked] = React.useState('');
  const [dateFormat, setDateFormat] = React.useState('MOMENT');
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const toast = useToast();
  const match = useRouteMatch();

  const changeDateFormat = () => {
    setDateFormat(dateFormat === 'MOMENT' ? 'DURATION' : 'MOMENT');
  };

  const copiedToClipboard = (text: string) => {
    toast({
      title: 'Copied to clipboard:',
      description: text,
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'bottom-left',
    });
  };

  const AddressWrapper = ({ children, address }: { children: React.ReactChild; address?: string }) => {
    return address ? (
      <CopyToClipboard text={address} onCopy={copiedToClipboard}>
        {children}
      </CopyToClipboard>
    ) : (
      <Link to={`/a/${address}`}>{children}</Link>
    );
  };

  const handleDirectionButtonClick = (direction: keyof TxDirectionType) => {
    if (!queryParams) return;
    queryParams.set('dir', direction);
    history.push({
      search: queryParams.toString(),
    });
    setCurrentTableView(direction);
  };

  const daysOrMinutes = currentTableView === txDirection.OUTGOING ? 'days' : 'minutes';
  const firstTxIndex = transactions?.length ? transactions[0].index : Number.MAX_SAFE_INTEGER;
  const network =
    connectedChainId === chainIds.KOVAN_L1 || connectedChainId === chainIds.KOVAN_L2 ? 'kovan' : 'mainnet';

  return (
    <Box>
      <Box variant="soft-rounded" mt={8} mb={16} overflow="hidden">
        <Box d="flex" justifyContent="space-between">
          <HStack mb={4} spacing={10}>
            <Button
              onClick={() => handleDirectionButtonClick(txDirection.INCOMING)}
              size="md"
              variant={currentTableView === txDirection.INCOMING ? 'outline' : 'ghost'}
            >
              INCOMING
            </Button>
            <Button
              onClick={() => handleDirectionButtonClick(txDirection.OUTGOING)}
              size="md"
              variant={currentTableView === txDirection.OUTGOING ? 'outline' : 'ghost'}
            >
              OUTGOING
            </Button>
          </HStack>
        </Box>
        <>
          {txsLoading || !transactions ? (
            <Center py="100px" maxW="200px" mx="auto">
              <Box d="flex" flexDir="column" alignItems="center">
                <Spinner h="150px" w="150px" />
              </Box>
            </Center>
          ) : !transactions.length ? (
            <Text textAlign="center" mt="100px" fontSize="xl">
              No transactions found
            </Text>
          ) : (
            <>
              <Table className="txHistoryTable" size={'sm'} minW="1100px">
                <Thead>
                  <Tr>
                    <Th w="7%" px={'0.5rem'} onClick={changeDateFormat} cursor="pointer">
                      Initiated
                    </Th>
                    <Th minW="30px" w="5%" px={'0.5rem'}>
                      From
                    </Th>
                    <Th minW="30px" w="5%" px={'0.5rem'}>
                      To
                    </Th>
                    <Th w="4%" px={'0.5rem'}>
                      Token
                    </Th>
                    <Th w="12%" px={'0.5rem'}>
                      Amount
                    </Th>
                    <Th w="12%" textAlign="left" px={'0.5rem'}>
                      <Box
                        d="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        overflow="hidden"
                        whiteSpace="pre"
                        textOverflow="ellipsis"
                      >
                        Status
                      </Box>
                    </Th>
                    <Th w="2%" textAlign="center" px={'0.5rem'}>
                      L1
                    </Th>
                    <Th w="2%" textAlign="right" px={'0.5rem'}>
                      L2
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {transactions.map((tx, i) => {
                    return (
                      <React.Fragment key={i}>
                        <Tr background={i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent'}>
                          <Td px={'0.5rem'} onClick={changeDateFormat} cursor="pointer">
                            {dateFormat === 'MOMENT'
                              ? DateTime.fromMillis(tx.timestamp).toLocaleString(DateTime.DATETIME_SHORT)
                              : DateTime.local()
                                  .minus(Date.now() - tx.timestamp)
                                  .toRelative({ round: false })}
                          </Td>
                          <Td overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" px={'0.5rem'}>
                            <AddressWrapper address={tx.from}>
                              <Box as="span" cursor="pointer">
                                {shortenAddress(tx.from, 4)}
                              </Box>
                            </AddressWrapper>
                          </Td>
                          <Td overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" px={'0.5rem'}>
                            <AddressWrapper address={tx.to}>
                              <Box as="span" cursor="pointer">
                                {tx.to && shortenAddress(tx.to, 4)}
                              </Box>
                            </AddressWrapper>
                          </Td>
                          <Td overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" px={'0.5rem'}>
                            {tx.iconURL && tx.symbol && (
                              <Box d="flex" alignItems="center" h="1.2rem">
                                <Image
                                  src={tx.iconURL}
                                  borderRadius="100%"
                                  mr={2}
                                  h={'20px'}
                                  w={'20px'}
                                  padding={'0 !important'}
                                />
                                {tx.symbol}
                              </Box>
                            )}
                          </Td>
                          <Td textOverflow="ellipsis" overflow="hidden" whiteSpace="pre">
                            {tx.amount && formatNumber((+ethers.utils.formatEther(tx.amount as BigIntIsh)).toFixed(6))}
                            {'  '}
                            {prices && prices[tx.tokenId as string] ? (
                              <>
                                (
                                {formatUSD(
                                  +ethers.utils.formatEther(tx.amount as BigIntIsh) * prices[tx.tokenId as string]
                                )}
                                )
                              </>
                            ) : (
                              tx.amount && (
                                <Flex alignItems="center" d="inline-flex">
                                  <Spinner size="xs" ml={2} />
                                </Flex>
                              )
                            )}
                          </Td>
                          <Td px={'0.5rem'} textAlign="left">
                            {tx.layer1Hash && tx.relayedTxTimestamp ? (
                              <>
                                <Dot color="#75cc74" />
                                Completed{' '}
                                {DateTime.fromMillis(tx.relayedTxTimestamp).toLocaleString(
                                  DateTime.DATETIME_SHORT
                                )}{' '}
                                {currentTableView === txDirection.OUTGOING &&
                                  `(
                                ${Interval.fromDateTimes(
                                  DateTime.fromMillis(tx.timestamp),
                                  DateTime.fromMillis(tx.relayedTxTimestamp)
                                )
                                  .toDuration(daysOrMinutes)
                                  .toObject()
                                  [daysOrMinutes]?.toFixed(2)}
                                ${daysOrMinutes})`}
                              </>
                            ) : isRefreshing ? (
                              <Spinner size="xs" />
                            ) : tx.awaitingRelay ? (
                              <>
                                <Dot color="#efefa2" />
                                Ready to claim
                                {/* <Button
                                  ml={4}
                                  background="transparent"
                                  borderWidth="1px"
                                  size="xs"
                                  onClick={() => openModal(modalTypes.CLAIM)}
                                >
                                  Claim
                                </Button> */}
                              </>
                            ) : (
                              <Tooltip
                                label={
                                  currentTableView === txDirection.INCOMING
                                    ? 'Deposits typically confirm in about 10 minutes'
                                    : 'Withdrawals require a 7 day waiting period to ensure system security.'
                                }
                              >
                                <Box>
                                  <Dot color="#f46969" />
                                  {currentTableView === txDirection.INCOMING
                                    ? 'Pending'
                                    : 'Pending until ' +
                                      DateTime.fromMillis(tx.timestamp)
                                        .plus({ days: 7 })
                                        .toLocaleString(DateTime.DATETIME_SHORT)}
                                </Box>
                              </Tooltip>
                            )}
                          </Td>
                          <Td px={'0.5rem'} textAlign="center">
                            {tx.layer1Hash ? (
                              <ExternalLink
                                color="default !important"
                                boxShadow="none !important"
                                href={`https://${network === 'kovan' ? 'kovan' : ''}.etherscan.io/tx/${tx.layer1Hash}`}
                                isExternal={true}
                              >
                                <ExternalLinkIcon />
                              </ExternalLink>
                            ) : (
                              '...'
                            )}
                          </Td>
                          <Td px={'0.5rem'} textAlign="right">
                            {tx.layer2Hash ? (
                              <ExternalLink
                                color="default !important"
                                boxShadow="none !important"
                                href={`https://${network === 'kovan' ? 'kovan-' : ''}explorer.optimism.io/tx/${
                                  tx.layer2Hash
                                }`}
                                isExternal={true}
                              >
                                <ExternalLinkIcon />
                              </ExternalLink>
                            ) : (
                              '...'
                            )}
                          </Td>
                        </Tr>
                      </React.Fragment>
                    );
                  })}
                </Tbody>
              </Table>
              {/* TODO: make pagination work for individual addresses. Currently disabled because its designed to only work for full tx list */}
              {match.path !== '/txs/:address' && !userAddress && (
                <Center pt={8} w="400px" mx="auto">
                  <Button
                    d="flex"
                    mx="auto"
                    mt={8}
                    w="130px"
                    onClick={() => {
                      setLastBtnClicked('prev');
                      fetchTransactions({
                        page: 'prev',
                        indexTo: (transactions[0].index + FETCH_LIMIT || THE_GRAPH_MAX_INTEGER) + 1,
                      });
                    }}
                    // descending order, so we're at the start of the list if the index === totalTxCount
                    disabled={firstTxIndex + 1 === totalTxCount}
                  >
                    {isFetchingMore && lastBtnClicked === 'prev' ? <Spinner ml={2} size="sm" /> : 'Previous page'}
                  </Button>
                  <Button
                    d="flex"
                    mx="auto"
                    mt={8}
                    w="130px"
                    onClick={() => {
                      setLastBtnClicked('next');
                      fetchTransactions({ page: 'next', indexTo: transactions[transactions.length - 1].index || 0 });
                    }}
                    // descending order, so we're at the end of the list if the index === 0
                    disabled={transactions?.length !== 0 && transactions[transactions.length - 1].index === 0}
                  >
                    {isFetchingMore && lastBtnClicked === 'next' ? <Spinner ml={2} size="sm" /> : 'Next page'}
                  </Button>
                </Center>
              )}
            </>
          )}
        </>
      </Box>
    </Box>
  );
}

export default TxHistoryTable;

import React from 'react';
import { ethers } from 'ethers';
import { useTable, usePagination } from 'react-table';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
  Center,
  Text
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { DateTime } from 'luxon';
import Container from '../../components/Container';
import { PageHeader } from '../../components/Headers';
import history from './history.json';

export const shortenAddress = (address: string = '', charLength: number = 8) =>
  address.slice(0, charLength + 2) +
  '...' +
  address.slice(address.length - charLength, address.length);

history.sort((a, b) => b.completedTime - a.completedTime);

const columns = [
  {
    Header: 'Address',
    accessor: 'account',
    Cell: ({ value }) => shortenAddress(value)
  },
  {
    Header: 'Amount',
    accessor: 'amount',
    Cell: ({ value }) => {
      return (+ethers.utils.formatEther(value)).toFixed(6);
    }
  },
  {
    Header: 'Initiated',
    accessor: 'initiatedTime',
    Cell: ({ value }) => {
      return DateTime.fromMillis(value).toLocaleString(DateTime.DATETIME_SHORT);
    }
  },
  // {
  //   Header: 'Completed',
  //   accessor: 'completedTime'
  // },
  // {
  //   Header: 'l2 Info',
  //   accessor: 'l2TransactionHash',
  //   Cell: ({ value }) => {
  //     return (
  //       <Center>
  //         <Link
  //           href={`http://mainnet-l2-explorer.surge.sh/tx/${value}`}
  //           isExternal
  //         >
  //           <ExternalLinkIcon />
  //         </Link>
  //       </Center>
  //     );
  //   }
  // },
  {
    Header: 'Explorer',
    accessor: 'l1TransactionHash',
    Cell: ({ value }) => {
      return value ? (
        <Center>
          <Link href={`https://etherscan.io/tx/${value}`} isExternal>
            <ExternalLinkIcon />
          </Link>
        </Center>
      ) : (
        <Center>...</Center>
      );
    }
  }
];

function SNXHistory() {
  const tableInstance = useTable({ columns, data: history }, usePagination);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = tableInstance;

  return (
    <Container maxW="1200px">
      <PageHeader>Synthetix withdrawals</PageHeader>
      <Text mb={8} fontSize="1.2rem">
        This table contains all completed SNX mainnet withdrawals up until a
        regenesis that occured on April 9, 2021.
      </Text>
      <Table {...getTableProps()} variant="striped" size="sm" minW="800px">
        <Thead>
          {headerGroups.map(headerGroup => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => {
                return (
                  <Th
                    {...column.getHeaderProps()}
                    textAlign={
                      column.Header.includes('Explorer') ? 'center' : 'left'
                    }
                  >
                    {column.render('Header')}
                  </Th>
                );
              })}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Container>
  );
}

export default SNXHistory;

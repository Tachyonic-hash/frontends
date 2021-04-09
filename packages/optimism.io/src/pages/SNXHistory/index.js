import React from 'react';
import { useTable, usePagination } from 'react-table';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
  Center
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { DateTime } from 'luxon';
import Container from '../../components/Container';
import history from './history.json';

export const shortenAddress = (address: string = '', charLength: number = 12) =>
  address.slice(0, charLength + 2) +
  '...' +
  address.slice(address.length - charLength, address.length);

const columns = [
  {
    Header: 'Address',
    accessor: 'account'
  },
  // {
  //   Header: 'Amount',
  //   accessor: 'amount'
  // },
  {
    Header: 'Initiated',
    accessor: 'initiatedTime',
    Cell: ({ value }) => {
      return DateTime.fromMillis(value).toLocaleString(DateTime.DATETIME_SHORT);
    }
  },
  {
    Header: 'Completed',
    accessor: 'completedTime'
  },
  {
    Header: 'l2 Info',
    accessor: 'l2TransactionHash',
    Cell: ({ value }) => {
      return (
        <Center>
          <Link
            href={`http://mainnet-l2-explorer.surge.sh/tx/${value}`}
            isExternal
          >
            <ExternalLinkIcon />
          </Link>
        </Center>
      );
    }
  },
  {
    Header: 'l1 Info',
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
    <Container pt={8} maxW="1200px" px={0}>
      <Table {...getTableProps()} variant="striped" size="sm">
        <Thead>
          {headerGroups.map(headerGroup => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => {
                return (
                  <Th
                    {...column.getHeaderProps()}
                    textAlign={
                      column.Header.includes('Info') ? 'center' : 'left'
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

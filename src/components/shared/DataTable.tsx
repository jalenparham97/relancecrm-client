import React, { useEffect } from 'react';
import { Table as MantineTable, Checkbox, Box } from '@mantine/core';
import { useTable, useRowSelect } from 'react-table';

interface Props {
  columns?: any;
  data?: any;
  setSelectedIds: (ids: string[]) => void;
}

export default function DataTable({ columns, data, setSelectedIds }: Props) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    state: { selectedRowIds },
  } = useTable(
    {
      columns,
      data,
    },
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: 'selection',
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <Box>
              <Checkbox {...getToggleAllRowsSelectedProps()} />
            </Box>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <Box>
              <Checkbox {...row.getToggleRowSelectedProps()} />
            </Box>
          ),
        },
        ...columns,
      ]);
    }
  );

  useEffect(() => {
    setSelectedIds(selectedFlatRows.map((d) => d.original.id));
  }, [selectedFlatRows]);

  return (
    <>
      <MantineTable highlightOnHover {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th className="!p-4" {...column.getHeaderProps()}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td className="!py-3 !px-4" {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </MantineTable>
    </>
  );
}

import { useEffect } from 'react';
import { Table as MantineTable, Checkbox, Box } from '@mantine/core';
import { useTable, useRowSelect, useGlobalFilter } from 'react-table';
import { isEmpty } from 'lodash';
import { FiTrash2 } from 'react-icons/fi';
import DataTableGlobalFilter from './DataTableGlobalFilter';
import Button from './Button';

interface Props {
  columns?: any;
  data?: any;
  setSelectedIds: (ids: string[]) => void;
  searchPlaceholder?: string;
  onDeleteClick?: () => void;
}

export default function DataTable({
  columns,
  data,
  setSelectedIds,
  searchPlaceholder = 'Search',
  onDeleteClick,
}: Props) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    setGlobalFilter,
    preGlobalFilteredRows,
    state,
  } = useTable(
    {
      columns,
      data,
    },
    useRowSelect,
    useGlobalFilter,
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
      <Box className="px-4 pt-4">
        {isEmpty(selectedFlatRows) && (
          <DataTableGlobalFilter
            placeholder={searchPlaceholder}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        )}
        {!isEmpty(selectedFlatRows) && (
          <Button leftIcon={<FiTrash2 />} color="red" onClick={onDeleteClick}>
            Delete
          </Button>
        )}
      </Box>
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

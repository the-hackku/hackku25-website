import React from "react";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import { TextInput, Table, LoadingOverlay } from "@mantine/core";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";

const GlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) => {
  const count = preGlobalFilteredRows.length;

  return (
    <TextInput
      value={globalFilter || ""}
      onChange={(e) => setGlobalFilter(e.target.value || undefined)}
      placeholder={`Search among ${count} records...`}
      style={{ marginBottom: "10px" }}
    />
  );
};

const CustomTable = ({ columns, data, loading }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable({ columns, data }, useGlobalFilter, useSortBy);

  return (
    <>
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <Table
        {...getTableProps()}
        striped
        highlightOnHover
        withTableBorder
        withColumnBorders
      >
        <LoadingOverlay visible={loading} />
        <Table.Thead>
          {headerGroups.map((headerGroup) => (
            <Table.Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Table.Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  style={{
                    cursor: "pointer",
                    padding: "4px 8px",
                    width: column.width, // Apply the column width
                  }}
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <IconArrowDown size={16} />
                      ) : (
                        <IconArrowUp size={16} />
                      )
                    ) : (
                      ""
                    )}
                  </span>
                </Table.Th>
              ))}
            </Table.Tr>
          ))}
        </Table.Thead>
        <Table.Tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <Table.Tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <Table.Td
                    {...cell.getCellProps()}
                    style={{
                      padding: "4px 8px",
                      width: cell.column.width, // Apply the column width
                    }}
                  >
                    {cell.render("Cell")}
                  </Table.Td>
                ))}
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </>
  );
};

export default CustomTable;

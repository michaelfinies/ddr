"use client";
import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  Row,
} from "@tanstack/react-table";

export function DataTable({ columns, data, pageSize = 10, getRowProps }) {
  const [pageIndex, setPageIndex] = React.useState(0);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { pagination: { pageIndex, pageSize } },
    manualPagination: false,
    pageCount: Math.ceil(data.length / pageSize),
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        setPageIndex((old) => updater({ pageIndex: old, pageSize }).pageIndex);
      } else {
        setPageIndex(updater.pageIndex);
      }
    },
  });

  // Basic pagination logic
  const pagedRows = table
    .getRowModel()
    .rows.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-2 text-left">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {pagedRows.map((row) => (
            <tr key={row.id} {...(getRowProps ? getRowProps(row) : {})}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Simple Pagination */}
      <div className="p-2 flex items-center gap-2">
        <button
          onClick={() => setPageIndex((old) => Math.max(old - 1, 0))}
          disabled={pageIndex === 0}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {pageIndex + 1} of{" "}
          {Math.max(1, Math.ceil(data.length / pageSize))}
        </span>
        <button
          onClick={() => setPageIndex((old) => old + 1)}
          disabled={pageIndex + 1 >= Math.ceil(data.length / pageSize)}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

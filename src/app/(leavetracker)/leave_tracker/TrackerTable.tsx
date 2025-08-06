"use client";

import type { TrackerSearchResultsType } from "@/lib/queries/getTrackersSearchResults";
import { deleteTracker } from "@/lib/deleTrackerRecord";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  getPaginationRowModel,
  getFilteredRowModel,
  getFacetedUniqueValues,
  SortingState,
  getSortedRowModel,
  CellContext,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  TableOfContents,
  LoaderCircle,
  Trash,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
} from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import usePolling from "@/hooks/usePolling";
import Filter from "@/components/react-table/Filter";
import { toast } from "sonner";

type Props = {
  data: TrackerSearchResultsType;
};

type RowType = TrackerSearchResultsType[0];

export default function TrackerTable({ data }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "trackersDate",
      desc: false,
    },
  ]);

  usePolling(10000, searchParams.get("searchText"));

  const pageIndex = useMemo(() => {
    const page = searchParams.get("page");
    return page ? parseInt(page) - 1 : 0;
  }, [searchParams.get("page")]);

  const columnHeadersArray: Array<keyof RowType> = [
    "trackersDate",
    "name",
    "type",
    "Date_of_Leave",
    "Number_of_Days",
    "Date_of_Return",
    "Total_Leave",
    "Received_By_Supervisor",
    "Approved_By_Executive_Director"
  ];

  const columnHelper = createColumnHelper<RowType>();

  const ActionsCell = ({ row }: CellContext<RowType, unknown>) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
      setIsDeleting(true);
      try {
        await deleteTracker(row.original.id);
        toast.success(`Deleted Leave Tracker #${row.original.id} successfully!`, {
          duration: 3000,
          description: "The tracker record has been removed.",
        });
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong while deleting.");
      } finally {
        setIsDeleting(false);
      }
    };

    const showDeleteWarning = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isDeleting) return;
      toast.warning(
        <div className="flex flex-col gap-2">
          <span className="font-bold text-red-600 dark:text-red-400">Delete Leave Tracker?</span>
          <span className="text-sm">This action cannot be undone. Are you sure you want to delete record #{row.original.id}?</span>
        </div>,
        {
          duration: 8000,
          action: {
            label: "Delete",
            onClick: handleDelete,
          },
          cancel: {
            label: "Cancel",
            onClick: () => toast.dismiss(),
          },
          className: "max-w-xs sm:max-w-sm md:max-w-md p-4 rounded-lg border border-red-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-lg flex flex-col gap-2",
          position: "top-center",
          closeButton: true,
        }
      );
    };

    return (
      <Button
        onClick={showDeleteWarning}
        className="text-red-600 hover:text-red-800 cursor-pointer"
        aria-label="Delete"
        disabled={isDeleting}
      >
        {isDeleting ? (
          <LoaderCircle className="w-5 h-5 animate-spin" />
        ) : (
          <Trash className="w-5 h-5" />
        )}
      </Button>
    );
  };

  ActionsCell.displayName = "ActionsCell";
  const formattedDateFields = ["trackersDate", "Date_of_Leave", "Date_of_Return"];


  const columns = [
    columnHelper.display({
      id: "actions",
      size: 50,
      header: () => (
        <div className="flex justify-center items-center">
          <TableOfContents className="h-4 w-4" />
        </div>
      ),
      cell: ActionsCell,
    }),
    ...columnHeadersArray.map((columnName) =>
      columnHelper.accessor((row) => {
        const value = row[columnName];
    
        // Format specific fields as MM/DD/YYYY
        if (formattedDateFields.includes(columnName) && value instanceof Date) {
          return value.toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
        }

    
        return value;
      }, {
        id: columnName,
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="pl-1 w-full flex justify-between"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {columnName[0].toLowerCase() + columnName.slice(1)}
            {column.getIsSorted() === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
            {column.getIsSorted() === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}
            {!column.getIsSorted() && <ArrowUpDown className="ml-2 h-4 w-4" />}
          </Button>
        ),
      })
    )




    
  ];

  columns.forEach((col) => {
    if (col.id === "Received_By_Supervisor") {
      col.cell = ({ row }) => {
        const status = row.original.Received_By_Supervisor;
        return (
          <span
            className={`font-medium ${
              status === "Approved" ? "" : ""
            }`}
          >
            {status}
          </span>
        );
      };

      col.filterFn = (row, columnId, filterValue) => {
        const cellValue = row.getValue(columnId) as string;
        return cellValue.toLowerCase().trim() === filterValue.toLowerCase().trim();
      };
    }

    if (col.id === "Approved_By_Executive_Director") {
      col.cell = ({ row }) => {
        const status = row.original.Approved_By_Executive_Director;
        return (
          <span
            className={`font-medium ${
              status === "Approved" ? "" : ""
            }`}
          >
            {status}
          </span>
        );
      };

      col.filterFn = (row, columnId, filterValue) => {
        const cellValue = row.getValue(columnId) as string;
        return cellValue.toLowerCase().trim() === filterValue.toLowerCase().trim();
      };
    }
  });




  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageIndex,
        pageSize: 10,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getSortedRowModel: getSortedRowModel(),
  });

  useEffect(() => {
    const currentPageIndex = table.getState().pagination.pageIndex;
    const pageCount = table.getPageCount();
    if (pageCount <= currentPageIndex && currentPageIndex > 0) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [table.getState().columnFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="rounded-lg overflow-hidden border border-border">
        <Table className="border">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                    <TableHead
                        key={header.id}
                        className="bg-secondary p-1 text-center"
                        style={{ width: header.getSize() }}
                        >
                        <div className="text-center">
                            {!header.isPlaceholder &&
                            flexRender(header.column.columnDef.header, header.getContext())}
                        </div>
                        {header.column.getCanFilter() && (
                            <div className="mt-1 flex justify-center">
                            <Filter
                                column={header.column}
                                filteredRows={table
                                .getFilteredRowModel()
                                .rows.map((row) => row.getValue(header.column.id))}
                            />
                            </div>
                        )}
                    </TableHead>

                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="cursor-pointer hover:bg-border/25 dark:hover:bg-ring/40"
                onClick={() =>
                  router.push(`/leave_tracker/form?trackerId=${row.original.id}`)
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="border">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-cols sm:flex-row justify-between items-center gap-1 flex-wrap">
        <div>
          <p className="whitespace-nowrap font-bold">
            {`Page ${table.getState().pagination.pageIndex + 1} of ${Math.max(
              1,
              table.getPageCount()
            )} `}
            &nbsp;&nbsp;
            {`[${table.getFilteredRowModel().rows.length} ${
              table.getFilteredRowModel().rows.length !== 1 ? "total results" : "result"
            }]`}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-1">
          <div className="space-x-1">
            <Button variant="outline" onClick={() => table.resetSorting()}>
              Reset Sorting
            </Button>
            <Button variant="outline" onClick={() => table.resetColumnFilters()}>
              Reset Filters
            </Button>
          </div>
          <div className="flex flex-row gap-1">
            <Button variant="outline" onClick={() => router.refresh()}>
              Refresh Data
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const newIndex = table.getState().pagination.pageIndex - 1;
                table.setPageIndex(newIndex);
                const params = new URLSearchParams(searchParams.toString());
                params.set("page", (newIndex + 1).toString());
                router.replace(`?${params.toString()}`, { scroll: false });
              }}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const newIndex = table.getState().pagination.pageIndex + 1;
                table.setPageIndex(newIndex);
                const params = new URLSearchParams(searchParams.toString());
                params.set("page", (newIndex + 1).toString());
                router.replace(`?${params.toString()}`, { scroll: false });
              }}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { useMediaQuery } from '@/lib/hooks/use-media-query';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

/* --------------------------------- PARENT --------------------------------- */
/**
 * @notice A pagination component for the DataTable
 * @dev This component is meant to be displayed alongside the DataTable with the same
 * table instance
 * @param table The table instance from tanstack react-table
 * @dev Modified from shadcn/ui
 * @see https://ui.shadcn.com/docs/components/data-table
 */
const DataTablePagination = <TData,>({
  table,
}: DataTablePaginationProps<TData>) => {
  const isDesktop = useMediaQuery('(min-width: 768px)'); // md

  return (
    <div className="flex flex-col items-center gap-2 md:flex-row md:justify-between md:gap-6 lg:gap-8">
      {isDesktop ? (
        <>
          <RowsPerPageControls table={table} />
          <NavigationControls table={table} />
        </>
      ) : (
        <>
          <NavigationControls table={table} />
          <RowsPerPageControls table={table} />
        </>
      )}
    </div>
  );
};

/* ------------------------- ROWS PER PAGE CONTROLS ------------------------- */
const RowsPerPageControls = <TData,>({
  table,
}: DataTablePaginationProps<TData>) => {
  return (
    <div className="flex w-full items-center justify-between gap-4">
      <p className="text-sm font-medium text-secondary-foreground">
        Rows per page
      </p>
      <Select
        value={`${table.getState().pagination.pageSize}`}
        onValueChange={(value) => {
          table.setPageSize(Number(value));
        }}
      >
        <SelectTrigger className="h-8 w-[70px]">
          <SelectValue placeholder={table.getState().pagination.pageSize} />
        </SelectTrigger>
        <SelectContent side="top">
          {[5, 10, 20, 30, 40, 50].map((pageSize) => (
            <SelectItem key={pageSize} value={`${pageSize}`}>
              {pageSize}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

/* ------------------------ NAVIGATION CONTROLS ------------------------ */
const NavigationControls = <TData,>({
  table,
}: DataTablePaginationProps<TData>) => {
  return (
    <div className="flex w-full items-center justify-between gap-4">
      <div className="flex items-center justify-center text-sm font-medium text-secondary-foreground">
        Page {table.getState().pagination.pageIndex + 1} of{' '}
        {table.getPageCount()}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="hidden size-8 p-0 lg:flex"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to first page</span>
          <DoubleArrowLeftIcon className="size-4" />
        </Button>
        <Button
          variant="outline"
          className="size-8 p-0"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeftIcon className="size-4" />
        </Button>
        <Button
          variant="outline"
          className="size-8 p-0"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRightIcon className="size-4" />
        </Button>
        <Button
          variant="outline"
          className="hidden size-8 p-0 lg:flex"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to last page</span>
          <DoubleArrowRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
};

export default DataTablePagination;

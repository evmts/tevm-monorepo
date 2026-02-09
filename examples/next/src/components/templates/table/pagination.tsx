import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons'
import type { Table } from '@tanstack/react-table'
import { useMedia } from 'react-use'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface DataTablePaginationProps<TData> {
	table: Table<TData>
}

/* -------------------------------- CONSTANTS ------------------------------- */
const PAGE_SIZES = [5, 10, 20, 30, 40, 50]

/* --------------------------------- PARENT --------------------------------- */
/**
 * @notice A pagination component for the DataTable
 * @dev This component is meant to be displayed alongside the DataTable with the same
 * table instance
 * @param table The table instance from tanstack react-table
 * @dev Modified from shadcn/ui
 * @see https://ui.shadcn.com/docs/components/data-table
 */
const DataTablePagination = <TData,>({ table }: DataTablePaginationProps<TData>) => {
	const isDesktop = useMedia('(min-width: 768px)') // md

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
	)
}

/* ------------------------- ROWS PER PAGE CONTROLS ------------------------- */
const RowsPerPageControls = <TData,>({ table }: DataTablePaginationProps<TData>) => {
	return (
		<div className="flex w-full items-center justify-between gap-4">
			<p className="text-secondary-foreground text-sm font-medium">Rows per page</p>
			<Select
				value={`${table.getState().pagination.pageSize}`}
				onValueChange={(value) => table.setPageSize(Number(value))}
			>
				<SelectTrigger className="h-8 w-[70px]">
					<SelectValue placeholder={table.getState().pagination.pageSize} />
				</SelectTrigger>
				<SelectContent side="top">
					{PAGE_SIZES.map((pageSize) => (
						<SelectItem key={pageSize} value={`${pageSize}`}>
							{pageSize}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}

/* ------------------------ NAVIGATION CONTROLS ------------------------ */
const NavigationControls = <TData,>({ table }: DataTablePaginationProps<TData>) => {
	const toFirstPage = () => table.setPageIndex(0)
	const toLastPage = () => table.setPageIndex(table.getPageCount() - 1)
	const toPreviousPage = () => table.previousPage()
	const toNextPage = () => table.nextPage()

	return (
		<div className="flex w-full items-center justify-between gap-4">
			<div className="text-secondary-foreground flex items-center justify-center text-sm font-medium">
				Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
			</div>
			<div className="flex items-center space-x-2">
				<Button
					variant="outline"
					className="hidden size-8 p-0 lg:flex"
					onClick={toFirstPage}
					disabled={!table.getCanPreviousPage()}
				>
					<span className="sr-only">Go to first page</span>
					<DoubleArrowLeftIcon className="size-4" />
				</Button>
				<Button
					variant="outline"
					className="size-8 p-0"
					onClick={toPreviousPage}
					disabled={!table.getCanPreviousPage()}
				>
					<span className="sr-only">Go to previous page</span>
					<ChevronLeftIcon className="size-4" />
				</Button>
				<Button variant="outline" className="size-8 p-0" onClick={toNextPage} disabled={!table.getCanNextPage()}>
					<span className="sr-only">Go to next page</span>
					<ChevronRightIcon className="size-4" />
				</Button>
				<Button
					variant="outline"
					className="hidden size-8 p-0 lg:flex"
					onClick={toLastPage}
					disabled={!table.getCanNextPage()}
				>
					<span className="sr-only">Go to last page</span>
					<DoubleArrowRightIcon className="size-4" />
				</Button>
			</div>
		</div>
	)
}

export default DataTablePagination

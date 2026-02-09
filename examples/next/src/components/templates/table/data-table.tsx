'use client'

import { flexRender, type Table as TableInterface } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import DataTablePagination from '@/components/templates/table/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

type DataTableProps<TData> = {
	table: TableInterface<TData>
	header: ReactNode
	noDataLabel?: string
	pagination?: boolean
	className?: string
}

/**
 * @notice A table component that uses tanstack react-table and shadcn
 * @dev This component is meant as a generic template for better consistency across the app
 * @param table The table instance from tanstack react-table
 * @param header A header displayed above the table
 * @param noDataLabel A label to display when there is no data (default: 'No results.')
 * @param pagination Whether to display pagination (default: false)
 * @param className Additional classes to apply to the wrapper
 * @dev Modified from shadcn/ui
 * @see https://ui.shadcn.com/docs/components/data-table
 */
const DataTable = <TData,>({
	table,
	header,
	noDataLabel = 'No results.',
	pagination = false,
	className,
}: DataTableProps<TData>) => {
	return (
		<div className={cn('flex flex-col gap-2 rounded-md pb-2', className)}>
			{header ? <div className="flex items-center justify-between gap-4 p-2">{header}</div> : null}
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead key={header.id}>
										{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
									</TableHead>
								)
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id} className="font-mono">
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
								{noDataLabel}
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
			{pagination ? <DataTablePagination table={table} /> : null}
		</div>
	)
}

export default DataTable

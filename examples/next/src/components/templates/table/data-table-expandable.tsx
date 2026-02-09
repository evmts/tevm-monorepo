'use client'

import { CaretDownIcon } from '@radix-ui/react-icons'
import { flexRender, type Row, type Table as TableInterface } from '@tanstack/react-table'
import { type ReactNode, useState } from 'react'
import DataTablePagination from '@/components/templates/table/pagination'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

type DataTableProps<TData> = {
	table: TableInterface<TData>
	expandableRender: (row: Row<TData>) => ReactNode
	header: ReactNode
	noDataLabel?: string
	pagination?: boolean
	className?: string
}

/**
 * @notice A table component that uses tanstack react-table and shadcn
 * @dev This component is meant as a generic template for better consistency across the app
 * @param table The table instance from tanstack react-table
 * @param expandableRender The methode to render the expandable content (row)
 * @param header A header displayed above the table
 * @param noDataLabel A label to display when there is no data (default: 'No results.')
 * @param pagination Whether to display pagination (default: false)
 * @param className Additional classes to apply to the wrapper
 * @dev Modified from shadcn/ui
 * @see https://ui.shadcn.com/docs/components/data-table
 */
const DataTableExpandable = <TData,>({
	table,
	expandableRender,
	header,
	noDataLabel = 'No results.',
	pagination = false,
	className,
}: DataTableProps<TData>) => {
	const [collapsed, setCollapsed] = useState('')

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
							<TableHead className="w-12 text-xs">Expand</TableHead>
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<Collapsible
								key={row.id}
								onOpenChange={(o) => setCollapsed(o ? row.id : '')}
								open={collapsed === row.id}
								asChild
							>
								<TableRow
									data-state={row.getIsSelected() && 'selected'}
									className={cn(collapsed === row.id && 'border-b-0')}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="font-mono">
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
									<CollapsibleTrigger asChild>
										<TableCell className="flex justify-center">
											<Button variant="ghost" size="icon" className="p-0">
												<CaretDownIcon className={cn('size-4', collapsed === row.id && 'rotate-180')} />
											</Button>
										</TableCell>
									</CollapsibleTrigger>
								</TableRow>
								<CollapsibleContent asChild>
									<td colSpan={table.getAllColumns().length + 1} className="border-b pb-4">
										<div className="border-muted/30 border-x">{expandableRender(row)}</div>
									</td>
								</CollapsibleContent>
							</Collapsible>
						))
					) : (
						<TableRow>
							<TableCell colSpan={table.getAllColumns().length + 1} className="h-24 text-center">
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

export default DataTableExpandable

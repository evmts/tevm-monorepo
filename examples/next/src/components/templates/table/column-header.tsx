import { ArrowDownIcon, ArrowUpIcon, CaretSortIcon } from '@radix-ui/react-icons'
import type { Column } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>
	title: string
}

/**
 * @notice A header for a column in a data table
 * @dev This will show the title of the column and allow the user to sort it
 * @param column The column to show the header for
 * @param title The title of the column
 * @param className Additional classes to apply
 * @dev Modified from shadcn/ui
 * @see https://ui.shadcn.com/docs/components/data-table
 */
export function DataTableColumnHeader<TData, TValue>({
	column,
	title,
	className,
}: DataTableColumnHeaderProps<TData, TValue>) {
	if (!column.getCanSort()) {
		return <div className={cn(className)}>{title}</div>
	}

	return (
		<div className={cn('flex items-center space-x-2', className)}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="sm" className="data-[state=open]:bg-accent -ml-3 h-8">
						<span>{title}</span>
						{column.getIsSorted() === 'desc' ? (
							<ArrowDownIcon className="ml-2 size-4" />
						) : column.getIsSorted() === 'asc' ? (
							<ArrowUpIcon className="ml-2 size-4" />
						) : (
							<CaretSortIcon className="ml-2 size-4" />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					<DropdownMenuItem onClick={() => column.toggleSorting(false)}>
						<ArrowUpIcon className="text-secondary-foreground/70 mr-2 size-3.5" />
						Asc
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => column.toggleSorting(true)}>
						<ArrowDownIcon className="text-secondary-foreground/70 mr-2 size-3.5" />
						Desc
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}

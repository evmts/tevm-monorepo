'use client'

import type { ABI, ABIFunction } from '@shazow/whatsabi/lib.types/abi'
import {
	type ColumnDef,
	type ColumnFiltersState,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from '@tanstack/react-table'
import { type FC, Fragment, useCallback, useMemo, useRef, useState } from 'react'
import { useMedia } from 'react-use'
import { toast } from 'sonner'
import { Icons } from '@/components/common/icons'
import TooltipResponsive from '@/components/common/tooltip-responsive'
import { DataTableColumnHeader } from '@/components/templates/table/column-header'
import DataTable from '@/components/templates/table/data-table'
import { DataTableViewOptions } from '@/components/templates/table/view'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { formatTx as formatTxForLocalStorage } from '@/lib/local-storage'
import { useConfigStore } from '@/lib/store/use-config'
import { useProviderStore } from '@/lib/store/use-provider'
import { useTxStore } from '@/lib/store/use-tx'
import type { Input as InputType } from '@/lib/types/tx'
import { formatInputValue, getFunctionId } from '@/lib/utils'

type InterfaceTableProps = {
	data: ABI | null
	loading?: boolean
}

// A skeleton cell to show while loading
const SkeletonCell = () => <Skeleton className="h-4 w-16" />

/**
 * @notice A table to display the contract's interface
 * @dev This will display the contract's functions and ignore events.
 * @dev Each row shows the function's name, details, inputs that should be filled by the user,
 * and a button to call it.
 * @param data The contract's ABI
 * @param loading Whether the data is still loading
 * @returns A table with the contract's functions
 */
const InterfaceTable: FC<InterfaceTableProps> = ({ data, loading }) => {
	/* ---------------------------------- STATE --------------------------------- */
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

	// Expand the table from tablet
	const isTablet = useMedia('(min-width: 640px)') // sm

	// The current blockchain data for the call
	const { chain, client } = useProviderStore((state) => ({
		chain: state.chain,
		client: state.client,
	}))
	const { account, caller, abi, skipBalance, updateAccount } = useConfigStore((state) => ({
		account: state.account,
		caller: state.caller,
		abi: state.abi,
		skipBalance: state.skipBalance,
		updateAccount: state.updateAccount,
	}))

	// Manage transactions and inputs
	const { inputValues, processing, updateInputValue, initializeInputs, setProcessing, saveTx } = useTxStore(
		(state) => ({
			inputValues: state.inputValues,
			processing: state.processing,
			updateInputValue: state.updateInputValue,
			initializeInputs: state.initializeInputs,
			setProcessing: state.setProcessing,
			saveTx: state.saveTx,
		}),
	)

	/* ------------------------------- REFERENCES ------------------------------- */
	// Ref to track the currently focused input's identifier
	// This is necessary because editable cells will make the whole table re-render
	// on change and the focus will be lost
	const focusedInputRef = useRef<string | null>(null)

	// Whether a function is ready to be called (all inputs are filled); by function id
	const isCallReady = useMemo(
		() =>
			Object.fromEntries(
				Object.keys(inputValues).map((id) => [
					id,
					Object.values(inputValues[id].args).every((value) => value !== undefined && value !== ''),
				]),
			),
		[inputValues],
	)

	/* -------------------------------- HANDLERS -------------------------------- */
	// Call a function with the given input values
	const call = useCallback(
		async (
			functionName: string,
			inputValues: { type: string; name: string; value: string | number }[],
			value: string,
		) => {
			// There is no reason this would happen (as the table would not be displayed),
			// but just in the unlikely case we should let the user know
			if (!client || !account || !abi) {
				toast.info('There was an issue retrieving provider data. Please refresh the page.', {
					action: {
						label: 'Refresh',
						onClick: () => window.location.reload(),
					},
				})
				return
			}

			// Attempt to format inputs
			let formattedInputs: InputType[] = []
			try {
				formattedInputs = inputValues.map((input, i) => ({
					...inputValues[i],
					value: formatInputValue(input.type, input.value),
				}))
			} catch (err) {
				toast.error('Invalid input', {
					description: err instanceof Error ? err.message : "Couldn't format input",
				})
				return
			}
			// Check the value as well
			if (value !== '' && Number.isNaN(Number(value))) {
				toast.error('Invalid value', {
					description: 'Please enter a valid number for the value.',
				})
				return
			}

			// Display loading state
			setProcessing(functionName)
			const loading = toast.loading(`Calling ${functionName}...`, {
				description: 'Please wait while the transaction is being processed.',
			})

			// Start processing the transaction
			const tx = await client.tevmContract({
				from: caller,
				to: account.address,
				functionName,
				abi,
				args: formattedInputs.map((input) => input.value),
				value: BigInt(value),
				skipBalance,
			})

			// Report the result of the transaction to the user
			if (tx.errors?.length) {
				toast.error(tx.errors[0].name, {
					id: loading,
					description: tx.errors[0].message,
				})
			} else {
				const strData = typeof tx === 'string' ? tx : JSON.stringify(tx)
				const adaptedData =
					// Show the first 100 characters of the data if it's too long
					strData.toString().length > 100
						? `${strData.toString().slice(0, 100)}...`
						: // or the entire data if it's less than 100 characters
							data

				toast.success('Transaction successful!', {
					id: loading,
					description:
						// Don't try to display if there was no return value/transaction reverted/failed to retrieve it
						tx.rawData === '0x'
							? 'See below for more details.'
							: `Returned: ${adaptedData}. See below for more details.`,
				})
			}

			setProcessing('')

			// Update the account state after the call
			updateAccount(account.address, { updateAbi: false, chain, client }) // no need to wait for completion

			// Save the transaction to the local storage regardless of the result
			saveTx(
				chain.id,
				// TODO remove this util
				// TODO I likely broke this
				formatTxForLocalStorage(
					{
						errors: tx.errors as any,
						result: tx as any,
						couldDecodeOutput: true,
						value: tx.data as any,
					},
					{
						chainId: chain.id,
						target: account,
						caller,
						functionName,
						// Convert bigints to strings for local storage
						inputValues: JSON.parse(
							JSON.stringify(formattedInputs, (_, value) => (typeof value === 'bigint' ? value.toString() : value)),
						),
						value: tx.data as any,
					},
				),
			)
		},
		[data, chain, client, caller, account, abi, skipBalance, saveTx, setProcessing, updateAccount],
	)

	/* --------------------------------- COLUMNS -------------------------------- */
	const columns: ColumnDef<ABIFunction>[] = useMemo(
		() => [
			{
				accessorKey: 'name',
				header: ({ column }) => <DataTableColumnHeader column={column} title="Function" />,
				cell: ({ row }) => (loading ? <SkeletonCell /> : <pre>{row.original.name}</pre>),
			},
			{
				accessorKey: 'details',
				header: () => <span className="text-xs">Details</span>,
				cell: ({ row }) => {
					const mut = row.original.stateMutability

					if (loading) return <SkeletonCell />
					return (
						<div className="flex flex-col gap-1">
							<span>
								<pre>{row.original.sig}</pre>
							</span>
							<span className="text-secondary-foreground text-sm">{row.original.selector}</span>
							{/* We can't show for sure write functions, because sometimes the abi will specify
              "nonpayable/payable" for all functions if it couldn't determine the state */}
							<span className="text-secondary-foreground text-sm">
								{mut && (mut === 'pure' || mut === 'view') ? <Badge variant="secondary">read</Badge> : null}
							</span>
						</div>
					)
				},
			},
			{
				accessorKey: 'inputs',
				header: ({ column }) => (
					<div className="flex items-center gap-2">
						<DataTableColumnHeader column={column} title="Inputs" />
						<TooltipResponsive trigger="info" content="Function arguments" />
					</div>
				),
				cell: ({ row }) => {
					const payable = row.original.stateMutability === 'payable'
					// Find a unique id for the input for refocusing on rerender
					const id = getFunctionId(abi || [], row.original)

					if (loading || !inputValues[id]) return <SkeletonCell />
					if ((!row.original.inputs || row.original.inputs.length === 0) && !payable)
						return <Icons.close className="size-4 opacity-50" /> // no inputs

					return (
						<div className="grid items-center gap-x-4 gap-y-2 lg:grid-cols-[auto_1fr]">
							{payable ? (
								<>
									<Label
										htmlFor={`${id}-value`}
										className="text-secondary-foreground flex min-w-[100px] items-center gap-2 text-xs whitespace-nowrap sm:text-sm"
									>
										value ({chain.nativeCurrency.symbol})
										<TooltipResponsive
											trigger="info"
											content="The value to send with the transaction (please include all decimals)"
										/>
									</Label>
									<Input
										id={`${id}-value`}
										type="text"
										placeholder="0"
										className="h-7 w-full max-w-xs text-xs sm:h-9 sm:text-sm"
										value={inputValues[id].value as string}
										onFocus={() => (focusedInputRef.current = `${id}-value`)}
										onBlur={() => (focusedInputRef.current = null)}
										autoFocus={focusedInputRef.current === `${id}-value`}
										onChange={(e) => updateInputValue(id, -1, e.target.value)}
									/>
								</>
							) : null}
							{row.original.inputs?.map((input, index) => (
								<Fragment key={index}>
									<Label
										htmlFor={`${id}-args-${index}`}
										className="text-secondary-foreground min-w-[100px] text-xs whitespace-nowrap sm:text-sm"
									>
										{input.name || `arg ${index + 1}`}
									</Label>
									<Input
										id={`${id}-args-${index}`}
										placeholder={input.type}
										className="h-7 w-full max-w-xs text-xs sm:h-9 sm:text-sm"
										value={inputValues[id].args[index] as string | number}
										onFocus={() => (focusedInputRef.current = `${id}-args-${index}`)}
										onBlur={() => (focusedInputRef.current = null)}
										autoFocus={focusedInputRef.current === `${id}-args-${index}`}
										onChange={(e) => updateInputValue(id, index, e.target.value)}
									/>
								</Fragment>
							))}
						</div>
					)
				},
			},
			{
				accessorKey: 'call',
				header: () => (
					<div className="flex items-center gap-2 text-xs">
						Call
						<TooltipResponsive
							trigger="info"
							content="Call the function with the arguments entered in the precedent column"
						/>
					</div>
				),
				cell: ({ row }) => {
					// Find a unique id for the input for refocusing on rerender
					const id = getFunctionId(abi || [], row.original)

					if (loading || !inputValues[id]) return <SkeletonCell />
					return (
						<Button
							variant="secondary"
							size="sm"
							disabled={!isCallReady[id] || processing !== ''}
							onClick={() =>
								call(
									row.original.name || '', // we're actually confident this is not undefined
									row.original.inputs?.length
										? row.original.inputs.map((input, index) => ({
												type: input.type,
												name: input.name,
												value: inputValues[id].args[index] as string | number,
											}))
										: [],
									inputValues[id].value,
								)
							}
						>
							{processing === id ? <Icons.loading className="mr-2" /> : null}
							<span className="hidden sm:inline-block">Call</span>
							<Icons.right className="inline-block size-4 sm:hidden" />
						</Button>
					)
				},
			},
		],
		[abi, loading, inputValues, processing, isCallReady, chain.nativeCurrency.symbol, call, updateInputValue],
	)

	/* ---------------------------------- DATA ---------------------------------- */
	const dataMemoized: ABIFunction[] = useMemo(() => {
		if (loading) return Array(5).fill({})
		if (!data) return []

		// Filter out events
		const filtered = data.filter((func) => func.type === 'function') as ABIFunction[]
		// Initialize the input values for each function
		initializeInputs(filtered)

		// Return the functions sorted by name (ascending)
		return filtered.sort((a, b) => ((a.name?.toLowerCase() || '') > (b.name?.toLowerCase() || '') ? 1 : -1))
	}, [data, loading, initializeInputs])

	const table = useReactTable<ABIFunction>({
		data: dataMemoized,
		// Below tabled (640px), aggregate the name & details columns into one
		columns: isTablet
			? columns
			: [
					{
						...columns[0],
						cell: ({ row }) => {
							const mut = row.original.stateMutability

							if (loading) return <SkeletonCell />

							return (
								<div className="flex flex-col gap-1">
									<pre className="text-xs sm:text-sm">{row.original.name}</pre>
									{/* We can't show for sure write functions, because sometimes the abi will specify
                  "nonpayable/payable" for all functions if it couldn't determine the state */}
									<span>
										{mut && (mut === 'pure' || mut === 'view') ? <Badge variant="secondary">read</Badge> : null}
									</span>
								</div>
							)
						},
					},
					...columns.slice(2, columns.length),
				],
		getCoreRowModel: getCoreRowModel(),
		// Pagination
		getPaginationRowModel: getPaginationRowModel(),
		initialState: {
			pagination: {
				pageIndex: 0,
				pageSize: 5,
			},
		},
		// Prevent resetting the page on call
		autoResetPageIndex: false,

		// Sorting
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		// Filtering
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters,
		},
	})

	/* --------------------------------- RENDER --------------------------------- */
	return (
		<DataTable<ABIFunction>
			table={table}
			pagination={dataMemoized.length > 10}
			className="border-secondary rounded-none border-x px-2"
			header={
				<div className="flex w-full items-center justify-between gap-4">
					<span className="grow font-medium">Contract interface</span>
					<div className="flex items-center py-4">
						<Input
							placeholder="Filter functions..."
							value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
							onChange={(e) => table.getColumn('name')?.setFilterValue(e.target.value)}
							className="max-w-sm"
						/>
					</div>
					<DataTableViewOptions table={table} />
				</div>
			}
		/>
	)
}

export default InterfaceTable

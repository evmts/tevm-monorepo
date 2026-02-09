'use client'

import { useMemo, useState } from 'react'
import { useMedia } from 'react-use'
import { toast } from 'sonner'
import { type Hex, isAddress } from 'tevm/utils'
import { Icons } from '@/components/common/icons'
import TooltipResponsive from '@/components/common/tooltip-responsive'
import SkipBalanceCheck from '@/components/core/selection/skip-balance'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { DEFAULT_CALLER } from '@/lib/constants/defaults'
import { useConfigStore } from '@/lib/store/use-config'
import { useProviderStore } from '@/lib/store/use-provider'
import { cn } from '@/lib/utils'

/**
 * @notice Choose an address to impersonate as the caller during function calls
 * @dev The user can paste any address; if a `owner`/`getOwner`/`admin`/`getAdmin` method is found in the ABI,
 * they can impersonate them quickly
 */
const CallerSelection = () => {
	/* ---------------------------------- STATE --------------------------------- */
	// The current input value
	const [inputValue, setInputValue] = useState<string>('')
	// Whether the address passes the checksum
	const [isValidAddress, setIsValidAddress] = useState<boolean>(false)
	// Whether the owner is being fetched (if relevant)
	const [fetchingOwner, setFetchingOwner] = useState<boolean>(false)

	// Expand from tablet breakpoint
	const isTablet = useMedia('(min-width: 640px)') // sm

	// The current chain client (Tevm)
	const client = useProviderStore((state) => state.client)

	const { account, abi, caller, isHydrated, setCaller, resetCaller } = useConfigStore((state) => ({
		// Get the current account
		account: state.account,
		// Get the abi of the current contract (null if not fetched yet)
		abi: state.abi,
		// Get the current address to impersonate as the caller
		caller: state.caller,
		// Whether the local storage is rehydrated
		isHydrated: state.isHydrated,
		// Set the current address to impersonate as the caller
		setCaller: state.setCaller,
		// Reset the current address to impersonate as the caller (back to DEFAULT_CALLER)
		resetCaller: state.resetCaller,
	}))

	// Whether the current contract (if the account is a contract) has a known owner method
	// If it's the case and it returns an address, it will return its name,
	// otherwise, it will return undefined
	const ownerMethod = useMemo(() => {
		// There won't be an abi if the account is an EOA
		if (abi) {
			return abi.find(
				(method) =>
					method.type === 'function' &&
					(method.name === 'owner' ||
						method.name === 'getOwner' ||
						method.name === 'admin' ||
						method.name === 'getAdmin') &&
					method.outputs?.length &&
					method.outputs.some((output) => output.type === 'address'),
			)?.name
		}
	}, [abi])

	/* -------------------------------- HANDLERS -------------------------------- */
	// Update the current contract's address after verifying it
	// Let the user know if the address is invalid
	// This will avoid unnecessary requests to the blockchain as well
	const updateCaller = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (isAddress(e.target.value)) {
			setIsValidAddress(true)
			setCaller(e.target.value)
		} else {
			setIsValidAddress(false)
		}

		setInputValue(e.target.value)
	}

	// Fetch the owner of the contract; meaning get the returned address of the `owner` method
	// This will use the Tevm client to call the method on the forked chain
	// The caller will be set to the retrieved address in the store if successful, otherwise it will display an error
	// inside a toast
	const handleOwnerFetch = async () => {
		if (!client || !account || !abi || !ownerMethod) {
			toast.info('There was an issue retrieving provider data. Please refresh the page.', {
				action: {
					label: 'Refresh',
					onClick: () => window.location.reload(),
				},
			})
			return
		}

		setFetchingOwner(true)
		const loading = toast.loading('Fetching the owner...')

		const tx = await client.tevmContract({
			from: caller,
			to: account.address,
			functionName: ownerMethod,
			abi,
			args: [],
			value: BigInt(0),
		})

		// Report the result of the retrieval to the user
		if (tx.errors?.length) {
			toast.error(tx.errors[0].name, {
				id: loading,
				description: tx.errors[0].message,
			})
		} else {
			// We can assume the result is an address because that's what we were looking for
			const owner = tx.data

			if (owner && isAddress(owner as Hex)) {
				setCaller(owner as Hex)
				setInputValue(owner as Hex)
				setIsValidAddress(true)

				toast.success('Owner fetched successfully', {
					id: loading,
					description: `Currently impersonating the owner at ${owner}`,
				})
			} else {
				toast.error('Failed to fetch the owner', {
					id: loading,
					description: 'No address was returned',
				})
			}
		}

		setFetchingOwner(false)
	}

	// Reset the current caller to the default value
	const reset = () => {
		setInputValue(DEFAULT_CALLER)
		resetCaller()
		setIsValidAddress(true)
	}

	/* --------------------------------- RENDER --------------------------------- */
	return (
		<div className="mt-2 flex flex-col gap-2">
			<div className="flex w-full items-center gap-4">
				<Separator orientation="vertical" className="h-4" />
				<Label htmlFor="caller" className="text-base font-medium">
					Caller
				</Label>
				<SkipBalanceCheck />
			</div>
			<div className="grid grid-cols-[1fr_min-content] items-center gap-2 sm:flex sm:flex-wrap sm:gap-4">
				<Input
					id="caller"
					type="text"
					className={cn(
						'w-full grow font-mono text-xs sm:w-auto sm:min-w-[250px] sm:text-sm',
						inputValue !== '' && !isValidAddress && 'border-red-500',
					)}
					placeholder="Impersonate calls as..."
					disabled={fetchingOwner}
					value={inputValue}
					onChange={updateCaller}
				/>
				{isTablet ? null : (
					<Button
						size="sm"
						variant="ghost"
						className="text-secondary-foreground flex items-center gap-2"
						onClick={() => navigator.clipboard.readText().then(setInputValue)}
					>
						<Icons.paste className="size-4" /> Paste
					</Button>
				)}
				<TooltipResponsive
					content={
						ownerMethod
							? 'Use the address returned by "owner"'
							: abi
								? 'There was no "owner" method found in the ABI'
								: 'Please select a contract first'
					}
					trigger={
						<Button variant="secondary" size="sm" disabled={fetchingOwner || !ownerMethod} onClick={handleOwnerFetch}>
							{fetchingOwner ? <Icons.loading /> : 'owner'}
						</Button>
					}
				/>
				<Button variant="ghost" size="sm" disabled={fetchingOwner} onClick={reset}>
					default
				</Button>
			</div>
			{isHydrated ? (
				<span className="text-secondary-foreground text-xs font-medium opacity-80 sm:text-sm">
					Currently set to <pre className="inline-block">{caller}</pre>.
				</span>
			) : (
				<div className="text-secondary-foreground flex items-center gap-2 text-sm font-medium opacity-80">
					Currently set to
					<Skeleton className="h-4 w-80" />
				</div>
			)}
		</div>
	)
}

export default CallerSelection

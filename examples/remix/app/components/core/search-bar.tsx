import { useNavigate, useParams } from '@remix-run/react'
import { type FC, useEffect, useState } from 'react'
import { useMedia } from 'react-use'
import { type Address, isAddress } from 'tevm/utils'

import { useConfigStore } from '../../lib/store/use-config'
import { useProviderStore } from '../../lib/store/use-provider'
import type { Chain } from '../../lib/types/providers'
import { cn } from '../../lib/utils'
import { Icons } from '../common/icons'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import ExampleButton from './example'

type SearchBarProps = {
	initialAddress?: string
	hydrating?: boolean
}

/**
 * @notice Search for a contract or an EOA by pasting its address and selecting a chain
 * @dev If it's a contract, this will fetch the abi and retrieve the contract's methods.
 * @dev In any case, this will retrieve and display information about the address.
 * @param initialAddress The researched address, if relevant (not on the home page)
 * @param hydrating Whether the app is still hydrating or not
 */
const SearchBar: FC<SearchBarProps> = ({ initialAddress, hydrating = false }) => {
	/* ---------------------------------- STATE --------------------------------- */
	// The current input value
	const [inputValue, setInputValue] = useState<string>('')
	// Whether the targets's address passes the checksum
	const [isValidAddress, setIsValidAddress] = useState<boolean>(false)

	// Get the account param from the URL
	const params = useParams()
	const accountParam = params.account

	// Initialize input with the URL param if it exists
	useEffect(() => {
		if (accountParam) {
			setInputValue(accountParam)
			setIsValidAddress(isAddress(accountParam))
		}
	}, [accountParam])

	// Expand from tablet breakpoint
	const isTablet = useMedia('(min-width: 640px)') // sm

	// Get the chain, client initialization status
	const { chain, initializing, setProvider } = useProviderStore((state) => ({
		chain: state.chain,
		initializing: state.initializing,
		setProvider: state.setProvider,
	}))

	// Get the fetching status from the store
	const fetchingAccount = useConfigStore((state) => state.fetchingAccount)

	// Navigate to a specific address' page on search
	const navigate = useNavigate()

	/* -------------------------------- HANDLERS -------------------------------- */
	// Update the current account after checking if it's a valid address
	// Let the user know if the address is invalid
	// This will avoid unnecessary requests to the blockchain as well
	const updateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (isAddress(e.target.value)) {
			setIsValidAddress(true)
		} else {
			setIsValidAddress(false)
		}

		setInputValue(e.target.value)
	}

	// Retrieve the state of an account; if called from the example button, this will
	// update the chain and client first, then fetch the account's data
	const handleAccountSearch = async (address?: string, targetChain?: Chain) => {
		// If we're clicking search again on the same address, bail out
		if (accountParam === inputValue && !address) return

		// targetChain means it's called from the example button
		// No need to wait for completion, the loading state will be explicit enough
		setProvider(
			// Either the target chain (example) or the current chain (search)
			targetChain ?? chain,
			// If the example button is clicked and it's already the example contract's page but on the wrong chain,
			// we still want to update the account
			accountParam === address && targetChain?.id !== chain.id ? (address as Address) : undefined,
		)

		// Navigate to the address page
		navigate(`/${address ?? inputValue}`)
	}

	/* --------------------------------- RENDER --------------------------------- */
	return (
		<div className="flex w-full flex-col gap-1">
			<Label htmlFor="target" className="text-md text-secondary-foreground lg:text-lg">
				Search
			</Label>
			<div className="grid grid-cols-[1fr_min-content] items-center gap-2 sm:flex sm:gap-4">
				<Input
					id="target"
					type="text"
					className={cn(
						inputValue !== '' && !isValidAddress && 'border-red-500',
						'grow font-mono text-xs sm:min-w-[250px] sm:text-sm',
					)}
					placeholder={isTablet ? 'Paste the address of an EOA or a contract' : 'Paste an address'}
					disabled={fetchingAccount}
					value={inputValue}
					onChange={updateInput}
				/>
				{isTablet ? null : (
					<Button
						size="sm"
						variant="ghost"
						className="text-secondary-foreground flex items-center gap-2"
						onClick={() => navigator.clipboard.readText().then(setInputValue)}
					>
						<Icons.clipboard className="size-4" /> Paste
					</Button>
				)}
				{initializing || hydrating ? (
					<>
						<div className="h-[36px] w-[238px] animate-pulse bg-muted rounded" />
						<div className="h-[36px] w-[110px] animate-pulse bg-muted rounded" />
					</>
				) : (
					<>
						<ExampleButton handleAccountSearch={handleAccountSearch} />
						<Button
							size={isTablet ? 'default' : 'sm'}
							disabled={!isValidAddress || fetchingAccount}
							onClick={() => handleAccountSearch()}
						>
							Search
						</Button>
					</>
				)}
			</div>
			{!isValidAddress && inputValue !== '' ? (
				<span className="text-secondary-foreground text-sm font-medium">Invalid address</span>
			) : null}
		</div>
	)
}

export default SearchBar

import { useConfigStore } from '../../lib/store/use-config'
import { useProviderStore } from '../../lib/store/use-provider'
import CurrencyAmount from '../common/currency-amount'
import { Icons } from '../common/icons'
import ShrinkedAddress from '../common/shrinked-address'
import TooltipResponsive from '../common/tooltip-responsive'
import { Badge } from '../ui/badge'

/**
 * @notice The state of the current account
 * @dev This will display the data about the current account.
 * @dev This will be updated after searching for an address or making a call.
 */
const AccountState = () => {
	/* ---------------------------------- STATE --------------------------------- */
	const chain = useProviderStore((state) => state.chain)

	// Whether the client is initializing
	const initializing = useProviderStore((state) => state.initializing)

	const { account, fetchingAccount } = useConfigStore((state) => ({
		account: state.account,
		fetchingAccount: state.fetchingAccount,
	}))

	const loading = initializing || fetchingAccount

	/* --------------------------------- RENDER --------------------------------- */
	if (!account && !fetchingAccount) return null

	// We know that if account is undefined but loading is true, the components
	// accessing account will be rendered as skeletons; if it's false, this won't be rendered at all
	return (
		<div className="grid grid-cols-[min-content_min-content] items-center gap-x-8 gap-y-2 text-sm sm:text-base">
			<div className="flex items-center gap-2">
				<span className="text-sm text-gray-500">
					{!account || account.isEmpty ? 'Account' : account.isContract ? 'Contract' : 'EOA'}
				</span>
				{account?.errors && account.errors.length > 0 ? (
					<TooltipResponsive content={account.errors[0].message}>
						<Icons.error className="h-4 w-4 text-destructive" />
					</TooltipResponsive>
				) : null}
			</div>
			{loading || !account ? (
				<div className="h-6 w-24 animate-pulse bg-muted rounded" />
			) : (
				<div className="flex items-center gap-4">
					<ShrinkedAddress address={account.address} withCopy />
					{account.isEmpty ? (
						<TooltipResponsive content="This account has never been initialized (0 balance, 0 nonce, no deployed bytecode)">
							<Badge variant="secondary" className="whitespace-nowrap">
								not initialized
							</Badge>
						</TooltipResponsive>
					) : null}
				</div>
			)}
			<span className="text-sm text-gray-500">Balance</span>
			{loading || !account ? (
				<div className="h-6 w-24 animate-pulse bg-muted rounded" />
			) : (
				<CurrencyAmount
					amount={account?.balance}
					currency={chain.nativeCurrency.symbol}
					decimals={chain.nativeCurrency.decimals}
				/>
			)}
			{!account?.isContract && !account?.isEmpty ? (
				<>
					<span className="flex items-center gap-2 text-sm whitespace-nowrap text-gray-500">
						Transactions
						<TooltipResponsive content="The number of transactions sent from this account on this chain">
							<Icons.info className="h-4 w-4 text-muted-foreground" />
						</TooltipResponsive>
					</span>
					{loading || !account ? (
						<div className="h-6 w-24 animate-pulse bg-muted rounded" />
					) : (
						<span>{account.nonce.toString()}</span>
					)}
				</>
			) : null}
		</div>
	)
}

export default AccountState

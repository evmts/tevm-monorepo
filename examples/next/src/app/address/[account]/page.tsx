'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { type Address, isAddress } from 'tevm/utils'
import AccountState from '@/components/core/account-state'
import { Separator } from '@/components/ui/separator'
import { useConfigStore } from '@/lib/store/use-config'
import { useProviderStore } from '@/lib/store/use-provider'

// Import dynamically to avoid SSR issues due to persisted state (see zustand stores)
const Header = dynamic(() => import('@/components/core/header'))
const Interact = dynamic(() => import('@/components/core/interact'))
const TxHistory = dynamic(() => import('@/components/core/tx-history'))

/**
 * @notice An account page, where the user can interact with the contract/EOA
 * @dev This should be displayed after searching for an account, or clicking on a link
 * (or obviously if directly writing the address in the URL)
 */
export default function AccountPage({ params }: { params: { account: string } }) {
	// The chain and corresponding client
	const { chain, client } = useProviderStore((state) => ({
		chain: state.chain,
		client: state.client,
	}))

	// The current account and the function to update it
	const { account, updateAccount } = useConfigStore((state) => ({
		account: state.account,
		updateAccount: state.updateAccount,
	}))

	// Update the account if the address in the URL changes (on search, reload, or navigation)
	useEffect(() => {
		if (client && account && isAddress(params.account) && account.address !== params.account)
			updateAccount(params.account as Address, {
				updateAbi: true,
				chain,
				client,
			})
	}, [params.account, account, chain, client, updateAccount])

	return (
		<div className="flex grow flex-col gap-4">
			<Header initialAddress={params.account} />
			<AccountState />
			<Interact />

			<Separator className="my-4" />
			<div className="-my-2 h-0 grow" />
			<TxHistory />
		</div>
	)
}

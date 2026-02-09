import { defineConfig, EntryKitProvider, useSessionClient } from '@latticexyz/entrykit/internal'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionClient } from '@tevm/mud'
import { OptimisticWrapperProvider } from '@tevm/mud/react'
import { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { useClient, WagmiProvider } from 'wagmi'
import { chainId, getWorldAddress, startBlock } from './common'
import { stash } from './mud/stash'
import { wagmiConfig } from './wagmiConfig'

const queryClient = new QueryClient()

export type Props = {
	children: ReactNode
}

function OptimisticEntryKitProvider({ children }: { children: ReactNode }) {
	const worldAddress = getWorldAddress()
	const publicClient = useClient()
	const { data: sessionClient } = useSessionClient()

	return (
		<OptimisticWrapperProvider
			stash={stash}
			storeAddress={worldAddress}
			client={(sessionClient as unknown as SessionClient | undefined) ?? publicClient}
			sync={{ startBlock }}
			loggingLevel="debug"
		>
			{/* @ts-expect-error - react versions mismatch */}
			{children}
		</OptimisticWrapperProvider>
	)
}

export function Providers({ children }: Props) {
	const worldAddress = getWorldAddress()

	return (
		<WagmiProvider config={wagmiConfig}>
			<QueryClientProvider client={queryClient}>
				<EntryKitProvider config={defineConfig({ chainId, worldAddress })}>
					<OptimisticEntryKitProvider>
						<Toaster />
						{children}
					</OptimisticEntryKitProvider>
				</EntryKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	)
}

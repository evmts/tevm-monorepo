import type { StoreConfig } from '@latticexyz/stash/internal'
import { SyncProvider } from '@latticexyz/store-sync/react'
import React, { createContext, useContext, useEffect, type ReactNode } from 'react'
import type { Client } from 'viem'
import {
	type CreateOptimisticHandlerOptions,
	type CreateOptimisticHandlerResult,
	createOptimisticHandler,
} from '../createOptimisticHandler.js'
import type { SessionClient } from '../types.js'

interface OptimisticWrapperContextType<TConfig extends StoreConfig> extends CreateOptimisticHandlerResult<TConfig> {}
const OptimisticWrapperContext = createContext<OptimisticWrapperContextType<StoreConfig> | undefined>(undefined)

interface OptimisticWrapperProviderProps<TConfig extends StoreConfig> extends CreateOptimisticHandlerOptions<TConfig> {
	children: ReactNode
}

// Create a global registry for handlers by key
// We need to do that work now as otherwise we get both multiple writeContract wrappers (next one will wrap the previous wrapper itself) and multiple txPool subscriptions
// that apply the same txs inconsistently
// This is awful and obviously needs to be fixed as soon as there is a better solution
const handlerRegistry = new WeakMap<Client | SessionClient, CreateOptimisticHandlerResult<any>>()

/**
 * Provider component that initializes the optimistic handler and makes its utilities available
 * to child components via the OptimisticWrapperContext.
 */
export const OptimisticWrapperProvider: React.FC<OptimisticWrapperProviderProps<StoreConfig>> = ({
	children,
	...options
}) => {
	const { client, storeAddress, stash, sync, config, loggingLevel } = options

	// Get or create handler from registry
	let handlerResult = handlerRegistry.get(client)
	if (!handlerResult) {
		handlerResult = createOptimisticHandler({ client, storeAddress, stash, sync, config, loggingLevel })
		handlerRegistry.set(client, handlerResult)
	}

	useEffect(() => {
		return () => {
			handlerResult._.cleanup().catch(console.error)
		}
	}, [])

	if (sync && (sync.enabled === undefined || (sync.enabled && client.chain))) {
		return (
			<OptimisticWrapperContext.Provider value={handlerResult}>
				<SyncProvider
					chainId={client.chain!.id}
					address={storeAddress}
					startBlock={sync.startBlock ?? 0n}
					adapter={handlerResult.syncAdapter}
				>
					{children}
				</SyncProvider>
			</OptimisticWrapperContext.Provider>
		)
	}

	return <OptimisticWrapperContext.Provider value={handlerResult}>{children}</OptimisticWrapperContext.Provider>
}

/**
 * Custom hook to access the optimistic handler utilities from the OptimisticContext.
 */
export const useOptimisticWrapper = <TConfig extends StoreConfig>(): OptimisticWrapperContextType<TConfig> => {
	const context = useContext(OptimisticWrapperContext) as OptimisticWrapperContextType<TConfig>
	return context
}

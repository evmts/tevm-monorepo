import type { StoreConfig } from '@latticexyz/stash/internal'
import { SyncProvider } from '@latticexyz/store-sync/react';
import React, { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import {
	type CreateOptimisticHandlerOptions,
	type CreateOptimisticHandlerResult,
	createOptimisticHandler,
} from '../createOptimisticHandler.js'

interface OptimisticWrapperContextType<TConfig extends StoreConfig> extends CreateOptimisticHandlerResult<TConfig> {}
const OptimisticWrapperContext = createContext<OptimisticWrapperContextType<StoreConfig> | undefined>(undefined)
interface OptimisticWrapperProviderProps<TConfig extends StoreConfig>
	extends Omit<CreateOptimisticHandlerOptions<TConfig>, 'sync'> {
	sync?: CreateOptimisticHandlerOptions<TConfig>['sync'] & {
		chainId?: number // add the chainId so we can start the sync even if the client is not yet defined
	} | undefined
	children: ReactNode
}

/**
 * Provider component that initializes the optimistic handler and makes its utilities available
 * to child components via the OptimisticWrapperContext.
 */
export const OptimisticWrapperProvider: React.FC<OptimisticWrapperProviderProps<StoreConfig>> = ({
	children,
	...options
}) => {
	const { client, storeAddress, stash, sync, config, loggingLevel } = options
	const handlerResult = useMemo(
		() => createOptimisticHandler({ client, storeAddress, stash, sync, config, loggingLevel }),
		[client, storeAddress, stash, sync, config, loggingLevel],
	)

	useEffect(() => {
		return () => {
			if (handlerResult) handlerResult._.cleanup()
		}
	}, [handlerResult])

	if (sync && (sync.enabled === undefined || sync.enabled && client.chain)) { // we already error if the client is not connected to a chain
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
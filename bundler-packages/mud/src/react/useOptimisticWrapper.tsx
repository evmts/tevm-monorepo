import type { StoreConfig } from '@latticexyz/stash/internal'
import React, { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import type { Client } from 'viem'
import {
	type CreateOptimisticHandlerOptions,
	type CreateOptimisticHandlerResult,
	createOptimisticHandler,
} from '../createOptimisticHandler.js'
import type { SessionClient } from '../types.js'

interface OptimisticWrapperContextType<TConfig extends StoreConfig> extends CreateOptimisticHandlerResult<TConfig> {}
const OptimisticWrapperContext = createContext<OptimisticWrapperContextType<StoreConfig> | undefined>(undefined)
interface OptimisticWrapperProviderProps<TConfig extends StoreConfig>
	extends Omit<CreateOptimisticHandlerOptions<TConfig>, 'client'> {
	client?: Client | SessionClient
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
	const { client, storeAddress, stash, config } = options
	const handlerResult = useMemo(
		() => (isClientDefined(client) ? createOptimisticHandler({ client, storeAddress, stash, config }) : undefined),
		[client, storeAddress, stash, config],
	)

	useEffect(() => {
		return () => {
			if (handlerResult) handlerResult._.cleanup()
		}
	}, [handlerResult])

	return <OptimisticWrapperContext.Provider value={handlerResult}>{children}</OptimisticWrapperContext.Provider>
}

/**
 * Custom hook to access the optimistic handler utilities from the OptimisticContext.
 */
export const useOptimisticWrapper = <TConfig extends StoreConfig>():
	| OptimisticWrapperContextType<TConfig>
	| undefined => {
	const context = useContext(OptimisticWrapperContext) as OptimisticWrapperContextType<TConfig> | undefined
	return context
}

const isClientDefined = (client: Client | SessionClient | undefined): client is Client | SessionClient =>
	client !== undefined

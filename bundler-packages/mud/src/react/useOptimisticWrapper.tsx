import type { StoreConfig } from '@latticexyz/stash/internal'
import React, { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import {
	type CreateOptimisticHandlerOptions,
	type CreateOptimisticHandlerResult,
	createOptimisticHandler,
} from '../createOptimisticHandler.js'

interface OptimisticWrapperContextType<TConfig extends StoreConfig> extends CreateOptimisticHandlerResult<TConfig> {}
const OptimisticWrapperContext = createContext<OptimisticWrapperContextType<StoreConfig> | undefined>(undefined)
interface OptimisticWrapperProviderProps<TConfig extends StoreConfig> extends CreateOptimisticHandlerOptions<TConfig> {
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
	const handlerResult = useMemo(() => createOptimisticHandler(options), [client, storeAddress, stash, config])

	useEffect(() => {
		return () => {
			handlerResult._.cleanup()
		}
	}, [handlerResult])

	return <OptimisticWrapperContext.Provider value={handlerResult}>{children}</OptimisticWrapperContext.Provider>
}

/**
 * Custom hook to access the optimistic handler utilities from the OptimisticContext.
 */
export const useOptimisticWrapper = <TConfig extends StoreConfig>(): OptimisticWrapperContextType<TConfig> => {
	const context = useContext(OptimisticWrapperContext) as OptimisticWrapperContextType<TConfig>
	console.log("useOptimisticWrapper", context?._?.optimisticClient.uid)
	if (context === undefined) throw new Error('useOptimisticWrapper must be used within an OptimisticWrapperProvider')
	return context
}

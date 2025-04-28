import { Context, Effect, Layer } from 'effect'
import * as Filter from 'ox/execution/filter'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Ox Filter
 */
export type FilterEffect = Filter.Filter

/**
 * Ox Filter effect service interface
 */
export interface FilterEffectService {
	/**
	 * Create a filter with Effect
	 */
	createFilterEffect(
		params: Filter.CreateFilterParams,
	): Effect.Effect<Filter.Filter, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Get filter changes with Effect
	 */
	getFilterChangesEffect(
		filterId: string,
	): Effect.Effect<Filter.FilterChanges, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Uninstall a filter with Effect
	 */
	uninstallFilterEffect(filterId: string): Effect.Effect<boolean, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Get filter logs with Effect
	 */
	getFilterLogsEffect(filterId: string): Effect.Effect<Filter.Log[], BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for FilterEffectService dependency injection
 */
export const FilterEffectTag = Context.Tag<FilterEffectService>('@tevm/ox/FilterEffect')

/**
 * Catch Ox errors and convert them to BaseErrorEffect
 */
function catchOxErrors<A>(
	effect: Effect.Effect<A, unknown, never>,
): Effect.Effect<A, BaseErrorEffect<Error | undefined>, never> {
	return Effect.catchAll(effect, (error) => {
		if (error instanceof Error) {
			return Effect.fail(new BaseErrorEffect(error.message, { cause: error }))
		}
		return Effect.fail(new BaseErrorEffect('Unknown error', { cause: error instanceof Error ? error : undefined }))
	})
}

/**
 * Live implementation of FilterEffectService
 */
export const FilterEffectLive: FilterEffectService = {
	createFilterEffect: (params) => catchOxErrors(Effect.try(() => Filter.createFilter(params))),

	getFilterChangesEffect: (filterId) => catchOxErrors(Effect.try(() => Filter.getFilterChanges(filterId))),

	uninstallFilterEffect: (filterId) => catchOxErrors(Effect.try(() => Filter.uninstallFilter(filterId))),

	getFilterLogsEffect: (filterId) => catchOxErrors(Effect.try(() => Filter.getFilterLogs(filterId))),
}

/**
 * Layer that provides the FilterEffectService implementation
 */
export const FilterEffectLayer = Layer.succeed(FilterEffectTag, FilterEffectLive)

import { Effect } from 'effect'
import Ox from 'ox'

// Re-export types
export type Filter = Ox.Filter.Filter
export type CreateFilterParams = Ox.Filter.CreateFilterParams
export type FilterChanges = Ox.Filter.FilterChanges
export type Log = Ox.Filter.Log

/**
 * Error thrown when creating a filter
 */
export class CreateFilterError extends Error {
	override name = 'CreateFilterError'
	_tag = 'CreateFilterError'
	constructor(cause: Ox.Filter.createFilter.ErrorType) {
		super('Unexpected error creating filter with ox', {
			cause,
		})
	}
}

/**
 * Creates a filter
 *
 * @param params - The parameters to create the filter with
 * @returns The created filter
 *
 * @example
 * ```ts
 * import { Effect } from 'effect'
 * import * as Filter from '@tevm/ox/filter'
 *
 * const params = {
 *   fromBlock: 'latest',
 *   toBlock: 'latest',
 *   address: '0x1234567890123456789012345678901234567890',
 * }
 *
 * const program = Filter.createFilter(params)
 * const filter = await Effect.runPromise(program)
 * // filter.id can be used for subsequent operations
 * ```
 */
export function createFilter(params: CreateFilterParams): Effect.Effect<Filter, CreateFilterError, never> {
	return Effect.try({
		try: () => Ox.Filter.createFilter(params),
		catch: (cause) => new CreateFilterError(cause as Ox.Filter.createFilter.ErrorType),
	})
}

/**
 * Error thrown when getting filter changes
 */
export class GetFilterChangesError extends Error {
	override name = 'GetFilterChangesError'
	_tag = 'GetFilterChangesError'
	constructor(cause: Ox.Filter.getFilterChanges.ErrorType) {
		super('Unexpected error getting filter changes with ox', {
			cause,
		})
	}
}

/**
 * Gets the changes since the last poll for a given filter
 *
 * @param filterId - The ID of the filter to get changes for
 * @returns The filter changes
 *
 * @example
 * ```ts
 * import { Effect } from 'effect'
 * import * as Filter from '@tevm/ox/filter'
 *
 * // First create a filter
 * const filterProgram = Filter.createFilter({
 *   fromBlock: 'latest',
 *   toBlock: 'latest',
 *   address: '0x1234567890123456789012345678901234567890',
 * })
 * const filter = await Effect.runPromise(filterProgram)
 *
 * // Then get filter changes
 * const changesProgram = Filter.getFilterChanges(filter.id)
 * const changes = await Effect.runPromise(changesProgram)
 * // changes will contain an array of logs that match the filter
 * ```
 */
export function getFilterChanges(filterId: string): Effect.Effect<FilterChanges, GetFilterChangesError, never> {
	return Effect.try({
		try: () => Ox.Filter.getFilterChanges(filterId),
		catch: (cause) => new GetFilterChangesError(cause as Ox.Filter.getFilterChanges.ErrorType),
	})
}

/**
 * Error thrown when uninstalling a filter
 */
export class UninstallFilterError extends Error {
	override name = 'UninstallFilterError'
	_tag = 'UninstallFilterError'
	constructor(cause: Ox.Filter.uninstallFilter.ErrorType) {
		super('Unexpected error uninstalling filter with ox', {
			cause,
		})
	}
}

/**
 * Uninstalls a filter
 *
 * @param filterId - The ID of the filter to uninstall
 * @returns A boolean indicating if the filter was successfully uninstalled
 *
 * @example
 * ```ts
 * import { Effect } from 'effect'
 * import * as Filter from '@tevm/ox/filter'
 *
 * // First create a filter
 * const filterProgram = Filter.createFilter({
 *   fromBlock: 'latest',
 *   toBlock: 'latest',
 *   address: '0x1234567890123456789012345678901234567890',
 * })
 * const filter = await Effect.runPromise(filterProgram)
 *
 * // Then uninstall the filter when done
 * const uninstallProgram = Filter.uninstallFilter(filter.id)
 * const success = await Effect.runPromise(uninstallProgram)
 * // success will be true if the filter was uninstalled successfully
 * ```
 */
export function uninstallFilter(filterId: string): Effect.Effect<boolean, UninstallFilterError, never> {
	return Effect.try({
		try: () => Ox.Filter.uninstallFilter(filterId),
		catch: (cause) => new UninstallFilterError(cause as Ox.Filter.uninstallFilter.ErrorType),
	})
}

/**
 * Error thrown when getting filter logs
 */
export class GetFilterLogsError extends Error {
	override name = 'GetFilterLogsError'
	_tag = 'GetFilterLogsError'
	constructor(cause: Ox.Filter.getFilterLogs.ErrorType) {
		super('Unexpected error getting filter logs with ox', {
			cause,
		})
	}
}

/**
 * Gets the logs for a given filter
 *
 * @param filterId - The ID of the filter to get logs for
 * @returns The filter logs
 *
 * @example
 * ```ts
 * import { Effect } from 'effect'
 * import * as Filter from '@tevm/ox/filter'
 *
 * // First create a filter
 * const filterProgram = Filter.createFilter({
 *   fromBlock: 'latest',
 *   toBlock: 'latest',
 *   address: '0x1234567890123456789012345678901234567890',
 * })
 * const filter = await Effect.runPromise(filterProgram)
 *
 * // Then get all logs for the filter
 * const logsProgram = Filter.getFilterLogs(filter.id)
 * const logs = await Effect.runPromise(logsProgram)
 * // logs will contain all logs that match the filter
 * ```
 */
export function getFilterLogs(filterId: string): Effect.Effect<Log[], GetFilterLogsError, never> {
	return Effect.try({
		try: () => Ox.Filter.getFilterLogs(filterId),
		catch: (cause) => new GetFilterLogsError(cause as Ox.Filter.getFilterLogs.ErrorType),
	})
}

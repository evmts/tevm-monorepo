import { Effect } from 'effect'
import Ox from 'ox'

// Export types
export type Filter = Ox.Filter.Filter
export type FilterChanges = Ox.Filter.FilterChanges
export type CreateFilterParams = Ox.Filter.CreateFilterParams
export type Log = Ox.Filter.Log

/**
 * Error class for createFilter function
 */
export class CreateFilterError extends Error {
	override name = 'CreateFilterError'
	_tag = 'CreateFilterError'
	constructor(cause: unknown) {
		super('Failed to create filter with ox', {
			cause,
		})
	}
}

/**
 * Creates a new filter
 * @param params Parameters for creating the filter
 * @returns An Effect that succeeds with a Filter
 */
export function createFilter(params: CreateFilterParams): Effect.Effect<Filter, CreateFilterError, never> {
	return Effect.try({
		try: () => Ox.Filter.createFilter(params),
		catch: (cause) => new CreateFilterError(cause),
	})
}

/**
 * Error class for getFilterChanges function
 */
export class GetFilterChangesError extends Error {
	override name = 'GetFilterChangesError'
	_tag = 'GetFilterChangesError'
	constructor(cause: unknown) {
		super('Failed to get filter changes with ox', {
			cause,
		})
	}
}

/**
 * Gets changes from a filter since the last poll
 * @param filterId The ID of the filter to get changes for
 * @returns An Effect that succeeds with filter changes
 */
export function getFilterChanges(filterId: string): Effect.Effect<FilterChanges, GetFilterChangesError, never> {
	return Effect.try({
		try: () => Ox.Filter.getFilterChanges(filterId),
		catch: (cause) => new GetFilterChangesError(cause),
	})
}

/**
 * Error class for uninstallFilter function
 */
export class UninstallFilterError extends Error {
	override name = 'UninstallFilterError'
	_tag = 'UninstallFilterError'
	constructor(cause: unknown) {
		super('Failed to uninstall filter with ox', {
			cause,
		})
	}
}

/**
 * Uninstalls a filter
 * @param filterId The ID of the filter to uninstall
 * @returns An Effect that succeeds with a boolean indicating success
 */
export function uninstallFilter(filterId: string): Effect.Effect<boolean, UninstallFilterError, never> {
	return Effect.try({
		try: () => Ox.Filter.uninstallFilter(filterId),
		catch: (cause) => new UninstallFilterError(cause),
	})
}

/**
 * Error class for getFilterLogs function
 */
export class GetFilterLogsError extends Error {
	override name = 'GetFilterLogsError'
	_tag = 'GetFilterLogsError'
	constructor(cause: unknown) {
		super('Failed to get filter logs with ox', {
			cause,
		})
	}
}

/**
 * Gets all logs matching the filter
 * @param filterId The ID of the filter to get logs for
 * @returns An Effect that succeeds with an array of logs
 */
export function getFilterLogs(filterId: string): Effect.Effect<Log[], GetFilterLogsError, never> {
	return Effect.try({
		try: () => Ox.Filter.getFilterLogs(filterId),
		catch: (cause) => new GetFilterLogsError(cause),
	})
}

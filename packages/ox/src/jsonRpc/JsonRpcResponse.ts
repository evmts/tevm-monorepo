import { Effect } from 'effect'
import Ox from 'ox'

// Export the core types
export type JsonRpcResponse = Ox.JsonRpcResponse.JsonRpcResponse
export type JsonRpcError = Ox.JsonRpcResponse.JsonRpcError
export type CreateResponseParams = Ox.JsonRpcResponse.CreateResponseParams

/**
 * Error class for createResponse function
 */
export class CreateResponseError extends Error {
	override name = 'CreateResponseError'
	_tag = 'CreateResponseError'
	constructor(cause: unknown) {
		super('Unexpected error creating JSON-RPC response with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Create a JSON-RPC response
 */
export function createResponse(
	params: CreateResponseParams,
): Effect.Effect<JsonRpcResponse, CreateResponseError, never> {
	return Effect.try({
		try: () => Ox.JsonRpcResponse.createResponse(params),
		catch: (cause) => new CreateResponseError(cause),
	})
}

/**
 * Error class for parseResponse function
 */
export class ParseResponseError extends Error {
	override name = 'ParseResponseError'
	_tag = 'ParseResponseError'
	constructor(cause: unknown) {
		super('Unexpected error parsing JSON-RPC response with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Parse a JSON-RPC response
 */
export function parseResponse(response: string): Effect.Effect<JsonRpcResponse, ParseResponseError, never> {
	return Effect.try({
		try: () => Ox.JsonRpcResponse.parseResponse(response),
		catch: (cause) => new ParseResponseError(cause),
	})
}

/**
 * Error class for validateResponse function
 */
export class ValidateResponseError extends Error {
	override name = 'ValidateResponseError'
	_tag = 'ValidateResponseError'
	constructor(cause: unknown) {
		super('Unexpected error validating JSON-RPC response with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Validate a JSON-RPC response
 */
export function validateResponse(response: JsonRpcResponse): Effect.Effect<boolean, ValidateResponseError, never> {
	return Effect.try({
		try: () => Ox.JsonRpcResponse.validateResponse(response),
		catch: (cause) => new ValidateResponseError(cause),
	})
}

/**
 * Error class for getResponseResult function
 */
export class GetResponseResultError extends Error {
	override name = 'GetResponseResultError'
	_tag = 'GetResponseResultError'
	constructor(cause: unknown) {
		super('Unexpected error getting JSON-RPC response result with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Get response result
 */
export function getResponseResult(response: JsonRpcResponse): Effect.Effect<unknown, GetResponseResultError, never> {
	return Effect.try({
		try: () => Ox.JsonRpcResponse.getResponseResult(response),
		catch: (cause) => new GetResponseResultError(cause),
	})
}

/**
 * Error class for getResponseError function
 */
export class GetResponseErrorError extends Error {
	override name = 'GetResponseErrorError'
	_tag = 'GetResponseErrorError'
	constructor(cause: unknown) {
		super('Unexpected error getting JSON-RPC response error with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Get response error
 */
export function getResponseError(
	response: JsonRpcResponse,
): Effect.Effect<JsonRpcError | undefined, GetResponseErrorError, never> {
	return Effect.try({
		try: () => Ox.JsonRpcResponse.getResponseError(response),
		catch: (cause) => new GetResponseErrorError(cause),
	})
}

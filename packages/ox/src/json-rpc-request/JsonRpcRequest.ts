import { Effect } from 'effect'
import Ox from 'ox'

// Export core types
export type Request<TMethod extends string = string, TParams = unknown> = Ox.JsonRpcRequest.Request<TMethod, TParams>
export type Params = Ox.JsonRpcRequest.Params
export type Batch = Ox.JsonRpcRequest.Batch

/**
 * Error class for create function
 */
export class CreateError extends Error {
	override name = 'CreateError'
	_tag = 'CreateError'
	constructor(cause: unknown) {
		super('Unexpected error creating JSON-RPC request with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Creates a JSON-RPC request
 *
 * @param request - The request parameters
 * @returns Effect wrapping the created JSON-RPC request
 */
export function create<TMethod extends string, TParams extends Params>(request: {
	method: TMethod
	params?: TParams
	id?: number | string
	jsonrpc?: string
}): Effect.Effect<Request<TMethod, TParams>, CreateError, never> {
	return Effect.try({
		try: () => Ox.JsonRpcRequest.create(request),
		catch: (cause) => new CreateError(cause),
	})
}

/**
 * Error class for createBatch function
 */
export class CreateBatchError extends Error {
	override name = 'CreateBatchError'
	_tag = 'CreateBatchError'
	constructor(cause: unknown) {
		super('Unexpected error creating JSON-RPC request batch with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Creates a batch of JSON-RPC requests
 *
 * @param requests - Array of request parameters
 * @returns Effect wrapping the created JSON-RPC request batch
 */
export function createBatch<
	TRequests extends ReadonlyArray<{
		method: string
		params?: Params
		id?: number | string
		jsonrpc?: string
	}>,
>(requests: [...TRequests]): Effect.Effect<Batch, CreateBatchError, never> {
	return Effect.try({
		try: () => Ox.JsonRpcRequest.createBatch(requests),
		catch: (cause) => new CreateBatchError(cause),
	})
}

/**
 * Error class for validate function
 */
export class ValidateError extends Error {
	override name = 'ValidateError'
	_tag = 'ValidateError'
	constructor(cause: unknown) {
		super('Unexpected error validating JSON-RPC request with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Validates a JSON-RPC request
 *
 * @param request - The request to validate
 * @returns Effect wrapping the validated request
 */
export function validate<TMethod extends string, TParams extends Params>(
	request: Request<TMethod, TParams>,
): Effect.Effect<Request<TMethod, TParams>, ValidateError, never> {
	return Effect.try({
		try: () => Ox.JsonRpcRequest.validate(request),
		catch: (cause) => new ValidateError(cause),
	})
}

/**
 * Error class for validateBatch function
 */
export class ValidateBatchError extends Error {
	override name = 'ValidateBatchError'
	_tag = 'ValidateBatchError'
	constructor(cause: unknown) {
		super('Unexpected error validating JSON-RPC request batch with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Validates a batch of JSON-RPC requests
 *
 * @param batch - The batch to validate
 * @returns Effect wrapping the validated batch
 */
export function validateBatch(batch: Batch): Effect.Effect<Batch, ValidateBatchError, never> {
	return Effect.try({
		try: () => Ox.JsonRpcRequest.validateBatch(batch),
		catch: (cause) => new ValidateBatchError(cause),
	})
}

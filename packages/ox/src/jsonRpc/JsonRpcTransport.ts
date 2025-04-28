import { Effect } from 'effect'
import Ox from 'ox'

// Export main types
export type RpcTransport = Ox.RpcTransport.RpcTransport
export type RpcTransportHandler = Ox.RpcTransport.RpcTransportHandler

// Error classes for JsonRpcTransport functions
export class FromHttpError extends Error {
	override name = 'FromHttpError'
	_tag = 'FromHttpError'
	constructor(cause: unknown) {
		super('Error creating HTTP JSON-RPC transport with ox', { cause })
	}
}

export class CreateError extends Error {
	override name = 'CreateError'
	_tag = 'CreateError'
	constructor(cause: unknown) {
		super('Error creating custom JSON-RPC transport with ox', { cause })
	}
}

/**
 * Creates an HTTP JSON-RPC Transport from a URL
 */
export function fromHttp(url: string | URL): Effect.Effect<RpcTransport, FromHttpError, never> {
	return Effect.try({
		try: () => Ox.RpcTransport.fromHttp(url),
		catch: (cause) => new FromHttpError(cause),
	})
}

/**
 * Creates a custom JSON-RPC Transport using a custom request handler
 */
export function create(handler: RpcTransportHandler): Effect.Effect<RpcTransport, CreateError, never> {
	return Effect.try({
		try: () => Ox.RpcTransport.create(handler),
		catch: (cause) => new CreateError(cause),
	})
}

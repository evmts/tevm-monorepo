import type { TevmClient } from '@tevm/client-types'

/**
 * A remote Tevm client for talking to a Tevm backend over HTTP JSON-RPC
 * Implements the tevm interface so interacting with it is the same api
 * as interacting with a `MemoryTevm` instance directly
 * @see {@link TevmClient}
 * @example
 * ```typescript
 * import { TevmClient, createTevmClient } from "tevm/client";
 */
export type HttpClient = TevmClient & {
	/**
	 * The url being used to connect to the remote Tevm backend
	 */
	url: string
	/**
	 * Name of the client
	 */
	name: string
}

import { tevmViemExtension } from '@tevm/viem'
import { createClient, http, publicActions, testActions } from 'viem'

/**
 * Creates a remote tevm client for interacting with an http server
 * over HTTP.
 * @param {import('./HttpClientOptions.js').HttpClientOptions} params
 * @example
 * ```typescript
 * import { createHttpClient } from '@tevm/client'
 *
 * const client = createHttpClient({ url: 'http://localhost:8080' })
 *
 * const chainId = await client.eth.getChainId()
 * const account = await client.eth.getAccount({
 *   address: '0x420234...'
 * })
 * ```
 * @see {@link https://todo.todo.todo createServer} - for creating a tevm server
 * @see {@link https://todo.todo.todo httpHandler} - for an http handler that can be used in Next.js or anything that supports HTTP handler api
 */
export const createHttpClient = ({ url }) => {
	const httpClient = createClient({
		name: `TevmRemoteClient:${url}`,
		transport: http(url),
	})
		.extend(publicActions)
		.extend(tevmViemExtension())
		.extend(testActions({ mode: 'hardhat' }))

	return httpClient
}

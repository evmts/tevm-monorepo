import { tevmViemExtension } from '@tevm/viem'
import { createPublicClient, http } from 'viem'

/**
 * Creates a remote tevm client for interacting with an http server
 * over HTTP.
 * @param {import('./ClientOptions.js').ClientOptions} params
 * @returns {import('./TevmClient.js').TevmClient}
 * @example
 * ```typescript
 * import { createTevmClient } from '@tevm/client'
 *
 * const client = createTevmClient({ url: 'http://localhost:8080' })
 *
 * const chainId = await client.eth.getChainId()
 * const account = await client.eth.getAccount({
 *   address: '0x420234...'
 * })
 * ```
 * @see {@link https://todo.todo.todo createServer} - for creating a tevm server
 * @see {@link https://todo.todo.todo httpHandler} - for an http handler that can be used in Next.js or anything that supports HTTP handler api
 */
export const createTevmClient = ({ url, name = `TevmClient:${url}` }) => {
	// This is a shortcut. We are simply reusing viem to create this client so we can
	// reuse all of viems transport related error handling. We should implement a client
	// using only `@tevm/jsonrpc` package to make requests once it is as robust as viem
	const { tevm } = createPublicClient({
		name: `TevmRemoteClient:${url}`,
		transport: http(url),
	}).extend(tevmViemExtension())
	return {
		...tevm,
		url,
		name,
	}
}

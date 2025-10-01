import { tevmViemExtension } from '@tevm/viem'
import { createPublicClient, http } from 'viem'

/**
 * @deprecated a new version of HttpClient will be built in a future version
 * For now we suggest you use viem
 * @param {import('./HttpClientOptions.js').HttpClientOptions} params
 * @returns {import('./HttpClient.js').HttpClient}
 * @example
 */
export const createHttpClient = ({ url, name = `TevmClient:${url}` }) => {
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

import { tevmViemExtension } from '@tevm/viem'
import { createPublicClient, http } from 'viem'

/**
 * @param {{url: string}} params
 */
export const createRemoteClient = ({ url }) => {
	const client = createPublicClient({
		name: `TevmRemoteClient:${url}`,
		transport: http(url),
	})
	return client.extend(tevmViemExtension())
}

/**
 * @typedef {ReturnType<typeof createRemoteClient>} RemoteClient
 */

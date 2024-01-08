import { createTevm } from '@tevm/vm'
import { createPublicClient, http } from 'viem'

/**
 * @param {import('@tevm/vm').CreateEVMOptions & {fork: {url: string}}} params
 */
export const createMemoryClient = async (params) => {
	const tevm = await createTevm(params)
	const client = createPublicClient({
		name: `TevmMemoryClient:${tevm.forkUrl}`,
		transport: http(tevm.forkUrl),
	})
	return client.extend(() => {
		return { tevm }
	})
}

/**
 * @typedef {Awaited<ReturnType<typeof createMemoryClient>>} MemoryClient
 */

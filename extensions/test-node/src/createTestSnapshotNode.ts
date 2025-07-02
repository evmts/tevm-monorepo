import { type TevmNode } from '@tevm/node'
import { createTestSnapshotClient } from './createTestSnapshotClient.js'
import type { TestSnapshotNode, TestSnapshotNodeOptions } from './types.js'

/**
 * Creates a test snapshot node that automatically caches RPC responses
 *
 * @param options - Configuration options for the node
 * @returns A test snapshot node with automatic caching
 *
 * @example
 * ```typescript
 * import { createTestSnapshotNode } from '@tevm/test-node'
 * import { blockNumberProcedure } from '@tevm/actions'
 * import { http } from 'viem'
 *
 * const node = createTestSnapshotNode({
 *   fork: { transport: http('https://mainnet.optimism.io')() },
 *   test: { cacheDir: '.tevm/test-snapshots' }
 * })
 *
 * // Use the node in your tests
 * await node.start()
 * const block = await blockNumberProcedure(node.tevm)({
 *   jsonrpc: '2.0',
 *   method: 'eth_blockNumber',
 *   id: 1,
 *   params: [],
 * })
 * await node.stop()
 * ```
 */
export const createTestSnapshotNode = (options: TestSnapshotNodeOptions): TestSnapshotNode => {
	const client = createTestSnapshotClient(options)
	return {
		...client,
		tevm: client.tevm.transport.tevm as TevmNode<'fork'>,
		get rpcUrl() {
			return client.rpcUrl
		},
	}
}

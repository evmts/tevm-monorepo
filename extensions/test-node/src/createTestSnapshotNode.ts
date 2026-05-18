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
 *   fork: { transport: http('https://mainnet.optimism.io')() }
 * })
 *
 * // Use the node in your tests
 * await node.server.start()
 * const block = await blockNumberProcedure(node)({
 *   jsonrpc: '2.0',
 *   method: 'eth_blockNumber',
 *   id: 1,
 *   params: [],
 * })
 * await node.server.stop()
 * // Snapshots automatically saved to __rpc_snapshots__/<testFileName>.snap.json
 * // e.g., __rpc_snapshots__/myTest.spec.ts.snap.json
 * ```
 */
export const createTestSnapshotNode = (options: TestSnapshotNodeOptions): TestSnapshotNode => {
	const client = createTestSnapshotClient(options)
	const node = client.transport.tevm as TevmNode<'fork'>

	return node.extend(() => ({
		server: client.server,
		saveSnapshots: client.saveSnapshots,
	}))
}

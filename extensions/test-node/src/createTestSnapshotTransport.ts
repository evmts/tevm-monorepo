import type { EIP1193RequestFn, Transport } from 'viem'
import { createTestSnapshotClient } from './createTestSnapshotClient.js'
import type { TestSnapshotTransport, TestSnapshotTransportOptions } from './types.js'

/**
 * Creates a test snapshot client that automatically caches RPC responses
 *
 * @param options - Configuration options for the client
 * @returns A test snapshot client with automatic caching
 *
 * @example
 * ```typescript
 * import { createTestSnapshotClient } from '@tevm/test-node'
 * import { http } from 'viem'
 *
 * const client = createTestSnapshotClient({
 *   fork: { transport: http('https://mainnet.optimism.io')() },
 *   test: { cacheDir: '.tevm/test-snapshots' }
 * })
 *
 * // Use the client in your tests
 * await client.start()
 * const block = await client.tevm.getBlock({ blockNumber: 123n })
 * await client.stop()
 * ```
 */
export const createTestSnapshotTransport = <
	TTransportType extends string = string,
	TRpcAttributes = Record<string, any>,
	TEip1193RequestFn extends EIP1193RequestFn = EIP1193RequestFn,
>(
	options: TestSnapshotTransportOptions<TTransportType, TRpcAttributes, TEip1193RequestFn>,
): TestSnapshotTransport<TEip1193RequestFn> => {
	const client = createTestSnapshotClient({
		fork: {
			transport: options.transport as Transport | { request: EIP1193RequestFn },
		},
		test: options.test,
	})

	return {
		request: client.transport.request as TEip1193RequestFn,
		server: client.server,
		saveSnapshots: client.saveSnapshots,
	}
}

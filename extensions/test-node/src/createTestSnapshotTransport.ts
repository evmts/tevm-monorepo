import type { EIP1193RequestFn } from '@tevm/utils'
import { createTestSnapshotClient } from './createTestSnapshotClient.js'
import type { TestSnapshotTransport, TestSnapshotTransportOptions } from './types.js'

/**
 * Creates a test snapshot transport that automatically caches RPC responses
 *
 * @param options - Configuration options for the transport
 * @returns A test snapshot transport with automatic caching
 *
 * @example
 * ```typescript
 * import { createTestSnapshotTransport } from '@tevm/test-node'
 * import { nativeHttp } from '@tevm/utils'
 *
 * const transport = createTestSnapshotTransport({
 *   transport: nativeHttp('https://mainnet.optimism.io')()
 * })
 *
 * // Use the transport in your tests
 * await transport.server.start()
 * const block = await transport.request({ method: 'eth_getBlockByNumber', params: [123n, false] })
 * await transport.server.stop()
 * // Snapshots automatically saved to __rpc_snapshots__/<testFileName>.snap.json
 * // e.g., __rpc_snapshots__/myTest.spec.ts.snap.json
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
			transport: options.transport as any,
		},
		test: options.test,
	})

	// This should never happen
	if (!client.transport.tevm.forkTransport) throw new Error('Transport is not a fork transport')

	return {
		request: client.transport.tevm.forkTransport.request as TEip1193RequestFn,
		server: client.server,
		saveSnapshots: client.saveSnapshots,
	}
}

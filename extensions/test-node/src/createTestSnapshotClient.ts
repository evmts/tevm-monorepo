import type { AddressInfo } from 'node:net'
import type { Common } from '@tevm/common'
import { createMemoryClient, type TevmRpcSchema } from '@tevm/memory-client'
import { createServer } from '@tevm/server'
import type { Account, Address, Chain, RpcSchema } from 'viem'
import { createCachedTransport } from './snapshot/createCachedTransport.js'
import { SnapshotManager } from './snapshot/SnapshotManager.js'
import type { TestSnapshotClient, TestSnapshotClientOptions } from './types.js'

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
 * // Basic usage with caching
 * const client = createTestSnapshotClient({
 *   fork: { transport: http('https://mainnet.optimism.io')() },
 *   test: { resolveSnapshotPath: 'vitest' } // default
 * })
 *
 * // Advanced usage with passthrough configuration
 * const clientWithPassthrough = createTestSnapshotClient({
 *   fork: { transport: http('https://mainnet.optimism.io')() },
 *   test: {
 *     resolveSnapshotPath: 'vitest',
 *     passthrough: {
 *       // Real-time oracle data testing
 *       methodUrls: {
 *         'eth_call': 'https://oracle-node.chainlink.com'
 *       },
 *       // Live state validation
 *       nonCachedMethods: ['eth_blockNumber', 'eth_gasPrice'],
 *       defaultUrl: 'https://live-validator.ethereum.org'
 *     }
 *   }
 * })
 *
 * // Use the client in your tests
 * await client.server.start()
 * const block = await client.getBlock({ blockNumber: 123n })
 * await client.server.stop()
 * // Snapshots automatically saved to __rpc_snapshots__/<testFileName>.snap.json
 * // e.g., __rpc_snapshots__/myTest.spec.ts.snap.json
 * ```
 */
export const createTestSnapshotClient = <
	TCommon extends Common & Chain = Common & Chain,
	TAccountOrAddress extends Account | Address | undefined = undefined,
	TRpcSchema extends RpcSchema | undefined = TevmRpcSchema,
>(
	options: TestSnapshotClientOptions<TCommon, TAccountOrAddress, TRpcSchema>,
): TestSnapshotClient<TCommon, TAccountOrAddress> => {
	// Validate fork transport is provided
	const forkTransport = options.fork?.transport
	if (!forkTransport) {
		throw new Error('Fork transport is required in options.fork.transport')
	}

	// Create snapshot manager
	const snapshotManager = new SnapshotManager(options.test?.resolveSnapshotPath)

	// Create TEVM client with cached transport
	const autosave = options.test?.autosave ?? 'onRequest'
	const passthroughConfig = options.test?.passthrough
	const client = createMemoryClient({
		...options,
		fork: {
			...options.fork,
			// Create a transport with a request function that handles caching and passthrough routing
			transport: createCachedTransport(forkTransport, snapshotManager, autosave, passthroughConfig),
		},
	})
	// @ts-expect-error - TODO: fix this, likely in some change we made to yParity inconsistent with view we didn't detect before
	const server = createServer(client)

	let rpcUrl = ''
	let serverStarted = false

	// Return the extended client
	return client.extend(() => ({
		server: {
			http: server,
			get rpcUrl() {
				return rpcUrl
			},
			start: async () => {
				if (serverStarted) return

				return new Promise<void>((resolve, reject) => {
					server.once('error', reject)
					server.once('listening', resolve)

					server.listen(0, 'localhost', () => {
						const address = server.address() as AddressInfo
						rpcUrl = `http://localhost:${address.port}`
						serverStarted = true
						resolve()
					})
				})
			},
			stop: async () => {
				if (autosave === 'onStop') await snapshotManager.save()
				if (!serverStarted) return

				await new Promise<void>((resolve, reject) => {
					server.close((err) => {
						if (err) {
							reject(err)
						} else {
							serverStarted = false
							resolve()
						}
					})
				})
			},
		},
		saveSnapshots: async (): Promise<void> => {
			await snapshotManager.save()
		},
	}))
}

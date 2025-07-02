import type { AddressInfo } from 'node:net'
import type { Common } from '@tevm/common'
import { type TevmRpcSchema, createMemoryClient } from '@tevm/memory-client'
import { createServer } from '@tevm/server'
import type { Account, Address, Chain, EIP1193RequestFn, RpcSchema } from 'viem'
import { SnapshotManager } from './snapshot/SnapshotManager.js'
import { createCachedTransport } from './snapshot/createCachedTransport.js'
import type { TestSnapshotClient, TestSnapshotClientOptions, TestSnapshotTransport, TestSnapshotTransportOptions } from './types.js'

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
	// Create snapshot manager
	const snapshotManager = new SnapshotManager(options.test?.cacheDir)

	// Create TEVM client with cached transport
	const autosave = options.test?.autosave ?? 'onStop'
	const tevm = createMemoryClient({
		fork: {
			// Create a transport with a request function that handles caching
			transport: createCachedTransport(options.transport, snapshotManager, autosave),
		},
	})
	const server = createServer(tevm)

	let rpcUrl = ''
	let serverStarted = false

	// Create the client object
	const client: TestSnapshotClient<TCommon, TAccountOrAddress> = {
		tevm,
		server,
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
			await snapshotManager.save()
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
		save: async (): Promise<void> => {
			await snapshotManager.save()
		},
	}

	return client
}

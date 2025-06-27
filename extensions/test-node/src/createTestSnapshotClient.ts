import type { AddressInfo } from 'node:net'
import { createMemoryClient } from '@tevm/memory-client'
import { createServer } from '@tevm/server'
import { numberToHex } from 'viem'
import { SnapshotManager } from './snapshot/SnapshotManager.js'
import { createCachedTransport } from './snapshot/createCachedTransport.js'
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
export const createTestSnapshotClient = (options: TestSnapshotClientOptions): TestSnapshotClient => {
	// Validate fork transport is provided
	const forkTransport = options.fork?.transport
	if (!forkTransport) {
		throw new Error('Fork transport is required in options.fork.transport')
	}

	// Create snapshot manager
	const snapshotManager = new SnapshotManager(options.test?.cacheDir)

	// Get chain ID if provided in common config
	const chainId = options.common?.id ? numberToHex(options.common.id) : undefined

	// Create cached transport
	const cachedTransport = createCachedTransport(forkTransport, snapshotManager, chainId)

	// Create TEVM client with cached transport
	const tevm = createMemoryClient({
		...options,
		fork: {
			...options.fork,
			transport: cachedTransport
		}
	})
	const server = createServer(tevm)

	let rpcUrl = ''
	let serverStarted = false

	// Create the client object
	const client: TestSnapshotClient = {
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
			if (!serverStarted) return
			await snapshotManager.save()

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
		}
	}

	return client
}
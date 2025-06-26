import type { AddressInfo } from 'node:net'
import path from 'node:path'
import { createMemoryClient } from '@tevm/memory-client'
import { createServer } from '@tevm/server'
import { type Hex, numberToHex } from 'viem'
import { getGlobalTestConfig } from './global.js'
import { pollyAdapter } from './pollyAdapter.js'
import type { TestSnapshotClient } from './types.js'

/**
 * Global client instance - automatically managed per test file
 */
let globalClient: TestSnapshotClient | null = null

/**
 * Gets the automatically managed test client
 * No setup required - just call this function and start making requests
 *
 * The client is automatically created, started, and managed per test file
 * Snapshots are automatically saved to __snapshots__/[testFileName]/
 *
 * @example
 * ```typescript
 * // In your test file - no setup needed!
 * import { getTestClient } from '@tevm/test-node'
 *
 * it('should work', async () => {
 *   const client = getTestClient()
 *   const block = await client.tevm.getBlock({ blockNumber: 123n })
 *   expect(block).toBeDefined()
 * })
 * ```
 */
export const getTestClient = (): TestSnapshotClient => {
	if (globalClient) return globalClient

	// Get configuration from global setup
	const config = getGlobalTestConfig()
	const forkTransport = config.tevm.fork?.transport
	if (!forkTransport) {
		throw new Error('Fork transport is required in your test configuration')
	}

	// Create the TEVM client
	const tevm = createMemoryClient(config.tevm)
	const server = createServer(tevm)

	let rpcUrl = ''
	let serverStarted = false

	const initPolly = async () => {
		// Get or determine chain ID
		const chainId = config.tevm.common
				? numberToHex(config.tevm.common.id)
				: ((await (typeof forkTransport === 'function' ? forkTransport({}) : forkTransport).request({
						method: 'eth_chainId',
					})) as Hex)

		// Initialize Polly for this test file
		const snapshotDir = config.snapshot?.dir ?? path.join(process.cwd(), '__snapshots__')
		await pollyAdapter.init(snapshotDir, chainId)
	}

	// Create client with automatic lifecycle management
	globalClient = {
		tevm,
		server,
		get rpcUrl() {
			return rpcUrl
		},
		start: async () => {
			if (serverStarted) return
			await initPolly()

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

			return new Promise<void>((resolve, reject) => {
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

		/**
		 * Flush Polly recordings to disk without stopping the server or Polly instance
		 * This allows checking snapshots mid-test while keeping everything running
		 */
		flush: async (): Promise<void> => {
			await pollyAdapter.flush()
		},

		destroy: async (): Promise<void> => {
			await globalClient?.stop()
			globalClient = null

			await pollyAdapter.destroy()
		},
	}

	return globalClient
}
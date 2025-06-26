import { getTestClient } from './client.js'
import type { TestSnapshotClientOptions } from './types.js'

/**
 * Global configuration for the test snapshot client
 * Set this once in your vitest setup file and the client will be automatically managed
 */
export let globalTestConfig: TestSnapshotClientOptions | null = null

/**
 * Configure the global test snapshot client
 * Call this once in your vitest setup file and the client will be automatically created and managed
 *
 * @param options - Configuration for Tevm and the snapshotting behavior
 *
 * @example
 * ```typescript
 * // vitest.setup.ts
 * import { configureTestClient } from '@tevm/test-node'
 * import { mainnet } from '@tevm/common'
 * import { transports } from '@tevm/test-utils'
 *
 * configureTestClient({
 *   tevm: {
 *     fork: { transport: transports.mainnet, blockTag: 22780450n },
 *     common: mainnet,
 *   }
 * })
 * ```
 */
export const configureTestClient = (options: TestSnapshotClientOptions) => {
	globalTestConfig = options
	return getTestClient()
}

/**
 * Get the current global test configuration
 * @internal
 */
export const getGlobalTestConfig = (): TestSnapshotClientOptions => {
	if (!globalTestConfig) {
		throw new Error(
			'Test client not configured. Call configureTestClient() in your vitest setup file first.'
		)
	}
	return globalTestConfig
}
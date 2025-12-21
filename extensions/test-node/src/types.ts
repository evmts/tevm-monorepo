import type { Server as HttpServer } from 'node:http'
import type { Common } from '@tevm/common'
import type { MemoryClient, MemoryClientOptions, TevmRpcSchema } from '@tevm/memory-client'
import type { TevmNode, TevmNodeOptions } from '@tevm/node'
import type { Account, Address, Chain, EIP1193RequestFn, RpcSchema, Transport } from 'viem'

export type SnapshotAutosaveMode = 'onStop' | 'onRequest' | 'onSave'

/**
 * Function that determines if a method should bypass the cache
 * @param method - The RPC method name
 * @returns true if the method should bypass the cache (passthrough), false otherwise
 */
export type PassthroughMethodsFilter = (method: string) => boolean

export type TestOptions = {
	/**
	 * Controls how snapshot file paths are resolved.
	 *
	 * - 'vitest' (default): Automatically resolve using test runner's context (vitest or Bun),
	 *   snapshots saved in __rpc_snapshots__ subdirectory next to test file
	 * - Function: Custom resolver that returns the full absolute path to the snapshot file.
	 *   Use this when not running in a supported test context or need custom snapshot locations.
	 *
	 * @default 'vitest'
	 * @example
	 * ```typescript
	 * // Snapshots in __rpc_snapshots__/ subdirectory (default, auto-detects vitest or Bun)
	 * test: { resolveSnapshotPath: 'vitest' }
	 *
	 * // Or simply omit it (same as above)
	 * test: {}
	 *
	 * // Custom path - returns full path including filename
	 * test: {
	 *   resolveSnapshotPath: () => '/custom/path/to/my-snapshots.json'
	 * }
	 * ```
	 */
	resolveSnapshotPath?: 'vitest' | 'bun' | (() => string)
	/**
	 * Controls when snapshots are automatically saved to disk.
	 *
	 * - 'onRequest' (default): Save snapshots after each request is cached
	 * - 'onStop': Save snapshots only when stopping the server
	 * - 'onSave': Save only when manually calling saveSnapshots()
	 *
	 * Using 'onRequest' provides real-time snapshot persistence, ensuring data is written
	 * immediately. Use 'onStop' for better performance when you only need snapshots
	 * persisted at the end of your test run. Use 'onSave' for complete manual control
	 * over when snapshots are written to disk.
	 *
	 * @default 'onRequest'
	 */
	autosave?: SnapshotAutosaveMode
	/**
	 * Methods that should always bypass the cache (passthrough).
	 * These methods will be forwarded directly to the fork transport without caching.
	 *
	 * Can be specified as:
	 * - An array of method names (e.g., ['eth_blockNumber', 'eth_gasPrice'])
	 * - A filter function that receives the method name and returns true to bypass cache
	 *
	 * Use this when you need certain RPC calls to always hit the remote provider,
	 * for example when testing against live data or debugging caching issues.
	 *
	 * @example
	 * ```typescript
	 * // Array of method names
	 * test: {
	 *   passthroughMethods: ['eth_blockNumber', 'eth_gasPrice']
	 * }
	 *
	 * // Filter function for all debug_* methods
	 * test: {
	 *   passthroughMethods: (method) => method.startsWith('debug_')
	 * }
	 *
	 * // Combine with existing caching - only bypass specific methods
	 * test: {
	 *   passthroughMethods: ['eth_getLogs', 'eth_call']
	 * }
	 * ```
	 */
	passthroughMethods?: string[] | PassthroughMethodsFilter
}

type TestSnapshotBaseClient = {
	server: {
		/**
		 * The HTTP server
		 */
		http: HttpServer
		/**
		 * The RPC URL of the server
		 */
		rpcUrl: string
		/**
		 * Start the Tevm server
		 */
		start: () => Promise<void>
		/**
		 * Stop the Tevm server and save snapshots
		 */
		stop: () => Promise<void>
	}
	/**
	 * Save snapshots to disk without stopping the server
	 * This allows checking snapshots mid-test while keeping everything running
	 */
	saveSnapshots: () => Promise<void>
}

export type TestSnapshotClientOptions<
	TCommon extends Common & Chain = Common & Chain,
	TAccountOrAddress extends Account | Address | undefined = undefined,
	TRpcSchema extends RpcSchema | undefined = TevmRpcSchema,
> = MemoryClientOptions<TCommon, TAccountOrAddress, TRpcSchema> & {
	test?: TestOptions | undefined
}

export type TestSnapshotClient<
	TCommon extends Common & Chain = Common & Chain,
	TAccountOrAddress extends Account | Address | undefined = undefined,
> = MemoryClient<TCommon, TAccountOrAddress> & TestSnapshotBaseClient

export type TestSnapshotNodeOptions = TevmNodeOptions & {
	test?: TestOptions | undefined
}

export type TestSnapshotNode = TevmNode<'fork'> & TestSnapshotBaseClient

export type TestSnapshotTransportOptions<
	TTransportType extends string = string,
	TRpcAttributes = Record<string, any>,
	TEip1193RequestFn extends EIP1193RequestFn = EIP1193RequestFn,
> = {
	transport: Transport<TTransportType, TRpcAttributes, TEip1193RequestFn> | { request: TEip1193RequestFn }
	test?: TestOptions | undefined
}

export type TestSnapshotTransport<TEip1193RequestFn extends EIP1193RequestFn = EIP1193RequestFn> = {
	request: TEip1193RequestFn
} & TestSnapshotBaseClient

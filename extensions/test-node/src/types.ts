import type { Server as HttpServer } from 'node:http'
import type { Common } from '@tevm/common'
import type { MemoryClient, MemoryClientOptions, TevmRpcSchema } from '@tevm/memory-client'
import type { TevmNode, TevmNodeOptions } from '@tevm/node'
import type { Account, Address, Chain, RpcSchema } from 'viem'

export type SnapshotAutosaveMode = 'onStop' | 'onRequest'

export type TestOptions = {
	/**
	 * The directory to store snapshot files.
	 * @default '.tevm/test-snapshots/<test-file-name>'
	 */
	cacheDir?: string
	/**
	 * Controls when snapshots are automatically saved to disk.
	 *
	 * - 'onStop' (default): Save snapshots only when stopping the server
	 * - 'onRequest': Save snapshots after each request is cached
	 *
	 * Using 'onRequest' provides real-time snapshot persistence but may impact performance
	 * with frequent I/O operations. Use 'onStop' for better performance when you only
	 * need snapshots persisted at the end of your test run (or whenever you call `stop()` or `save()`).
	 *
	 * @default 'onStop'
	 */
	autosave?: SnapshotAutosaveMode
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
	test?: TestOptions
}

export type TestSnapshotClient<
	TCommon extends Common & Chain = Common & Chain,
	TAccountOrAddress extends Account | Address | undefined = undefined,
> = MemoryClient<TCommon, TAccountOrAddress> & TestSnapshotBaseClient

export type TestSnapshotNodeOptions = TevmNodeOptions & {
	test?: TestOptions
}

export type TestSnapshotNode = TevmNode<'fork'> & TestSnapshotBaseClient

import type { Server as HttpServer } from 'node:http'
import type { MemoryClient, MemoryClientOptions } from '@tevm/memory-client'

export type TestOptions = {
	/**
	 * The directory to store snapshot files.
	 * @default '.tevm/test-snapshots/<test-file-name>'
	 */
	cacheDir?: string
}

export type TestSnapshotClientOptions = MemoryClientOptions & {
	test?: TestOptions
}

export type TestSnapshotClient = MemoryClient & {
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

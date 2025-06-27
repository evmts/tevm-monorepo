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

export type TestSnapshotClient = {
	tevm: MemoryClient
	server: HttpServer
	rpcUrl: string
	start: () => Promise<void>
	stop: () => Promise<void>
	/**
	 * Save snapshots to disk without stopping the server
	 * This allows checking snapshots mid-test while keeping everything running
	 */
	save: () => Promise<void>
}

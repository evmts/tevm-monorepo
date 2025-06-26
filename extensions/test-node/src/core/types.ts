import type { Server as HttpServer } from 'node:http'
import type { MemoryClient, MemoryClientOptions } from '@tevm/memory-client'

export type SnapshotOptions = {
	/**
	 * The directory to store .har snapshot files.
	 * @default '__snapshots__'
	 */
	dir?: string
}

export type TestSnapshotClientOptions = {
	tevm: MemoryClientOptions
	snapshot?: SnapshotOptions
}

export type TestSnapshotClient = {
	tevm: MemoryClient
	server: HttpServer
	rpcUrl: string
	start: () => Promise<void>
	stop: () => Promise<void>
	/**
	 * Flush Polly recordings to disk without stopping the server or Polly instance
	 * This allows checking snapshots mid-test while keeping everything running
	 */
	flush: () => Promise<void>
	/**
	 * Complete cleanup - stops server, Polly instance, and resets client
	 * Use this for final cleanup when done with all tests
	 */
	destroy: () => Promise<void>
}

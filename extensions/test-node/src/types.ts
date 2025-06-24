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
}

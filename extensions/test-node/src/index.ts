import type { Server as HttpServer } from 'node:http'
import type { AddressInfo } from 'node:net'
import { type MemoryClient, type MemoryClientOptions, createMemoryClient } from '@tevm/memory-client'
import { createServer } from '@tevm/server'

export type TestSnapshotClient = {
	tevm: MemoryClient
	server: HttpServer
	rpcUrl: string
	start: () => Promise<void>
	stop: () => Promise<void>
}

/**
 * Creates a Tevm test client with a controllable server and JSON-RPC snapshotting.
 * @param options - Configuration for Tevm and the snapshotting behavior.
 */
export const createTestSnapshotClient = (options: { tevm: MemoryClientOptions }): TestSnapshotClient => {
	const tevm = createMemoryClient(options.tevm)
	const server = createServer(tevm)

	const client: TestSnapshotClient = {
		tevm,
		server,
		rpcUrl: '', // will be updated in start()
		start: async () => {
			return new Promise<void>((resolve, reject) => {
				server.listen(0, 'localhost', () => {
					const address = server.address() as AddressInfo
					client.rpcUrl = `http://localhost:${address.port}`
					resolve()
				})
				server.once('error', reject)
			})
		},
		stop: async () => {
			return new Promise<void>((resolve, reject) => {
				if (!server.listening) return resolve()
				server.close((err) => (err ? reject(err) : resolve()))
			})
		},
	}

	return client
}

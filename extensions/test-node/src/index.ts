import type { AddressInfo } from 'node:net'
import { createMemoryClient } from '@tevm/memory-client'
import { createServer } from '@tevm/server'
import { createPolly } from './internal/createPolly.js'
import type { TestSnapshotClient, TestSnapshotClientOptions } from './types.js'

/**
 * Creates a Tevm test client with a controllable server and JSON-RPC snapshotting.
 * @param options - Configuration for Tevm and the snapshotting behavior.
 */
export const createTestSnapshotClient = (options: TestSnapshotClientOptions): TestSnapshotClient => {
	const tevm = createMemoryClient(options.tevm)
	const server = createServer(tevm)

	let rpcUrl = ''

	const polly = createPolly(options.snapshot?.dir ?? '__snapshots__')

	const client: TestSnapshotClient = {
		tevm,
		server,
		get rpcUrl() {
			return rpcUrl
		},
		start: async () => {
			polly.init()

			return new Promise<void>((resolve, reject) => {
				server.once('error', reject)
				server.once('listening', resolve)

				server.listen(0, 'localhost', () => {
					const address = server.address() as AddressInfo
					rpcUrl = `http://localhost:${address.port}`
					resolve()
				})
			})
		},
		stop: async () => {
			return new Promise<void>(async (resolve, reject) => {
				polly.destroy()
				if (!server.listening) return resolve()
				server.close((err) => (err ? reject(err) : resolve()))
			})
		},
	}

	return client
}

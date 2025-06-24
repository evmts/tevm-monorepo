import type { AddressInfo } from 'node:net'
import { createMemoryClient } from '@tevm/memory-client'
import { createServer } from '@tevm/server'
import { type Hex, numberToHex } from 'viem'
import { createPolly } from './internal/createPolly.js'
import type { TestSnapshotClient, TestSnapshotClientOptions } from './types.js'

/**
 * Creates a Tevm test client with a controllable server and JSON-RPC snapshotting.
 * @param options - Configuration for Tevm and the snapshotting behavior.
 */
export const createTestSnapshotClient = (options: TestSnapshotClientOptions): TestSnapshotClient => {
	const forkTransport = options.tevm.fork?.transport
	if (forkTransport === undefined) throw new Error('You need to provide a fork transport')
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
			// We cache based on chainId
			const chainId = options.tevm.common
				? numberToHex(options.tevm.common.id)
				: ((await (typeof forkTransport === 'function' ? forkTransport({}) : forkTransport).request({
						method: 'eth_chainId',
					})) as Hex)
			polly.init(chainId)

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

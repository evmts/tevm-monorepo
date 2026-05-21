import { vi } from 'vitest'
import { createTestSnapshotClient } from '../createTestSnapshotClient.js'
import { BLOCK_NUMBER, chain } from './constants.js'
import { createMockForkTransport } from './mockTransport.js'

const { createMockHttpServer } = vi.hoisted(() => {
	let nextPort = 18_545

	return {
		createMockHttpServer: () => {
			const listeners = new Map<string, Array<() => void>>()
			const port = nextPort++
			const server = {
				once: (event: string, listener: () => void) => {
					listeners.set(event, [...(listeners.get(event) ?? []), listener])
					return server
				},
				listen: (_port: number, _host: string, callback?: () => void) => {
					callback?.()
					for (const listener of listeners.get('listening') ?? []) listener()
					listeners.delete('listening')
					return server
				},
				address: () => ({ port }),
				close: (callback: (err?: Error) => void) => {
					callback()
					return server
				},
			}
			return server
		},
	}
})

vi.mock('@tevm/server', () => ({
	createServer: createMockHttpServer,
}))

// Global client instance
export const client = createTestSnapshotClient({
	fork: {
		transport: createMockForkTransport(),
		blockTag: BigInt(BLOCK_NUMBER) + 1n,
	},
	common: chain,
})

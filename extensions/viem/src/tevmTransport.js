import { createTransport } from 'viem'

/**
 * @param {Pick<import('@tevm/memory-client').MemoryClient, 'request'>} tevm The Tevm instance
 * @param {Pick<import('viem').TransportConfig, 'name' | 'key'>} [options]
 * @returns {import('viem').Transport} The transport function
 */
export const tevmTransport = ({ request }, options) => {
	return () => {
		return createTransport({
			request: /** @type any*/(request),
			type: 'tevm',
			name: options?.name ?? 'Tevm transport',
			key: options?.key ?? 'tevm',
		})
	}
}

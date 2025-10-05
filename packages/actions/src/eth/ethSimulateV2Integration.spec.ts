import { createTevmNode } from '@tevm/node'
import { parseEther } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { createHandlers } from '../createHandlers.js'

describe('eth_simulateV2 integration', () => {
	it('should be available in request handlers', async () => {
		const client = createTevmNode()
		const handlers = createHandlers(client)
		
		expect(handlers.eth_simulateV2).toBeDefined()
		expect(typeof handlers.eth_simulateV2).toBe('function')
	})

	it('should handle JSON-RPC format correctly', async () => {
		const client = createTevmNode()
		const handlers = createHandlers(client)
		
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_simulateV2',
			params: [
				{
					calls: [
						{
							from: '0x1234567890123456789012345678901234567890',
							to: '0x0987654321098765432109876543210987654321',
							value: `0x${parseEther('1').toString(16)}`,
						},
					],
				},
			],
			id: 1,
		}

		// This should not throw and should return a proper JSON-RPC response
		const response = await handlers.eth_simulateV2(request)
		
		expect(response).toMatchObject({
			jsonrpc: '2.0',
			method: 'eth_simulateV2',
			id: 1,
		})

		// Should have either result or error
		expect(response).toEqual(
			expect.objectContaining({
				[expect.any(String)]: expect.any(Object),
			}),
		)
	})

	it('should handle malformed requests gracefully', async () => {
		const client = createTevmNode()
		const handlers = createHandlers(client)
		
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_simulateV2',
			params: [], // Missing required params
			id: 1,
		}

		const response = await handlers.eth_simulateV2(request)
		
		expect(response).toMatchObject({
			jsonrpc: '2.0',
			method: 'eth_simulateV2',
			id: 1,
			error: expect.objectContaining({
				code: expect.any(Number),
				message: expect.any(String),
			}),
		})
	})
})
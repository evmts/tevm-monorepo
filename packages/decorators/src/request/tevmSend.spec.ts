import { describe, expect, it, vi } from 'vitest'
import { tevmSend } from './tevmSend.js'

// Mocks need to be initialized before imports are processed
vi.mock('@tevm/actions', () => {
	const mockSendFn = vi.fn().mockResolvedValue({ result: 'send_result' })
	const mockSendBulkFn = vi.fn().mockResolvedValue([{ result: 'bulk_result' }])

	return {
		requestProcedure: vi.fn().mockReturnValue(mockSendFn),
		requestBulkProcedure: vi.fn().mockReturnValue(mockSendBulkFn),
	}
})

describe('tevmSend', () => {
	it('should add send and sendBulk methods to client', () => {
		const mockClient = {
			ready: async () => {},
			logger: { debug: () => {} },
		}
		const extended = tevmSend()(mockClient)

		expect(extended).toHaveProperty('send')
		expect(typeof extended.send).toBe('function')

		expect(extended).toHaveProperty('sendBulk')
		expect(typeof extended.sendBulk).toBe('function')
	})

	it('should use requestProcedure for send method', () => {
		const mockClient = {
			ready: async () => {},
			logger: { debug: () => {} },
		}

		const extended = tevmSend()(mockClient)
		expect(typeof extended.send).toBe('function')
	})

	it('should use requestBulkProcedure for sendBulk method', () => {
		const mockClient = {
			ready: async () => {},
			logger: { debug: () => {} },
		}

		const extended = tevmSend()(mockClient)
		expect(typeof extended.sendBulk).toBe('function')
	})
})

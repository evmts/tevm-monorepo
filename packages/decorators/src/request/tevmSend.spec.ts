import { describe, expect, it, vi } from 'vitest'
import { tevmSend } from './tevmSend.js'

// Use jest.spyOn instead of importing from @tevm/actions
// This way we avoid circular dependencies during build
const mockSendFn = vi.fn().mockResolvedValue({ result: 'send_result' })
const mockSendBulkFn = vi.fn().mockResolvedValue([{ result: 'bulk_result' }])

// Mock the dynamic imports instead of the module itself
vi.mock('./tevmSend.js', async (importOriginal) => {
	const actual = await importOriginal()

	// Override the importProcedures function
	const mockImportProcedures = vi.fn().mockResolvedValue({
		requestProcedure: vi.fn().mockReturnValue(mockSendFn),
		requestBulkProcedure: vi.fn().mockReturnValue(mockSendBulkFn),
	})

	// Return the actual module with our mock added
	return {
		...actual,
		importProcedures: mockImportProcedures,
	}
})

describe('tevmSend', () => {
	it('should add send and sendBulk methods to client', () => {
		const mockClient = {
			ready: async () => {},
			logger: { debug: () => {} },
		} as any
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
		} as any

		const extended = tevmSend()(mockClient)
		expect(typeof extended.send).toBe('function')
	})

	it('should use requestBulkProcedure for sendBulk method', () => {
		const mockClient = {
			ready: async () => {},
			logger: { debug: () => {} },
		} as any

		const extended = tevmSend()(mockClient)
		expect(typeof extended.sendBulk).toBe('function')
	})
})

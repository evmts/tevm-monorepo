import { describe, expect, it } from 'vitest'
import { errorMsg } from './errorMsg.js'

describe('errorMsg', () => {
	it('should format error message correctly with block.errorStr', () => {
		// Setup
		const msg = 'Test error message'

		const mockVm = {
			common: {
				ethjsCommon: {
					hardfork: {
						name: 'london',
					},
				},
			},
		}

		const mockBlock = {
			errorStr: () => 'Block #123 (0xabc...)',
		}

		// Call the function
		const result = errorMsg(msg, mockVm as any, mockBlock as any)

		// Verify
		expect(result).toBe('Test error message (london -> Block #123 (0xabc...))')
	})

	it('should format error message correctly when block has no errorStr method', () => {
		// Setup
		const msg = 'Another error message'

		const mockVm = {
			common: {
				ethjsCommon: {
					hardfork: {
						name: 'shanghai',
					},
				},
			},
		}

		const mockBlock = {}

		// Call the function
		const result = errorMsg(msg, mockVm as any, mockBlock as any)

		// Verify
		expect(result).toBe('Another error message (shanghai -> block)')
	})
})

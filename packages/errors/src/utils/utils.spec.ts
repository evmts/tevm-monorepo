import { describe, expect, it } from 'vitest'
import { DecodeFunctionDataError } from './DecodeFunctionDataError.js'
import { EncodeFunctionReturnDataError } from './EncodeFunctionReturnDataError.js'

describe('Utils Errors', () => {
	describe('DecodeFunctionDataError', () => {
		it('should create with a custom message', () => {
			const error = new DecodeFunctionDataError('Failed to decode function data')
			expect(error.message).toContain('Failed to decode function data')
			expect(error.name).toBe('DecodeFunctionDataError')
			expect(error._tag).toBe('DecodeFunctionDataError')
		})

		it('should create with custom docs parameters', () => {
			const error = new DecodeFunctionDataError('Decode error', {
				docsBaseUrl: 'https://custom.docs',
				docsPath: '/custom/path',
			})
			expect(error.message).toContain('https://custom.docs')
			expect(error.message).toContain('/custom/path')
		})

		it('should create with a cause', () => {
			const cause = new Error('Underlying error')
			const error = new DecodeFunctionDataError('Decode error', {
				cause,
			})
			expect(error.cause).toBe(cause)
		})

		it('should create with meta information', () => {
			const error = new DecodeFunctionDataError('Decode error', {
				metaMessages: ['Additional info'],
				details: 'Unable to decode ABI',
				meta: { functionSelector: '0xabcdef12' },
			})
			expect(error.metaMessages).toEqual(['Additional info'])
			expect(error.message).toContain('Decode error')
			// The BaseError constructor does not copy the meta property, only metaMessages
		})
	})

	describe('EncodeFunctionReturnDataError', () => {
		it('should create with a custom message', () => {
			const error = new EncodeFunctionReturnDataError('Failed to encode return data')
			expect(error.message).toContain('Failed to encode return data')
			expect(error.name).toBe('EncodeFunctionReturnDataError')
			expect(error._tag).toBe('EncodeFunctionReturnDataError')
		})

		it('should create with custom docs parameters', () => {
			const error = new EncodeFunctionReturnDataError('Encode error', {
				docsBaseUrl: 'https://custom.docs',
				docsPath: '/custom/path',
			})
			expect(error.message).toContain('https://custom.docs')
			expect(error.message).toContain('/custom/path')
		})

		it('should create with a cause', () => {
			const cause = new Error('Type mismatch')
			const error = new EncodeFunctionReturnDataError('Encode error', {
				cause,
			})
			expect(error.cause).toBe(cause)
		})

		it('should create with meta information', () => {
			const error = new EncodeFunctionReturnDataError('Encode error', {
				metaMessages: ['Additional context'],
				details: 'Return values do not match ABI types',
				meta: { returnTypes: ['uint256', 'string'] },
			})
			expect(error.metaMessages).toEqual(['Additional context'])
			expect(error.message).toContain('Encode error')
			// The BaseError constructor does not copy the meta property, only metaMessages
		})
	})
})

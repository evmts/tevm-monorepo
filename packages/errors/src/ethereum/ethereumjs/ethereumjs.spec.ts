import { describe, expect, it } from 'vitest'
import { BaseError } from '../BaseError.js'
import { InternalEvmError } from './InternalEvmError.js'
import { RefundExhaustedError } from './RefundExhausted.js'

// Note: AuthCallUnsetError was removed in the ethereumjs alpha.1 upgrade

describe('RefundExhaustedError', () => {
	it('should create error with defaults', () => {
		const error = new RefundExhaustedError()

		expect(error.message).toContain('Refund exhausted error occurred')
		expect(error.message).toContain('https://tevm.sh/reference/tevm/errors/classes/refundexhaustederror/')
	})

	it('should use custom message and docs path', () => {
		const error = new RefundExhaustedError('Custom refund error', {
			docsPath: '/custom/refund/path',
		})

		expect(error.message).toContain('Custom refund error')
		expect(error.message).toContain('/custom/refund/path')
	})
})

describe('InternalEvmError', () => {
	it('should create error with defaults', () => {
		const error = new InternalEvmError()

		expect(error.message).toContain('Internal error occurred')
		// The actual docPath in the InternalEvmError class (check if it's internalerror or internalevmerror)
		expect(error.message).toContain('/reference/tevm/errors/classes/internalerror/')
	})

	it('should use custom tag', () => {
		const error = new InternalEvmError('Internal error', {}, 'CustomInternalTag')

		expect(error.name).toBe('CustomInternalTag')
		expect(error._tag).toBe('CustomInternalTag')
	})

	it('should handle cause as another error', () => {
		// Create a custom error that extends BaseError to avoid type errors
		class TestError extends BaseError {
			constructor(message: string) {
				super(message, {}, 'TestError')
			}
		}
		const cause = new TestError('Underlying cause')
		const error = new InternalEvmError('Wrapper error', {
			cause,
		})

		// Since the cause is another BaseError, the docsPath is used instead of the message
		expect(error.message).toContain('Docs:')
		expect(error.cause).toBe(cause)
	})
})

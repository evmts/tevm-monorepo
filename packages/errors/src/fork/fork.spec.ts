import { describe, expect, it } from 'vitest'
import { InvalidParamsError } from '../ethereum/InvalidParamsError.js'
import { ForkError } from './ForkError.js'
import { NoForkTransportSetError } from './NoForkUriSetError.js'

describe('ForkError', () => {
	it('should create a ForkError with error cause', () => {
		const error = new ForkError('Failed to fetch from fork', {
			cause: new Error('Network error'),
		})
		expect(error.message).toContain('Failed to fetch from fork')
		expect(error.message).toContain('Network error')
		expect(error.name).toBe('ForkError')
		expect(error._tag).toBe('ForkError')
	})

	it('should handle cause as BaseError subclass instance', () => {
		// Using InvalidParamsError which extends BaseError
		const baseError = new InvalidParamsError('Base error message')
		const error = new ForkError('Fork error message', { cause: baseError })

		expect(error.message).toContain('Fork error message')
		expect(error.message).toContain('Base error message')
		expect(error.name).toBe('ForkError')
		expect(error._tag).toBe('ForkError')
	})

	it('should handle cause as error with code property', () => {
		const cause = new Error('Error with code') as Error & { code: number }
		cause.code = 456
		const error = new ForkError('Fork error message', { cause })

		expect(error.message).toContain('Fork error message')
		expect(error.message).toContain('Error with code')
		expect(error.code).toBe(456)
		expect(error.name).toBe('ForkError')
	})

	it('should include custom docs parameters in message', () => {
		const error = new ForkError('Failed to fetch from fork', {
			cause: new Error('Network error'),
			docsBaseUrl: 'https://custom.docs',
			docsPath: '/custom/path',
		})
		expect(error.message).toContain('https://custom.docs')
		expect(error.message).toContain('/custom/path')
	})

	it('should use default documentation URLs if not provided', () => {
		const error = new ForkError('Fork error', {
			cause: new Error('Cause'),
		})

		expect(error.message).toContain('https://tevm.sh')
		expect(error.message).toContain('/reference/tevm/errors/classes/forkerror/')
	})
})

describe('NoForkTransportSetError', () => {
	it('should create a NoForkTransportSetError with default parameters', () => {
		const error = new NoForkTransportSetError('No fork transport set')
		expect(error.message).toContain('No fork transport set')
		expect(error.name).toBe('NoForkTransportSetError')
		expect(error._tag).toBe('NoForkTransportSetError')
	})

	it('should create a NoForkTransportSetError with custom docs parameters', () => {
		const error = new NoForkTransportSetError('No fork transport set', {
			docsBaseUrl: 'https://custom.docs',
			docsPath: '/custom/path',
		})
		expect(error.message).toContain('https://custom.docs')
		expect(error.message).toContain('/custom/path')
	})
})

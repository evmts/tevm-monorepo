import { describe, expect, it } from 'vitest'
import { InvalidAbiError } from './InvalidAbiError.js'
import { InvalidArgsError } from './InvalidArgsError.js'
import { InvalidBalanceError } from './InvalidBalanceError.js'
import { InvalidBlobVersionedHashesError } from './InvalidBlobVersionedHashesError.js'
import { InvalidDataError } from './InvalidDataError.js'
import { InvalidFunctionNameError } from './InvalidFunctionNameError.js'
import { InvalidGasLimitError } from './InvalidGasLimitError.js'
// These imports are used in tests in other files, keeping them to ensure exports work correctly
// @ts-ignore: Imports used for testing but not directly referenced
import { InvalidSelfdestructError } from './InvalidSelfdestructError.js'
// @ts-ignore: Imports used for testing but not directly referenced
import { InvalidSkipBalanceError } from './InvalidSkipBalanceError.js'
// @ts-ignore: Imports used for testing but not directly referenced
import { InvalidStorageRootError } from './InvalidStorageRootError.js'
// @ts-ignore: Imports used for testing but not directly referenced
import { InvalidToError } from './InvalidToError.js'
import { InvalidUrlError } from './InvalidUrlError.js'

describe('Input errors', () => {
	describe('InvalidAbiError', () => {
		it('should create with a custom message', () => {
			const error = new InvalidAbiError('Invalid ABI format')
			expect(error.message).toContain('Invalid ABI format')
			expect(error.name).toBe('InvalidAbiError')
			expect(error._tag).toBe('InvalidAbiError')
		})

		it('should create with custom docs parameters', () => {
			const error = new InvalidAbiError('Invalid ABI', {
				docsBaseUrl: 'https://custom.docs',
				docsPath: '/custom/path',
			})
			expect(error.message).toContain('https://custom.docs')
			expect(error.message).toContain('/custom/path')
		})
	})

	describe('InvalidArgsError', () => {
		it('should create with a custom message', () => {
			const error = new InvalidArgsError('Invalid arguments provided')
			expect(error.message).toContain('Invalid arguments provided')
			expect(error.name).toBe('InvalidArgsError')
			expect(error._tag).toBe('InvalidArgsError')
		})

		it('should create with custom docs parameters', () => {
			const error = new InvalidArgsError('Invalid args', {
				docsBaseUrl: 'https://custom.docs',
				docsPath: '/custom/path',
			})
			expect(error.message).toContain('https://custom.docs')
			expect(error.message).toContain('/custom/path')
		})
	})

	describe('InvalidBalanceError', () => {
		it('should create with a custom message', () => {
			const error = new InvalidBalanceError('Invalid balance value')
			expect(error.message).toContain('Invalid balance value')
			expect(error.name).toBe('InvalidBalanceError')
		})

		it('should create with custom docs parameters', () => {
			const error = new InvalidBalanceError('Invalid balance', {
				docsBaseUrl: 'https://custom.docs',
				docsPath: '/custom/path',
			})
			expect(error.message).toContain('https://custom.docs')
			expect(error.message).toContain('/custom/path')
		})
	})

	describe('InvalidBlobVersionedHashesError', () => {
		it('should create with a custom message', () => {
			const error = new InvalidBlobVersionedHashesError('Invalid blob versioned hashes')
			expect(error.message).toContain('Invalid blob versioned hashes')
			expect(error.name).toBe('InvalidBlobVersionedHashesError')
		})

		it('should create with custom docs parameters', () => {
			const error = new InvalidBlobVersionedHashesError('Invalid hashes', {
				docsBaseUrl: 'https://custom.docs',
				docsPath: '/custom/path',
			})
			expect(error.message).toContain('https://custom.docs')
			expect(error.message).toContain('/custom/path')
		})
	})

	describe('InvalidDataError', () => {
		it('should create with a custom message', () => {
			const error = new InvalidDataError('Invalid data format')
			expect(error.message).toContain('Invalid data format')
			expect(error.name).toBe('InvalidDataError')
		})

		it('should create with custom docs parameters and cause', () => {
			const cause = new Error('Underlying error')
			const error = new InvalidDataError('Invalid data', {
				docsBaseUrl: 'https://custom.docs',
				docsPath: '/custom/path',
				cause,
			})
			expect(error.message).toContain('https://custom.docs')
			expect(error.message).toContain('/custom/path')
			expect(error.cause).toBe(cause)
		})
	})

	describe('InvalidFunctionNameError', () => {
		it('should create with a custom message', () => {
			const error = new InvalidFunctionNameError('Function does not exist')
			expect(error.message).toContain('Function does not exist')
			expect(error.name).toBe('InvalidFunctionNameError')
		})

		it('should create with custom docs parameters', () => {
			const error = new InvalidFunctionNameError('Invalid function', {
				docsBaseUrl: 'https://custom.docs',
				docsPath: '/custom/path',
			})
			expect(error.message).toContain('https://custom.docs')
			expect(error.message).toContain('/custom/path')
		})
	})

	describe('InvalidGasLimitError', () => {
		it('should create with a custom message', () => {
			const error = new InvalidGasLimitError('Gas limit too low')
			expect(error.message).toContain('Gas limit too low')
			expect(error.name).toBe('InvalidGasLimitError')
		})

		it('should create with custom docs parameters', () => {
			const error = new InvalidGasLimitError('Invalid gas limit', {
				docsBaseUrl: 'https://custom.docs',
				docsPath: '/custom/path',
			})
			expect(error.message).toContain('https://custom.docs')
			expect(error.message).toContain('/custom/path')
		})
	})

	describe('InvalidUrlError', () => {
		it('should create with a custom message', () => {
			const error = new InvalidUrlError('Invalid URL format')
			expect(error.message).toContain('Invalid URL format')
			expect(error.name).toBe('InvalidUrlError')
		})

		it('should create with custom docs parameters', () => {
			const error = new InvalidUrlError('Invalid URL', {
				docsBaseUrl: 'https://custom.docs',
				docsPath: '/custom/path',
			})
			expect(error.message).toContain('https://custom.docs')
			expect(error.message).toContain('/custom/path')
		})
	})
})

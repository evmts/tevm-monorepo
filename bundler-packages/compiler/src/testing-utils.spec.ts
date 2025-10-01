import { describe, expect, it } from 'vitest'
import { createMockFileAccessObject, createMockLogger, createMockSolc, SIMPLE_CONTRACT } from './testing-utils.js'

describe('testing-utils', () => {
	describe('createMockFileAccessObject', () => {
		it('should create a mock file access object', async () => {
			const fileMap = {
				'/path/to/file': 'file content',
				'/another/path': 'another content',
			}
			const fao = createMockFileAccessObject(fileMap)

			// Test readFile
			expect(await fao.readFile('/path/to/file')).toBe('file content')
			expect(await fao.readFile('/non/existent')).toBe('')

			// Test readFileSync
			expect(fao.readFileSync('/path/to/file')).toBe('file content')
			expect(fao.readFileSync('/non/existent')).toBe('')

			// Test exists
			expect(await fao.exists('/path/to/file')).toBe(true)
			expect(await fao.exists('/non/existent')).toBe(false)

			// Test existsSync
			expect(fao.existsSync('/path/to/file')).toBe(true)
			expect(fao.existsSync('/non/existent')).toBe(false)
		})

		it('should work with empty file map', async () => {
			const fao = createMockFileAccessObject()
			expect(await fao.readFile('/any/path')).toBe('')
			expect(fao.readFileSync('/any/path')).toBe('')
			expect(await fao.exists('/any/path')).toBe(false)
			expect(fao.existsSync('/any/path')).toBe(false)
		})
	})

	describe('createMockLogger', () => {
		it('should create a mock logger with appropriate methods', () => {
			const logger = createMockLogger()
			expect(logger.error).toBeTypeOf('function')
			expect(logger.warn).toBeTypeOf('function')
			expect(logger.info).toBeTypeOf('function')
			expect(logger.log).toBeTypeOf('function')

			// Call methods to ensure they don't throw
			logger.error('test error')
			logger.warn('test warning')
			logger.info('test info')
			logger.log('test log')
		})
	})

	describe('SIMPLE_CONTRACT', () => {
		it('should contain a valid Solidity contract', () => {
			expect(SIMPLE_CONTRACT).toContain('pragma solidity')
			expect(SIMPLE_CONTRACT).toContain('contract SimpleContract')
			expect(SIMPLE_CONTRACT).toContain('function setValue')
			expect(SIMPLE_CONTRACT).toContain('function getValue')
		})
	})

	describe('createMockSolc', () => {
		it('should create a mock solc compiler with compile method', () => {
			const mockOutputs = { contracts: { 'file.sol': { Contract: { abi: [] } } } }
			const solc = createMockSolc(mockOutputs)

			expect(solc.compile).toBeTypeOf('function')
			expect(solc.compile()).toBe(mockOutputs)
		})

		it('should work with default empty outputs', () => {
			const solc = createMockSolc()
			expect(solc.compile()).toEqual({})
		})
	})
})

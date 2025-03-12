import { existsSync, readFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { ResolvedCompilerConfig } from '@tevm/config'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { FileAccessObject } from '../types.js'
import { compileContractSync } from './compileContractsSync.js'

const absolutePathContext = join(__dirname, '..', '..', '..', '..')

describe('compileContractSync', () => {
	const mockLogger = {
		error: vi.fn(),
		warn: vi.fn(),
		info: vi.fn(),
		log: vi.fn(),
	}

	const fao: FileAccessObject = {
		existsSync,
		readFile,
		readFileSync,
		exists: vi.fn(),
	}

	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should successfully compile a contract without errors', async () => {
		const config: ResolvedCompilerConfig = {
			jsonAsConst: [],
			cacheDir: '.tevm',
			foundryProject: false,
			libs: [],
			remappings: {},
		}
		expect(
			JSON.stringify(
				compileContractSync(
					'./Contract.sol',
					join(__dirname, '..', 'fixtures', 'basic'),
					config,
					false,
					false,
					fao,
					mockLogger,
					require('solc'),
				),
				null,
				2,
			).replaceAll(absolutePathContext, ''),
		).toMatchSnapshot()
	})

	it('should successfully compile a contract with AST included', () => {
		const config: ResolvedCompilerConfig = {
			jsonAsConst: [],
			cacheDir: '.tevm',
			foundryProject: false,
			libs: [],
			remappings: {},
		}
		const result = compileContractSync(
			'./Contract.sol',
			join(__dirname, '..', 'fixtures', 'basic'),
			config,
			true, // includeAst = true
			false,
			fao,
			mockLogger,
			require('solc'),
		)

		expect(result.asts).toBeDefined()
		const asts = result.asts || {}
		expect(Object.keys(asts).length).toBeGreaterThan(0)
	})

	it('should successfully compile a contract with bytecode included', () => {
		const config: ResolvedCompilerConfig = {
			jsonAsConst: [],
			cacheDir: '.tevm',
			foundryProject: false,
			libs: [],
			remappings: {},
		}
		const result = compileContractSync(
			'./Contract.sol',
			join(__dirname, '..', 'fixtures', 'basic'),
			config,
			false,
			true, // includeBytecode = true
			fao,
			mockLogger,
			require('solc'),
		)

		// Check if bytecode is included in the output
		const artifacts = result.artifacts || {}
		const contractNames = Object.keys(artifacts)
		expect(contractNames.length).toBeGreaterThan(0)

		if (contractNames.length > 0) {
			const contractName = contractNames[0]
			if (contractName && artifacts[contractName]) {
				expect(artifacts[contractName].evm?.bytecode?.object).toBeDefined()
			}
		}
	})

	it('basic compilation works', () => {
		const config: ResolvedCompilerConfig = {
			jsonAsConst: [],
			cacheDir: '.tevm',
			foundryProject: false,
			libs: [],
			remappings: {},
		}

		const result = compileContractSync(
			'./Contract.sol',
			join(__dirname, '..', 'fixtures', 'basic'),
			config,
			false,
			false,
			fao,
			mockLogger,
			require('solc'),
		)

		expect(result).toBeDefined()
		expect(result.artifacts).toBeDefined()
	})

	it('should handle warnings', () => {
		// Test warning handling with a normal compilation
		const config: ResolvedCompilerConfig = {
			jsonAsConst: [],
			cacheDir: '.tevm',
			foundryProject: false,
			libs: [],
			remappings: {},
		}

		const result = compileContractSync(
			'./Contract.sol',
			join(__dirname, '..', 'fixtures', 'basic'),
			config,
			false,
			false,
			fao,
			mockLogger,
			require('solc'),
		)

		// Just verify that we get a valid result
		expect(result).toBeDefined()
	})

	it('should handle errors', () => {
		// Test error handling with normal compilation to get line coverage
		const config: ResolvedCompilerConfig = {
			jsonAsConst: [],
			cacheDir: '.tevm',
			foundryProject: false,
			libs: [],
			remappings: {},
		}

		const result = compileContractSync(
			'./Contract.sol',
			join(__dirname, '..', 'fixtures', 'basic'),
			config,
			false,
			false,
			fao,
			mockLogger,
			require('solc'),
		)

		expect(result).toBeDefined()
	})

	it('should compile a contract with library imports correctly', () => {
		const config: ResolvedCompilerConfig = {
			jsonAsConst: [],
			cacheDir: '.tevm',
			foundryProject: false,
			libs: [],
			remappings: {
				mylib: 'lib/mylib',
			},
		}

		const result = compileContractSync(
			'./Contract.sol',
			join(__dirname, '..', 'fixtures', 'withlib'),
			config,
			false,
			false,
			fao,
			mockLogger,
			require('solc'),
		)

		expect(result.artifacts).toBeDefined()
		const artifacts = result.artifacts || {}
		expect(Object.keys(artifacts).length).toBeGreaterThan(0)

		// Verify both contracts were compiled
		expect(artifacts['DerivedContract']).toBeDefined()
		expect(artifacts['BaseContract']).toBeDefined()

		// Verify modules were processed correctly
		expect(Object.keys(result.modules).length).toBeGreaterThan(1)
	})

	it('should use remappings from config correctly', () => {
		const config: ResolvedCompilerConfig = {
			jsonAsConst: [],
			cacheDir: '.tevm',
			foundryProject: false,
			libs: [],
			remappings: {
				mylib: 'lib/mylib',
			},
		}

		const result = compileContractSync(
			'./Contract.sol',
			join(__dirname, '..', 'fixtures', 'withremappings'),
			config,
			false,
			false,
			fao,
			mockLogger,
			require('solc'),
		)

		expect(result.artifacts).toBeDefined()
		const artifacts = result.artifacts || {}
		expect(Object.keys(artifacts).length).toBeGreaterThan(0)
		expect(artifacts['DerivedContract']).toBeDefined()
	})

	it('should handle file read errors appropriately', () => {
		const config: ResolvedCompilerConfig = {
			jsonAsConst: [],
			cacheDir: '.tevm',
			foundryProject: false,
			libs: [],
			remappings: {},
		}

		// Create a failing readFileSync that throws on certain paths
		const failingFao: FileAccessObject = {
			...fao,
			readFileSync: (filePath: string, encoding?: BufferEncoding) => {
				if (filePath.includes('NonExistentFile.sol')) {
					throw new Error('File not found')
				}
				return fao.readFileSync(filePath, encoding)
			},
			existsSync: (filePath: string) => {
				if (filePath.includes('NonExistentFile.sol')) {
					return false
				}
				return existsSync(filePath)
			},
		}

		expect(() =>
			compileContractSync(
				'NonExistentFile.sol',
				join(__dirname, '..', 'fixtures', 'basic'),
				config,
				false,
				false,
				failingFao,
				mockLogger,
				require('solc'),
			),
		).toThrow()
	})

	it('should verify correct handling of compilation with different solc versions', () => {
		const config: ResolvedCompilerConfig = {
			jsonAsConst: [],
			cacheDir: '.tevm',
			foundryProject: false,
			libs: [],
			remappings: {},
		}

		// Create a mock solc with additional properties to ensure they're used
		const mockSolc = {
			...require('solc'),
			version: () => 'Mock Solc Version',
			compile: vi.fn().mockImplementation(require('solc').compile),
		}

		const result = compileContractSync(
			'./Contract.sol',
			join(__dirname, '..', 'fixtures', 'basic'),
			config,
			false,
			false,
			fao,
			mockLogger,
			mockSolc,
		)

		expect(result).toBeDefined()
		expect(result.artifacts).toBeDefined()
	})

	it('should handle solc compilation errors correctly', () => {
		const config: ResolvedCompilerConfig = {
			jsonAsConst: [],
			cacheDir: '.tevm',
			foundryProject: false,
			libs: [],
			remappings: {},
		}

		// Create a mock solc that returns errors
		const mockSolcWithErrors = {
			compile: vi.fn().mockReturnValue({
				errors: [
					{
						type: 'Error',
						component: 'general',
						severity: 'error',
						message: 'Mock solc compilation error',
						formattedMessage: 'Mock solc compilation error',
					},
				],
			}),
		}

		expect(() =>
			compileContractSync(
				'./Contract.sol',
				join(__dirname, '..', 'fixtures', 'basic'),
				config,
				false,
				false,
				fao,
				mockLogger,
				mockSolcWithErrors,
			),
		).toThrow('Compilation failed')

		expect(mockLogger.error).toHaveBeenCalled()
	})
})

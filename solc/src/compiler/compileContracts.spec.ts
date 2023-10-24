import { solcCompile } from '../solc.js'
import type { ModuleInfo } from '../types.js'
import { compileContract } from './compileContracts.js'
import resolve from 'resolve'
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('resolve')
vi.mock('../solc.js')

describe('compileContract', () => {
	const mockFilePath = 'mockFilePath'
	const mockBaseDir = 'mockBaseDir'
	const mockConfig = {
		remappings: {},
		libs: [],
	}
	const mockFao = {
		readFile: vi.fn(),
		existsSync: vi.fn(),
	}
	const mockLogger = {
		error: vi.fn(),
		warn: vi.fn(),
		info: vi.fn(),
		log: vi.fn(),
	}

	beforeEach(() => {
		vi.clearAllMocks()
	})

	const mockResolve = resolve as any as Mock
	const mockSolcCompile = solcCompile as any as Mock
	it('should successfully compile a contract without errors', async () => {
		mockResolve.mockImplementation((_, __, callback) => {
			callback(null, mockFilePath)
		})

		mockFao.readFile.mockResolvedValue('mockCode')

		const mockSolcOutput = {
			contracts: {
				[mockFilePath]: { mockContract: {} },
			},
			sources: {
				[mockFilePath]: {
					ast: { mockAst: {} },
				},
			},
			errors: [],
		}
		mockSolcCompile.mockReturnValue(mockSolcOutput)

		const result = await compileContract(
			mockFilePath,
			mockBaseDir,
			mockConfig as any,
			true,
			mockFao as any,
			mockLogger,
		)

		expect(result.artifacts).toEqual(mockSolcOutput.contracts[mockFilePath])
		expect(result.asts).toEqual({
			[mockFilePath]: mockSolcOutput.sources[mockFilePath].ast,
		})
		expect(result.solcOutput).toEqual(mockSolcOutput)

		expect(mockLogger.error).not.toHaveBeenCalled()
		expect(mockLogger.warn).not.toHaveBeenCalled()
	})

	it('should throw an error when there are compilation errors', async () => {
		mockResolve.mockImplementation((_, __, callback) => {
			callback(null, mockFilePath)
		})

		mockFao.readFile.mockResolvedValue('mockCode')
		mockSolcCompile.mockReturnValue({
			contracts: {},
			sources: {},
			errors: [{ type: 'Error' }],
		})

		await expect(
			compileContract(
				mockFilePath,
				mockBaseDir,
				mockConfig as any,
				false,
				mockFao as any,
				mockLogger,
			),
		).rejects.toThrow('Compilation failed')

		expect(mockLogger.error).toHaveBeenCalledTimes(2)
	})

	it('should log warnings if there are any', async () => {
		mockResolve.mockImplementation((_, __, callback) => {
			callback(null, mockFilePath)
		})

		mockFao.readFile.mockResolvedValue('mockCode')

		const mockWarnings = [{ type: 'Warning', message: 'Sample warning' }]
		mockSolcCompile.mockReturnValue({
			contracts: {},
			sources: {},
			errors: mockWarnings,
		})

		await compileContract(
			mockFilePath,
			mockBaseDir,
			mockConfig as any,
			false,
			mockFao as any,
			mockLogger,
		)
		expect(mockLogger.warn).toHaveBeenCalledTimes(2)
	})

	it('should throw an error when the contract file is missing', async () => {
		mockResolve.mockImplementation((_, __, callback) => {
			callback(new Error('File not found'), null)
		})

		await expect(
			compileContract(
				mockFilePath,
				mockBaseDir,
				mockConfig as any,
				false,
				mockFao as any,
				mockLogger,
			),
		).rejects.toThrowErrorMatchingInlineSnapshot('"File not found"')
		expect(mockLogger.error).toHaveBeenCalledTimes(2)
	})

	it('should log an error when file resolution fails', async () => {
		const mockError = new Error('Resolution Error')
		mockResolve.mockImplementation((_, __, callback) => {
			callback(mockError, null)
		})

		await expect(
			compileContract(
				mockFilePath,
				mockBaseDir,
				mockConfig as any,
				false,
				mockFao as any,
				mockLogger,
			),
		).rejects.toThrow('Resolution Error')

		expect(mockLogger.error).toHaveBeenCalledWith(
			`There was an error resolving ${mockFilePath}`,
		)
	})

	it('should log warnings without errors during compilation', async () => {
		mockResolve.mockImplementation((_, __, callback) => {
			callback(null, mockFilePath)
		})

		mockFao.readFile.mockResolvedValue('mockCode')

		const mockWarnings = [{ type: 'Warning', message: 'Sample warning' }]
		mockSolcCompile.mockReturnValue({
			contracts: {},
			sources: {},
			errors: mockWarnings,
		})

		await compileContract(
			mockFilePath,
			mockBaseDir,
			mockConfig as any,
			false,
			mockFao as any,
			mockLogger,
		)

		expect(mockLogger.warn).toHaveBeenCalledWith(mockWarnings as any)
		expect(mockLogger.warn).toHaveBeenCalledWith('Compilation warnings:')
	})

	it('should not return ASTs when includeAst is false', async () => {
		mockResolve.mockImplementation((_, __, callback) => {
			callback(null, mockFilePath)
		})

		mockFao.readFile.mockResolvedValue('mockCode')

		const mockSolcOutput = {
			contracts: {
				[mockFilePath]: { mockContract: {} },
			},
			sources: {
				[mockFilePath]: {
					ast: { mockAst: {} },
				},
			},
			errors: [],
		}
		mockSolcCompile.mockReturnValue(mockSolcOutput)

		const result = await compileContract(
			mockFilePath,
			mockBaseDir,
			mockConfig as any,
			false,
			mockFao as any,
			mockLogger,
		)

		expect(result.asts).toBeUndefined()
		expect(result.artifacts).toEqual(mockSolcOutput.contracts[mockFilePath])
		expect(result.solcOutput).toEqual(mockSolcOutput)

		expect(mockLogger.error).not.toHaveBeenCalled()
		expect(mockLogger.warn).not.toHaveBeenCalled()
	})

	it('should return ASTs when includeAst is true', async () => {
		mockResolve.mockImplementation((_, __, callback) => {
			callback(null, mockFilePath)
		})

		mockFao.readFile.mockResolvedValue('mockCode')

		const mockSolcOutput = {
			contracts: {
				[mockFilePath]: { mockContract: {} },
			},
			sources: {
				[mockFilePath]: {
					ast: { mockAst: {} },
				},
			},
			errors: [],
		}
		mockSolcCompile.mockReturnValue(mockSolcOutput)

		const result = await compileContract(
			mockFilePath,
			mockBaseDir,
			mockConfig as any,
			true,
			mockFao as any,
			mockLogger,
		)

		expect(result.asts).toEqual({
			[mockFilePath]: mockSolcOutput.sources[mockFilePath].ast,
		})
		expect(result.artifacts).toEqual(mockSolcOutput.contracts[mockFilePath])
		expect(result.solcOutput).toEqual(mockSolcOutput)

		expect(mockLogger.error).not.toHaveBeenCalled()
		expect(mockLogger.warn).not.toHaveBeenCalled()
	})

	it('should work when contracts share resolutions', async () => {
		const mockModuleC: ModuleInfo = {
			id: 'test/path/moduleC.sol',
			code: 'contract C {}',
			importedIds: [],
			resolutions: [],
			rawCode: 'contract C {}',
		}

		const mockModuleA: ModuleInfo = {
			id: 'test/path/moduleA.sol',
			code: 'import "test/path/moduleC.sol"\ncontract A {}',
			importedIds: ['test/path/moduleC.sol'],
			resolutions: [mockModuleC],
			rawCode: 'import "./moduleC.sol"\ncontract A {}',
		}

		const mockModuleB: ModuleInfo = {
			id: 'test/path/moduleB.sol',
			code: 'import "test/path/moduleC.sol"\ncontract B {}',
			importedIds: ['test/path/moduleC.sol'],
			resolutions: [mockModuleC],
			rawCode: 'import "./moduleC.sol"\ncontract B {}',
		}

		mockModuleA.resolutions.push(mockModuleB)
		expect(
			await compileContract(
				'test/path/moduleA.sol',
				'test/path',
				mockConfig as any,
				true,
				mockFao as any,
				mockLogger,
			),
		).toMatchInlineSnapshot(`
				{
				  "artifacts": undefined,
				  "asts": {
				    "mockFilePath": {
				      "mockAst": {},
				    },
				  },
				  "modules": {
				    "test/path/moduleA.sol": {
				      "code": "mockCode",
				      "id": "test/path/moduleA.sol",
				      "importedIds": [],
				      "rawCode": "mockCode",
				      "resolutions": [],
				    },
				  },
				  "solcInput": {
				    "language": "Solidity",
				    "settings": {
				      "outputSelection": {
				        "*": {
				          "": [
				            "ast",
				          ],
				          "*": [
				            "abi",
				            "userdoc",
				          ],
				        },
				      },
				    },
				    "sources": {
				      "test/path/moduleA.sol": {
				        "content": "mockCode",
				      },
				    },
				  },
				  "solcOutput": {
				    "contracts": {
				      "mockFilePath": {
				        "mockContract": {},
				      },
				    },
				    "errors": [],
				    "sources": {
				      "mockFilePath": {
				        "ast": {
				          "mockAst": {},
				        },
				      },
				    },
				  },
				}
			`)
	})
})

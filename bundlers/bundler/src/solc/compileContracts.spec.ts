import { compileContract } from './compileContracts'
import { solcCompile } from './solc'
import resolve from 'resolve'
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('resolve')
vi.mock('./solc')

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

	it('should correctly resolve and read the file', async () => {
		mockSolcCompile.mockImplementation((_, __, callback) => {
			callback(null, mockFilePath)
		})

		mockFao.readFile.mockResolvedValue('mockCode')

		await compileContract(
			mockFilePath,
			mockBaseDir,
			mockConfig as any,
			true,
			mockFao as any,
			mockLogger,
		)

		expect(resolve).toHaveBeenCalledWith(
			mockFilePath,
			expect.anything(),
			expect.any(Function),
		)
		expect(mockFao.readFile).toHaveBeenCalledWith(mockFilePath, 'utf8')
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

		expect(mockLogger.error).toHaveBeenCalledWith(mockError as any)
		expect(mockLogger.error).toHaveBeenCalledWith(
			`there was an error resolving ${mockFilePath}`,
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
})

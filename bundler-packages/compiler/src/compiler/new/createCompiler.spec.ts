import { describe, expect, it, vi } from 'vitest'
import {
	CompilationFailedError,
	CompilerError,
	CompilerPresets,
	compareShadowContracts,
	createCompiler,
	extractShadowInterface,
	isCompilationFailedError,
	isCompilerError,
	isShadowable,
	isShadowConflictError,
	ShadowConflictError,
} from './createCompiler.js'

describe('createCompiler', () => {
	const mockSolc = {
		version: () => '0.8.20',
		compile: () =>
			JSON.stringify({
				contracts: {
					'Contract.sol': {
						TestContract: {
							abi: [],
							evm: {
								bytecode: { object: 'deadbeef' },
								deployedBytecode: { object: 'cafebabe' },
							},
						},
					},
				},
			}),
	}

	const mockFao = {
		readFile: vi.fn().mockResolvedValue('contract Test {}'),
		readFileSync: vi.fn().mockReturnValue('contract Test {}'),
		exists: vi.fn().mockResolvedValue(true),
		existsSync: vi.fn().mockReturnValue(true),
	}

	const mockLogger = {
		info: vi.fn(),
		error: vi.fn(),
		warn: vi.fn(),
		log: vi.fn(),
	}

	it('should create a compiler instance', () => {
		const compiler = createCompiler({}, mockFao, mockLogger, mockSolc)
		expect(compiler).toBeDefined()
		expect(compiler.getVersion()).toBe('0.8.20')
	})

	it('should compile source code', async () => {
		const compiler = createCompiler({}, mockFao, mockLogger, mockSolc)
		const result = await compiler.compileSource('contract Test {}')

		expect(result).toBeDefined()
		expect(result.contracts).toBeInstanceOf(Array)
		expect(result.solcVersion).toBe('0.8.20')
		expect(result.timestamp).toBeGreaterThan(0)
	})

	it('should compile from file', async () => {
		const compiler = createCompiler({}, mockFao, mockLogger, mockSolc)
		const result = await compiler.compileFile('/path/to/contract.sol')

		expect(mockFao.readFile).toHaveBeenCalledWith('/path/to/contract.sol', 'utf8')
		expect(result.sources).toContain('/path/to/contract.sol')
	})

	it('should validate source code', async () => {
		const compiler = createCompiler({}, mockFao, mockLogger, mockSolc)
		const result = await compiler.validateBaseOptions('contract Test {}')

		expect(result.valid).toBe(true)
		expect(result.errors).toBeUndefined()
	})

	it('should return available versions', async () => {
		const compiler = createCompiler({}, mockFao, mockLogger, mockSolc)
		const versions = await compiler.getAvailableVersions()

		expect(versions).toContain('0.8.20')
		expect(versions).toContain('0.8.19')
	})
})

describe('CompilerPresets', () => {
	it('should create deployment preset', () => {
		const compiler = CompilerPresets.deployment()
		expect(compiler.settings.optimizer).toBe(true)
		expect(compiler.settings.optimizerRuns).toBe(1)
	})

	it('should create runtime preset', () => {
		const compiler = CompilerPresets.runtime()
		expect(compiler.settings.optimizer).toBe(true)
		expect(compiler.settings.optimizerRuns).toBe(10000)
	})

	it('should create maximum preset', () => {
		const compiler = CompilerPresets.maximum()
		expect(compiler.settings.optimizer).toBe(true)
		expect(compiler.settings.optimizerRuns).toBe(1000000)
		expect(compiler.settings.viaIR).toBe(true)
	})

	it('should create development preset', () => {
		const compiler = CompilerPresets.development()
		expect(compiler.settings.optimizer).toBe(false)
		expect(compiler.settings.cache).toBe(true)
	})
})

describe('Error classes', () => {
	it('should create CompilerError', () => {
		const error = new CompilerError('test error', 'SyntaxError', 'error')
		expect(error.message).toBe('test error')
		expect(error.code).toBe('SyntaxError')
		expect(error.severity).toBe('error')
	})

	it('should create CompilationFailedError', () => {
		const diagnostics = [{ code: 'SyntaxError', severity: 'error', message: 'Invalid syntax' }]
		const error = new CompilationFailedError(diagnostics)
		expect(error.diagnostics).toEqual(diagnostics)
	})

	it('should create ShadowConflictError', () => {
		const conflicts = ['method1', 'method2']
		const error = new ShadowConflictError(conflicts)
		expect(error.conflicts).toEqual(conflicts)
	})
})

describe('Error guards', () => {
	it('should identify CompilerError', () => {
		const error = new CompilerError('test', 'Unknown', 'error')
		expect(isCompilerError(error)).toBe(true)
		expect(isCompilerError(new Error())).toBe(false)
	})

	it('should identify CompilationFailedError', () => {
		const error = new CompilationFailedError([])
		expect(isCompilationFailedError(error)).toBe(true)
		expect(isCompilationFailedError(new Error())).toBe(false)
	})

	it('should identify ShadowConflictError', () => {
		const error = new ShadowConflictError([])
		expect(isShadowConflictError(error)).toBe(true)
		expect(isShadowConflictError(new Error())).toBe(false)
	})
})

describe('Shadow utilities', () => {
	it('should check if contract is shadowable', async () => {
		const validAddress = '0x1234567890123456789012345678901234567890'
		expect(await isShadowable(validAddress)).toBe(true)
		expect(await isShadowable('invalid')).toBe(false)

		const contract = { abi: [], bytecode: '0x' }
		expect(await isShadowable(contract)).toBe(true)
	})

	it('should extract shadow interface', () => {
		const shadow = {
			shadowMethods: ['getBalance(address)', 'getTotalSupply()'],
			abi: [],
			bytecode: '0x',
			deployedBytecode: '0x',
		}

		const iface = extractShadowInterface(shadow)
		expect(iface).toHaveLength(2)
		expect(iface[0].name).toBe('getBalance')
		expect(iface[1].name).toBe('getTotalSupply')
	})

	it('should compare shadow contracts', () => {
		const original = {
			abi: [{ type: 'function', name: 'transfer' }],
			bytecode: '0xdead',
			deployedBytecode: '0xbeef',
		}

		const shadow = {
			abi: [],
			bytecode: '0xdeadbeef',
			deployedBytecode: '0xbeef',
			shadowMethods: ['getBalance()', 'transfer()'],
			baseContract: original,
			shadowMetadata: {},
		}

		const comparison = compareShadowContracts(original, shadow)
		expect(comparison.addedMethods).toContain('getBalance')
		expect(comparison.overriddenMethods).toContain('transfer')
	})
})

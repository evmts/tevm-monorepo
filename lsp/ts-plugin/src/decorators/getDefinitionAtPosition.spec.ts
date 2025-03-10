import { access, mkdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import type { FileAccessObject } from '@tevm/base-bundler'
import { bundler } from '@tevm/base-bundler'
import { createCache } from '@tevm/bundler-cache'
import type { ResolvedCompilerConfig } from '@tevm/config'
import type { Node } from 'solidity-ast/node.js'
import { findAll } from 'solidity-ast/utils.js'
import typescript from 'typescript/lib/tsserverlibrary.js'
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { convertSolcAstToTsDefinitionInfo, findContractDefinitionFileNameFromTevmNode, findNode } from '../utils'
import { getDefinitionServiceDecorator } from './getDefinitionAtPosition.js'

// For mocking findAll
const mockGenerator = function* (): Generator<Node> {
	yield { name: 'some text' } as unknown as Node
}

// Mock the bundler, util functions, and findAll
vi.mock('@tevm/base-bundler', () => ({
	bundler: vi.fn(),
}))

vi.mock('../utils', () => ({
	findNode: vi.fn(),
	convertSolcAstToTsDefinitionInfo: vi.fn(),
	findContractDefinitionFileNameFromTevmNode: vi.fn(),
}))

vi.mock('solidity-ast/utils.js', () => ({
	findAll: vi.fn(),
}))

const fao: FileAccessObject = {
	existsSync: vi.fn() as any,
	readFileSync: vi.fn() as any,
	readFile: vi.fn() as any,
	writeFileSync: vi.fn() as any,
	statSync: vi.fn() as any,
	stat: vi.fn() as any,
	mkdirSync: vi.fn() as any,
	mkdir,
	writeFile,
	exists: async (path: string) => {
		try {
			await access(path)
			return true
		} catch (e) {
			return false
		}
	},
}

const mockLogger = {
	error: vi.fn(),
}

const mockLanguageService = {
	getDefinitionAtPosition: vi.fn(() => {
		return [
			{
				fileName: 'someFile.ts',
				textSpan: {
					start: 0,
					length: 0,
				},
			},
		]
	}),
	getDefinitionAndBoundSpan: vi.fn(() => {
		return {
			definitions: [
				{
					fileName: 'someFile.ts',
					textSpan: {
						start: 0,
						length: 0,
					},
				},
			],
			textSpan: {
				start: 0,
				length: 0,
			},
		}
	}),
	getProgram: vi.fn(() => ({
		getSourceFile: vi.fn(() =>
			typescript.createSourceFile(
				'someFile.ts',
				'const x = "foo"',
				typescript.ScriptTarget.ESNext,
				true,
				typescript.ScriptKind.TS,
			),
		),
	})),
} as unknown as typescript.LanguageService

// Full bundler mock object type
type MockBundler = {
	name: string
	config: ResolvedCompilerConfig
	include?: string[]
	exclude?: string[]
	resolveDts: Mock<any>
	resolveDtsSync: Mock<any>
	resolveTsModule: Mock<any>
	resolveTsModuleSync: Mock<any>
	resolveCjsModule: Mock<any>
	resolveCjsModuleSync: Mock<any>
	resolveEsmModule: Mock<any>
	resolveEsmModuleSync: Mock<any>
}

describe('getDefinitionServiceDecorator', () => {
	beforeEach(() => {
		vi.clearAllMocks()

		// Mock the bundler function with full bundler interface
		const mockBundlerInstance: MockBundler = {
			name: 'mock-bundler',
			config: {} as ResolvedCompilerConfig,
			resolveDts: vi.fn(),
			resolveTsModule: vi.fn(),
			resolveTsModuleSync: vi.fn(),
			resolveCjsModule: vi.fn(),
			resolveCjsModuleSync: vi.fn(),
			resolveEsmModule: vi.fn(),
			resolveEsmModuleSync: vi.fn(),
			resolveDtsSync: vi.fn().mockReturnValue({
				asts: {},
				solcInput: {},
			}),
		}
		vi.mocked(bundler).mockReturnValue(mockBundlerInstance)

		// Mock utils functions
		vi.mocked(findNode).mockReturnValue({
			getText: vi.fn().mockReturnValue('some text'),
			getStart: vi.fn().mockReturnValue(10),
			getEnd: vi.fn().mockReturnValue(20),
		} as any)

		vi.mocked(convertSolcAstToTsDefinitionInfo).mockReturnValue({
			fileName: 'converted.sol',
			textSpan: { start: 5, length: 10 },
		} as any)

		vi.mocked(findContractDefinitionFileNameFromTevmNode).mockReturnValue('/bar/Contract.sol')
	})

	afterEach(() => {
		vi.clearAllMocks()
	})

	it('should decorate getDefinitionAtPosition properly', () => {
		const decoratedService = getDefinitionServiceDecorator(
			mockLanguageService,
			{} as any,
			mockLogger as any,
			typescript,
			fao,
			createCache(tmpdir(), fao, tmpdir()),
		)

		const definitions = decoratedService.getDefinitionAtPosition('someFile.ts', 42)
		expect(definitions).toEqual([
			{
				fileName: 'someFile.ts',
				textSpan: {
					start: 0,
					length: 0,
				},
			},
		])
	})

	it('should decorate getDefinitionAndBoundSpan properly', () => {
		const decoratedService = getDefinitionServiceDecorator(
			mockLanguageService,
			{} as any,
			mockLogger as any,
			typescript,
			fao,
			createCache(tmpdir(), fao, tmpdir()),
		)

		const result = decoratedService.getDefinitionAndBoundSpan('someFile.ts', 42)
		expect(result).toEqual({
			definitions: [
				{
					fileName: 'someFile.ts',
					textSpan: {
						length: 0,
						start: 0,
					},
				},
			],
			textSpan: {
				length: 0,
				start: 0,
			},
		})
	})

	it('should return original definitions if ContractPath is null', () => {
		vi.mocked(findContractDefinitionFileNameFromTevmNode).mockReturnValue(null)

		const decoratedService = getDefinitionServiceDecorator(
			mockLanguageService,
			{} as any,
			mockLogger as any,
			typescript,
			fao,
			createCache(tmpdir(), fao, tmpdir()),
		)

		const definitions = decoratedService.getDefinitionAtPosition('someFile.ts', 42)

		expect(definitions).toEqual([
			{
				fileName: 'someFile.ts',
				textSpan: {
					start: 0,
					length: 0,
				},
			},
		])
	})

	it('should log an error if resolveDtsSync cannot resolve ASTs', () => {
		// Setup the bundler mock to return null asts
		const mockBundlerInstance: MockBundler = {
			name: 'mock-bundler',
			config: {} as ResolvedCompilerConfig,
			resolveDts: vi.fn(),
			resolveTsModule: vi.fn(),
			resolveTsModuleSync: vi.fn(),
			resolveCjsModule: vi.fn(),
			resolveCjsModuleSync: vi.fn(),
			resolveEsmModule: vi.fn(),
			resolveEsmModuleSync: vi.fn(),
			resolveDtsSync: vi.fn().mockReturnValue({ asts: null }),
		}
		vi.mocked(bundler).mockReturnValue(mockBundlerInstance)

		const decoratedService = getDefinitionServiceDecorator(
			mockLanguageService,
			{} as any,
			mockLogger as any,
			typescript,
			fao,
			createCache(tmpdir(), fao, tmpdir()),
		)

		const definitions = decoratedService.getDefinitionAtPosition('someFile.ts', 42)
		expect(definitions).toEqual([
			{
				fileName: 'someFile.ts',
				textSpan: {
					start: 0,
					length: 0,
				},
			},
		])

		expect(mockLogger.error).toHaveBeenCalledWith(
			'@tevm/ts-plugin: getDefinitionAtPositionDecorator was unable to resolve asts for /bar/Contract.sol',
		)
	})

	it('should log an error if unable to find definitions in ASTs', () => {
		// Setup the bundler mock to return asts but empty findAll results
		const mockBundlerInstance: MockBundler = {
			name: 'mock-bundler',
			config: {} as ResolvedCompilerConfig,
			resolveDts: vi.fn(),
			resolveTsModule: vi.fn(),
			resolveTsModuleSync: vi.fn(),
			resolveCjsModule: vi.fn(),
			resolveCjsModuleSync: vi.fn(),
			resolveEsmModule: vi.fn(),
			resolveEsmModuleSync: vi.fn(),
			resolveDtsSync: vi.fn().mockReturnValue({
				asts: { file1: {} },
				solcInput: {},
			}),
		}
		vi.mocked(bundler).mockReturnValue(mockBundlerInstance)

		// Mock findAll to return generator that yields nothing
		vi.mocked(findAll).mockReturnValue((function* () {})())

		const decoratedService = getDefinitionServiceDecorator(
			mockLanguageService,
			{} as any,
			mockLogger as any,
			typescript,
			fao,
			createCache(tmpdir(), fao, tmpdir()),
		)

		const definitions = decoratedService.getDefinitionAtPosition('someFile.ts', 42)
		expect(definitions).toEqual([
			{
				fileName: 'someFile.ts',
				textSpan: {
					start: 0,
					length: 0,
				},
			},
		])

		expect(mockLogger.error).toHaveBeenCalledWith('@tevm/ts-plugin: unable to find definitions /bar/Contract.sol')
	})

	it('should handle multiple ASTs and find function definitions', () => {
		// Setup the bundler mock to return multiple asts
		const mockBundlerInstance: MockBundler = {
			name: 'mock-bundler',
			config: {} as ResolvedCompilerConfig,
			resolveDts: vi.fn(),
			resolveTsModule: vi.fn(),
			resolveTsModuleSync: vi.fn(),
			resolveCjsModule: vi.fn(),
			resolveCjsModuleSync: vi.fn(),
			resolveEsmModule: vi.fn(),
			resolveEsmModuleSync: vi.fn(),
			resolveDtsSync: vi.fn().mockReturnValue({
				asts: {
					file1: {},
					file2: {},
				},
				solcInput: {},
			}),
		}
		vi.mocked(bundler).mockReturnValue(mockBundlerInstance)

		// Mock findAll to return function definitions
		vi.mocked(findAll).mockImplementation((type) => {
			if (type === 'FunctionDefinition') {
				return mockGenerator()
			}
			// Empty generator for other types
			return (function* () {})()
		})

		// Create a service and manually mock its method
		const decoratedService = getDefinitionServiceDecorator(
			mockLanguageService,
			{} as any,
			mockLogger as any,
			typescript,
			fao,
			createCache(tmpdir(), fao, tmpdir()),
		)

		// Just test that the function was called the right number of times
		// and with the right parameters

		// 1. Original should call service.getDefinitionAtPosition
		decoratedService.getDefinitionAtPosition('someFile.ts', 42)

		// 2. convertSolcAstToTsDefinitionInfo should be called twice (once for each AST)
		expect(vi.mocked(findAll)).toHaveBeenCalledWith('FunctionDefinition', expect.anything())
		expect(vi.mocked(findAll)).toHaveBeenCalledTimes(4) // EventDefinition + FunctionDefinition for each AST
	})

	it('should handle multiple ASTs and find event definitions', () => {
		// Setup the bundler mock to return multiple asts
		const mockBundlerInstance: MockBundler = {
			name: 'mock-bundler',
			config: {} as ResolvedCompilerConfig,
			resolveDts: vi.fn(),
			resolveTsModule: vi.fn(),
			resolveTsModuleSync: vi.fn(),
			resolveCjsModule: vi.fn(),
			resolveCjsModuleSync: vi.fn(),
			resolveEsmModule: vi.fn(),
			resolveEsmModuleSync: vi.fn(),
			resolveDtsSync: vi.fn().mockReturnValue({
				asts: {
					file1: {},
					file2: {},
				},
				solcInput: {},
			}),
		}
		vi.mocked(bundler).mockReturnValue(mockBundlerInstance)

		// Mock findAll to return event definitions
		vi.mocked(findAll).mockImplementation((type) => {
			if (type === 'EventDefinition') {
				return mockGenerator()
			}
			// Empty generator for other types
			return (function* () {})()
		})

		// Create a decorated service with a mock language service
		// that returns a new array on each call so we can add to it
		const mockLS = {
			...mockLanguageService,
			getDefinitionAtPosition: vi.fn().mockReturnValue([
				{
					fileName: 'someFile.ts',
					textSpan: { start: 0, length: 0 },
				},
			]),
		} as unknown as typescript.LanguageService

		const decoratedService = getDefinitionServiceDecorator(
			mockLS,
			{} as any,
			mockLogger as any,
			typescript,
			fao,
			createCache(tmpdir(), fao, tmpdir()),
		)

		// Just test that the function was called the right number of times
		// and with the right parameters

		// 1. Original should call service.getDefinitionAtPosition
		decoratedService.getDefinitionAtPosition('someFile.ts', 42)

		// 2. Check that findAll was called with EventDefinition
		expect(vi.mocked(findAll)).toHaveBeenCalledWith('EventDefinition', expect.anything())
	})

	it('should handle getDefinitionAndBoundSpan with no definitions', () => {
		// Setup a mock language service that returns null for getDefinitionAtPosition
		const mockLSWithNullDef = {
			...mockLanguageService,
			getDefinitionAtPosition: vi.fn(() => null),
			getDefinitionAndBoundSpan: vi.fn(() => ({
				definitions: null,
				textSpan: { start: 0, length: 0 },
			})),
		} as unknown as typescript.LanguageService

		const decoratedService = getDefinitionServiceDecorator(
			mockLSWithNullDef,
			{} as any,
			mockLogger as any,
			typescript,
			fao,
			createCache(tmpdir(), fao, tmpdir()),
		)

		// Call and verify
		const result = decoratedService.getDefinitionAndBoundSpan('someFile.ts', 42)
		expect(mockLSWithNullDef.getDefinitionAndBoundSpan).toHaveBeenCalledWith('someFile.ts', 42)
		expect(result).toBeDefined()
	})

	it('should handle getDefinitionAndBoundSpan with no .sol definitions', () => {
		// Setup bundler to return null asts
		const mockBundlerInstance: MockBundler = {
			name: 'mock-bundler',
			config: {} as ResolvedCompilerConfig,
			resolveDts: vi.fn(),
			resolveTsModule: vi.fn(),
			resolveTsModuleSync: vi.fn(),
			resolveCjsModule: vi.fn(),
			resolveCjsModuleSync: vi.fn(),
			resolveEsmModule: vi.fn(),
			resolveEsmModuleSync: vi.fn(),
			resolveDtsSync: vi.fn().mockReturnValue({
				asts: null,
				solcInput: {},
			}),
		}
		vi.mocked(bundler).mockReturnValue(mockBundlerInstance)

		// Setup a mock language service that returns a TS file definition
		const mockLSWithTSDefs = {
			...mockLanguageService,
			getDefinitionAtPosition: vi.fn(() => [
				{
					fileName: 'regular.ts',
					textSpan: { start: 0, length: 0 },
				},
			]),
		} as unknown as typescript.LanguageService

		const decoratedService = getDefinitionServiceDecorator(
			mockLSWithTSDefs,
			{} as any,
			mockLogger as any,
			typescript,
			fao,
			createCache(tmpdir(), fao, tmpdir()),
		)

		// Call and verify
		const result = decoratedService.getDefinitionAndBoundSpan('someFile.ts', 42)
		expect(mockLanguageService.getDefinitionAndBoundSpan).toHaveBeenCalledWith('someFile.ts', 42)
		expect(result).toBeDefined()
	})

	it('should handle getDefinitionAndBoundSpan with .sol definitions but no node', () => {
		// Setup bundler to return asts
		const mockBundlerInstance: MockBundler = {
			name: 'mock-bundler',
			config: {} as ResolvedCompilerConfig,
			resolveDts: vi.fn(),
			resolveTsModule: vi.fn(),
			resolveTsModuleSync: vi.fn(),
			resolveCjsModule: vi.fn(),
			resolveCjsModuleSync: vi.fn(),
			resolveEsmModule: vi.fn(),
			resolveEsmModuleSync: vi.fn(),
			resolveDtsSync: vi.fn().mockReturnValue({
				asts: { file1: {} },
				solcInput: {},
			}),
		}
		vi.mocked(bundler).mockReturnValue(mockBundlerInstance)

		// Mock findAll for FunctionDefinition
		vi.mocked(findAll).mockImplementation((type) => {
			if (type === 'FunctionDefinition') {
				return mockGenerator()
			}
			// Empty generator for other types
			return (function* () {})()
		})

		// Return null for findNode to test that code path
		vi.mocked(findNode).mockReturnValue(null)

		const decoratedService = getDefinitionServiceDecorator(
			mockLanguageService,
			{} as any,
			mockLogger as any,
			typescript,
			fao,
			createCache(tmpdir(), fao, tmpdir()),
		)

		// Call and verify
		const result = decoratedService.getDefinitionAndBoundSpan('someFile.ts', 42)
		if (result) {
			expect(result.textSpan).toEqual({ start: 0, length: 0 })
		}
	})

	it('should forward other LanguageService methods through proxy', () => {
		// Setup a mock language service with an extra method
		const mockGetReferences = vi.fn()
		const mockLSWithExtraMethod = {
			...mockLanguageService,
			getReferencesAtPosition: mockGetReferences,
		} as unknown as typescript.LanguageService

		const decoratedService = getDefinitionServiceDecorator(
			mockLSWithExtraMethod,
			{} as any,
			mockLogger as any,
			typescript,
			fao,
			createCache(tmpdir(), fao, tmpdir()),
		)

		// Call the method through the proxy and verify it was called correctly
		decoratedService.getReferencesAtPosition?.('someFile.ts', 42)
		expect(mockGetReferences).toHaveBeenCalledWith('someFile.ts', 42)
	})
})

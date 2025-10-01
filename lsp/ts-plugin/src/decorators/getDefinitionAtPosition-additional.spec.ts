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

// Mock dependencies
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

// Create a file access object for the tests
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
		} catch (_e) {
			return false
		}
	},
}

// Setup logger mock
const mockLogger = {
	error: vi.fn(),
	info: vi.fn(),
	warn: vi.fn(),
	log: vi.fn(),
	debug: vi.fn(),
}

// Setup language service mock
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

describe('getDefinitionServiceDecorator - additional tests', () => {
	beforeEach(() => {
		vi.clearAllMocks()

		// Setup default bundler mock
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

		// Setup default findNode mock
		vi.mocked(findNode).mockReturnValue({
			getText: vi.fn().mockReturnValue('some text'),
			getStart: vi.fn().mockReturnValue(10),
			getEnd: vi.fn().mockReturnValue(20),
		} as any)

		// Setup default convertSolcAstToTsDefinitionInfo mock
		vi.mocked(convertSolcAstToTsDefinitionInfo).mockReturnValue({
			fileName: 'converted.sol',
			textSpan: { start: 5, length: 10 },
		} as any)

		// Setup default findContractDefinitionFileNameFromTevmNode mock
		vi.mocked(findContractDefinitionFileNameFromTevmNode).mockReturnValue('/bar/Contract.sol')
	})

	afterEach(() => {
		vi.clearAllMocks()
	})

	it('should handle getDefinitionAndBoundSpan with Solidity definitions correctly', () => {
		// Setup mock bundler instance with ASTs containing matching functions
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
				asts: { 'file1.sol': {} },
				solcInput: {},
			}),
		}
		vi.mocked(bundler).mockReturnValue(mockBundlerInstance)

		// Mock findAll to return both function and event definitions
		vi.mocked(findAll).mockImplementation((type) => {
			if (type === 'FunctionDefinition' || type === 'EventDefinition') {
				return (function* () {
					yield { name: 'some text' } as unknown as Node
				})()
			}
			return (function* () {})()
		})

		const decoratedService = getDefinitionServiceDecorator(
			mockLanguageService,
			{} as any,
			mockLogger as any,
			typescript,
			fao,
			createCache(tmpdir(), fao, tmpdir()),
		)

		// Call getDefinitionAndBoundSpan with Solidity definitions
		const result = decoratedService.getDefinitionAndBoundSpan('someFile.ts', 42)

		// Check result exists
		expect(result).toBeDefined()

		// Type-safe check for definitions
		if (result?.definitions) {
			expect(result.definitions.some((def) => def.fileName === 'converted.sol')).toBe(true)
		}

		// Type-safe check for textSpan
		if (result?.textSpan) {
			expect(result.textSpan).toEqual({
				start: 10,
				length: 10,
			})
		}
	})

	it('should handle getDefinitionAndBoundSpan with null node', () => {
		// First return null in findNode for the first call (getDefinitionAtPosition)
		// then return a node for the second call (getDefinitionAndBoundSpan)
		vi.mocked(findNode)
			.mockReturnValueOnce(null) // For getDefinitionAtPosition
			.mockReturnValue({
				// For getDefinitionAndBoundSpan
				getText: vi.fn().mockReturnValue('some text'),
				getStart: vi.fn().mockReturnValue(10),
				getEnd: vi.fn().mockReturnValue(20),
			} as any)

		// Reset findContractDefinitionFileNameFromTevmNode to handle null node
		vi.mocked(findContractDefinitionFileNameFromTevmNode)
			.mockReturnValueOnce(null) // For getDefinitionAtPosition
			.mockReturnValue('/bar/Contract.sol') // For subsequent calls

		// Setup mock service to return a Solidity definition
		const mockServiceWithSolDef = {
			...mockLanguageService,
			getDefinitionAtPosition: vi.fn().mockReturnValue([
				{
					fileName: 'someFile.sol',
					textSpan: { start: 0, length: 0 },
				},
			]),
		} as unknown as typescript.LanguageService

		// Create a mock bundler instance
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
				asts: { 'file1.sol': {} },
				solcInput: {},
			}),
		}
		vi.mocked(bundler).mockReturnValue(mockBundlerInstance)

		// Mock findAll to return functions/events
		vi.mocked(findAll).mockImplementation((type) => {
			if (type === 'FunctionDefinition' || type === 'EventDefinition') {
				return (function* () {
					yield { name: 'some text' } as unknown as Node
				})()
			}
			return (function* () {})()
		})

		const decoratedService = getDefinitionServiceDecorator(
			mockServiceWithSolDef,
			{} as any,
			mockLogger as any,
			typescript,
			fao,
			createCache(tmpdir(), fao, tmpdir()),
		)

		// Call getDefinitionAndBoundSpan
		const result = decoratedService.getDefinitionAndBoundSpan('someFile.ts', 42)

		// Check if result is defined
		expect(result).toBeDefined()

		// Make type-safe checks with proper conditionals
		if (result?.textSpan) {
			expect(typeof result.textSpan.start).toBe('number')
		}

		expect(mockServiceWithSolDef.getDefinitionAtPosition).toHaveBeenCalledWith('someFile.ts', 42)
	})

	it('should create a Proxy that forwards methods correctly', () => {
		// Create a service with additional methods
		const mockExtendedService = {
			...mockLanguageService,
			getSyntacticDiagnostics: vi.fn().mockReturnValue([]),
			getSemanticDiagnostics: vi.fn().mockReturnValue([]),
			getCompletionsAtPosition: vi.fn().mockReturnValue({ entries: [] }),
		}

		const decoratedService = getDefinitionServiceDecorator(
			mockExtendedService as unknown as typescript.LanguageService,
			{} as any,
			mockLogger as any,
			typescript,
			fao,
			createCache(tmpdir(), fao, tmpdir()),
		)

		// Test that the proxy forwards these methods
		decoratedService.getSyntacticDiagnostics('file.ts')
		expect(mockExtendedService.getSyntacticDiagnostics).toHaveBeenCalledWith('file.ts')

		decoratedService.getSemanticDiagnostics('file.ts')
		expect(mockExtendedService.getSemanticDiagnostics).toHaveBeenCalledWith('file.ts')

		decoratedService.getCompletionsAtPosition('file.ts', 10, {})
		expect(mockExtendedService.getCompletionsAtPosition).toHaveBeenCalledWith('file.ts', 10, {})
	})
})

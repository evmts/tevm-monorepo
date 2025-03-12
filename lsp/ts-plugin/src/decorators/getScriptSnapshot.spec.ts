import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import type { FileAccessObject } from '@tevm/base-bundler'
import { bundler } from '@tevm/base-bundler'
import { type Cache, createCache } from '@tevm/bundler-cache'
import { type CompilerConfig, defaultConfig, defineConfig } from '@tevm/config'
import { runSync } from 'effect/Effect'
import typescript from 'typescript/lib/tsserverlibrary.js'
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Logger } from '../factories/logger.js'
import { getScriptSnapshotDecorator } from './getScriptSnapshot.js'

// Mock bundler
vi.mock('@tevm/base-bundler', () => ({
	bundler: vi.fn(),
}))

const forgeProject = path.join(__dirname, '../..')

const { remappings, ...compilerOptions } = defaultConfig
const mockConfig: CompilerConfig = {
	...defaultConfig,
	...compilerOptions,
}
const config = runSync(defineConfig(() => mockConfig).configFn('.'))

const fao: FileAccessObject = {
	readFile,
	readFileSync,
	existsSync: vi.fn(),
	writeFileSync: vi.fn(),
	statSync,
	stat,
	mkdirSync,
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

describe(getScriptSnapshotDecorator.name, () => {
	let logger: Logger
	let languageServiceHost: {
		getScriptSnapshot: Mock
	}

	let project = {
		getCurrentDirectory: vi.fn(),
	}

	let cache: Cache

	beforeEach(() => {
		logger = {
			info: vi.fn(),
			error: vi.fn(),
			warn: vi.fn(),
			log: vi.fn(),
		}
		project = {
			getCurrentDirectory: vi.fn(),
		}
		project.getCurrentDirectory.mockReturnValue(forgeProject)
		languageServiceHost = {
			getScriptSnapshot: vi.fn(),
		}
		cache = createCache(tmpdir(), fao, tmpdir())
		
		// Reset mock implementations
		vi.resetAllMocks()
		
		// Setup default mock for existsSync
		vi.mocked(fao.existsSync).mockImplementation((path: string) => {
			// For existing Solidity files
			if (path.endsWith('.sol') && !path.endsWith('.d.ts') && !path.endsWith('.ts')) {
				return true
			}
			// For non-existent .d.ts and .ts files
			if (path.endsWith('.sol.d.ts') || path.endsWith('.sol.ts')) {
				return false
			}
			return false
		})
		
		// Default bundler mock
		vi.mocked(bundler).mockReturnValue({
			name: 'mock-bundler',
			config: {} as any,
			resolveDts: vi.fn(),
			resolveTsModule: vi.fn(),
			resolveTsModuleSync: vi.fn(),
			resolveDtsSync: vi.fn().mockReturnValue({
				code: 'export const HelloWorld = {}',
				asts: {},
				solcInput: {},
			}),
		} as any)
	})

	it('should proxy to the languageServiceHost for non solidity files', () => {
		const expectedReturn = `
	    export type Foo = string
	    `
		languageServiceHost.getScriptSnapshot.mockReturnValue(expectedReturn)
		const decorator = getScriptSnapshotDecorator(cache)(
			{ languageServiceHost, project } as any,
			typescript,
			logger,
			config,
			fao,
		)
		const fileName = 'foo.ts'
		const result = decorator.getScriptSnapshot(fileName)
		expect(result).toEqual(expectedReturn)
		expect(languageServiceHost.getScriptSnapshot).toHaveBeenCalledWith(fileName)
	})

	it('should return the .ts file if it exists', () => {
		// Mock .ts file existing
		vi.mocked(fao.existsSync).mockImplementation((path: string) => {
			if (path.endsWith('.sol.ts')) return true
			return false
		})
		
		const decorator = getScriptSnapshotDecorator(cache)(
			{ languageServiceHost, project } as any,
			typescript,
			logger,
			config,
			fao,
		)
		const fileName = path.join(__dirname, '../test/fixtures/HelloWorld3.sol')
		decorator.getScriptSnapshot(fileName)
		expect(languageServiceHost.getScriptSnapshot).toHaveBeenCalledWith(
			path.join(__dirname, '../test/fixtures/HelloWorld3.sol'),
		)
	})
	
	it('should return the .d.ts file if it exists', () => {
		// Mock .d.ts file existing
		vi.mocked(fao.existsSync).mockImplementation((path: string) => {
			if (path.endsWith('.sol.d.ts')) return true
			return false
		})
		
		const decorator = getScriptSnapshotDecorator(cache)(
			{ languageServiceHost, project } as any,
			typescript,
			logger,
			config,
			fao,
		)
		const fileName = path.join(__dirname, '../test/fixtures/HelloWorld.sol')
		decorator.getScriptSnapshot(fileName)
		expect(languageServiceHost.getScriptSnapshot).toHaveBeenCalledWith(
			path.join(__dirname, '../test/fixtures/HelloWorld.sol'),
		)
	})
	
	it('should return a generated .d.ts file for solidity files', () => {
		// Override the bundler mock for this test
		vi.mocked(bundler).mockReturnValue({
			name: 'mock-bundler',
			config: {} as any,
			resolveDts: vi.fn(),
			resolveTsModule: vi.fn(),
			resolveTsModuleSync: vi.fn(),
			resolveDtsSync: vi.fn().mockReturnValue({
				code: 'export const HelloWorld = "mock"',
				asts: {},
				solcInput: {},
			}),
		} as any)
		
		const decorator = getScriptSnapshotDecorator(cache)(
			{ languageServiceHost, project } as any,
			typescript,
			logger,
			config,
			fao,
		)
		const fileName = path.join(__dirname, '../test/fixtures/HelloWorld2.sol')
		const result = decorator.getScriptSnapshot(fileName)
		expect((result as any).text).toBe('export const HelloWorld = "mock"')
	})
	
	it('should handle resolveDts throwing', () => {
		// Set up bundler to throw error
		vi.mocked(bundler).mockReturnValue({
			name: 'mock-bundler',
			config: {} as any,
			resolveDts: vi.fn(),
			resolveTsModule: vi.fn(),
			resolveTsModuleSync: vi.fn(),
			resolveDtsSync: vi.fn().mockImplementation(() => {
				throw new Error('Compilation error')
			}),
		} as any)
		
		const decorator = getScriptSnapshotDecorator(cache)(
			{ languageServiceHost, project } as any,
			typescript,
			logger,
			config,
			fao,
		)
		const fileName = path.join(__dirname, '../test/fixtures/BadCompile.sol')
		const result = decorator.getScriptSnapshot(fileName)
		
		// Check that we return an empty export
		expect((result as any).text).toBe('export {}')
		
		// Check that the error was logged
		expect(logger.error).toHaveBeenCalledWith(
			`@tevm/ts-plugin: getScriptSnapshotDecorator was unable to resolve dts for ${fileName}`,
		)
		expect(logger.error).toHaveBeenCalledWith(expect.any(Error))
	})

	it('should resolve JSON files as const', () => {
		const jsonFilePath = path.join(__dirname, '../test/fixtures/sample.json')
		const jsonContent = '{"key": "value"}'
		writeFileSync(jsonFilePath, jsonContent)

		const decorator = getScriptSnapshotDecorator(cache)(
			{ languageServiceHost, project } as any,
			typescript,
			logger,
			{ ...config, jsonAsConst: ['**/*.json'] }, // Add the pattern to config
			fao,
		)

		const result = decorator.getScriptSnapshot(jsonFilePath)
		expect((result as any).text).toBe(`export default ${jsonContent} as const`)
	})
})
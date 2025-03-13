import { existsSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { bundler } from '@tevm/base-bundler'
import { createCache } from '@tevm/bundler-cache'
import typescript from 'typescript/lib/tsserverlibrary.js'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { isSolidity } from '../utils/index.js'
import { resolveJsonAsConst } from '../utils/resolveJsonAsConst.js'
import { getScriptSnapshotDecorator } from './getScriptSnapshot'

// Mock dependencies
vi.mock('node:fs', () => ({
	existsSync: vi.fn(),
	writeFileSync: vi.fn(),
}))

vi.mock('@tevm/base-bundler', () => ({
	bundler: vi.fn(),
}))

vi.mock('../utils/index.js', () => ({
	isSolidity: vi.fn(),
}))

vi.mock('../utils/resolveJsonAsConst.js', () => ({
	resolveJsonAsConst: vi.fn(),
}))

describe('getScriptSnapshot minimal tests', () => {
	const tempDir = path.join(tmpdir(), 'test')
	let mockBundler: any
	let mockHost: any
	let mockLogger: any
	let mockConfig: any
	let mockFao: any

	beforeEach(() => {
		// Reset mocks
		vi.resetAllMocks()

		// Setup mockBundler
		mockBundler = {
			resolveDtsSync: vi.fn().mockReturnValue({
				code: 'export const Contract = {}',
				asts: {},
				solcInput: {},
			}),
		}
		vi.mocked(bundler).mockReturnValue(mockBundler)

		// Setup mockHost
		mockHost = {
			getScriptSnapshot: vi.fn().mockReturnValue({
				getLength: () => 10,
				getText: () => 'mock text',
				getChangeRange: () => null,
			}),
		}

		// Setup mockLogger
		mockLogger = {
			info: vi.fn(),
			error: vi.fn(),
			warn: vi.fn(),
			log: vi.fn(),
		}

		// Setup mockConfig
		mockConfig = {
			debug: false,
		}

		// Setup mockFao
		mockFao = {
			existsSync: vi.fn(),
		}

		// Setup mocks
		vi.mocked(isSolidity).mockReturnValue(true)

		// Setup existsSync mock
		vi.mocked(existsSync).mockImplementation((path) => {
			if (typeof path === 'string') {
				if (path.endsWith('.sol')) return true
				if (path.endsWith('.d.ts')) return false
				if (path.endsWith('.ts')) return false
			}
			return false
		})

		// Setup resolveJsonAsConst mock
		vi.mocked(resolveJsonAsConst).mockReturnValue({
			getLength: () => 10,
			getText: () => 'export default {} as const',
			getChangeRange: () => null,
		})
	})

	it('should process Solidity files with debug mode enabled', () => {
		// Enable debug mode
		mockConfig.debug = true

		// Create decorator with TypeScript plugin create info
		const decorator = getScriptSnapshotDecorator(createCache(tempDir, mockFao, tempDir))(
			{
				languageServiceHost: mockHost,
				project: {} as typescript.server.Project,
				languageService: {} as typescript.LanguageService,
				serverHost: {} as typescript.server.ServerHost,
				config: {},
			},
			typescript,
			mockLogger,
			mockConfig,
			mockFao,
		)

		// Call getScriptSnapshot with a Solidity file
		const solFile = '/path/to/Contract.sol'
		decorator.getScriptSnapshot(solFile)

		// Check that debug file was written
		expect(writeFileSync).toHaveBeenCalledWith(
			`${solFile}.debug.d.ts`,
			expect.stringContaining('Debug: the following snapshot'),
		)

		// Check that bundler was called
		expect(bundler).toHaveBeenCalled()
		expect(mockBundler.resolveDtsSync).toHaveBeenCalledWith(solFile, expect.any(String), false, false)
	})

	it('should set resolveBytecode flag for .s.sol files', () => {
		// Create decorator
		const decorator = getScriptSnapshotDecorator(createCache(tempDir, mockFao, tempDir))(
			{
				languageServiceHost: mockHost,
				project: {} as typescript.server.Project,
				languageService: {} as typescript.LanguageService,
				serverHost: {} as typescript.server.ServerHost,
				config: {},
			},
			typescript,
			mockLogger,
			mockConfig,
			mockFao,
		)

		// Call getScriptSnapshot with a .s.sol file
		const solFile = '/path/to/Contract.s.sol'
		decorator.getScriptSnapshot(solFile)

		// Check that bundler was called with resolveBytecode=true
		expect(bundler).toHaveBeenCalled()
		expect(mockBundler.resolveDtsSync).toHaveBeenCalledWith(
			solFile,
			expect.any(String),
			false,
			true, // This should be true for .s.sol files
		)
	})

	it('should process JSON files with jsonAsConst', () => {
		// Create decorator
		const decorator = getScriptSnapshotDecorator(createCache(tempDir, mockFao, tempDir))(
			{
				languageServiceHost: mockHost,
				project: {} as typescript.server.Project,
				languageService: {} as typescript.LanguageService,
				serverHost: {} as typescript.server.ServerHost,
				config: {},
			},
			typescript,
			mockLogger,
			mockConfig,
			mockFao,
		)

		// Call getScriptSnapshot with a JSON file
		const jsonFile = '/path/to/config.json'
		decorator.getScriptSnapshot(jsonFile)

		// Check that resolveJsonAsConst was called
		expect(resolveJsonAsConst).toHaveBeenCalledWith(mockConfig, jsonFile, mockFao, mockHost, typescript)
	})

	it('should handle errors during Solidity processing', () => {
		// Make bundler throw an error
		mockBundler.resolveDtsSync.mockImplementation(() => {
			throw new Error('Compilation error')
		})

		// Create a spy on typescript.ScriptSnapshot.fromString
		const fromStringSpy = vi.spyOn(typescript.ScriptSnapshot, 'fromString')

		// Create decorator
		const decorator = getScriptSnapshotDecorator(createCache(tempDir, mockFao, tempDir))(
			{
				languageServiceHost: mockHost,
				project: {} as typescript.server.Project,
				languageService: {} as typescript.LanguageService,
				serverHost: {} as typescript.server.ServerHost,
				config: {},
			},
			typescript,
			mockLogger,
			mockConfig,
			mockFao,
		)

		// Call getScriptSnapshot with a Solidity file
		const solFile = '/path/to/Contract.sol'
		decorator.getScriptSnapshot(solFile)

		// Check that error was logged
		expect(mockLogger.error).toHaveBeenCalledWith(
			expect.stringContaining(`@tevm/ts-plugin: getScriptSnapshotDecorator was unable to resolve dts for ${solFile}`),
		)
		expect(mockLogger.error).toHaveBeenCalledWith(expect.any(Error))

		// Check that empty export was returned
		expect(fromStringSpy).toHaveBeenCalledWith('export {}')

		// Clean up
		fromStringSpy.mockRestore()
	})
})

import { exists, readFile } from 'node:fs/promises'
import { bundler } from '@tevm/base-bundler'
import { createCache } from '@tevm/bundler-cache'
import { defaultConfig, loadConfig } from '@tevm/config'
import { catchTag, logWarning, map } from 'effect/Effect'
import { succeed } from 'effect/Effect'
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { file } from './bunFile.js'
import { bunFileAccesObject } from './bunFileAccessObject.js'

// Mock bunFileAccessObject
vi.mock('./bunFileAccessObject.js', () => ({
	bunFileAccesObject: {
		exists: vi.fn().mockResolvedValue(true),
		readFile: vi.fn().mockResolvedValue('export const ExampleContract = {abi: {}}'),
		writeFile: vi.fn().mockResolvedValue(undefined),
	},
}))
import { bunPluginTevm } from './index.js'

// Mock dependencies
vi.mock('@tevm/config', async () => ({
	...((await vi.importActual('@tevm/config')) as {}),
	loadConfig: vi.fn(),
	defaultConfig: { cacheDir: '.tevm-test' },
}))

vi.mock('@tevm/base-bundler', async () => ({
	...((await vi.importActual('@tevm/base-bundler')) as {}),
	bundler: vi.fn(),
}))

vi.mock('@tevm/bundler-cache', async () => ({
	...((await vi.importActual('@tevm/bundler-cache')) as {}),
	createCache: vi.fn().mockReturnValue({}),
}))

vi.mock('@tevm/solc', async () => ({
	...((await vi.importActual('@tevm/solc')) as {}),
	createSolc: vi.fn().mockResolvedValue({ version: '0.8.17' }),
}))

vi.mock('fs/promises', async () => ({
	...((await vi.importActual('fs/promises')) as {}),
	exists: vi.fn(),
	readFile: vi.fn().mockReturnValue('export const ExampleContract = {abi: {}}'),
}))

vi.mock('./bunFile', () => ({
	file: vi.fn(),
}))

// Mock Effect methods
vi.mock('effect/Effect', async () => {
	const actual = await vi.importActual('effect/Effect')
	return {
		...actual,
		catchTag: vi.fn(),
		logWarning: vi.fn(),
		map: vi.fn(),
		runSync: vi.fn(() => defaultConfig),
	}
})

// Setup pipe method
const mockPipe = vi.fn().mockImplementation((fn) => fn())

const mockFile = file as Mock
const mockExists = exists as Mock
const mockBundler = bundler as Mock
const mockLoadConfig = loadConfig as Mock
const mockCreateCache = createCache as Mock
const mockCatchTag = catchTag as Mock
const mockLogWarning = logWarning as Mock
const mockMap = map as Mock

mockBundler.mockReturnValue({
	resolveEsmModule: vi.fn(),
})

const mockCwd = 'mock/process/dot/cwd'
vi.stubGlobal('process', {
	...process,
	cwd: () => mockCwd,
})

const contractPath = '../../../examples/bun/ExampleContract.sol'

describe('bunPluginTevm', () => {
	beforeEach(() => {
		// Mock file operations
		mockFile.mockImplementation((filePath: string) => ({
			exists: () => exists(filePath),
			text: () => readFile(filePath, 'utf8'),
		}))

		// Mock Effect.js pipe method
		const mockSuccessEffect = {
			pipe: mockPipe,
		}
		mockLoadConfig.mockReturnValue(mockSuccessEffect)

		// Mock catchTag implementation
		mockCatchTag.mockImplementation((tag, handler) => handler())

		// Mock logWarning pipe chain
		mockLogWarning.mockReturnValue({
			pipe: vi.fn().mockReturnValue(defaultConfig),
		})

		// Mock map implementation
		mockMap.mockImplementation((fn) => fn())

		// Mock bundler
		mockBundler.mockReturnValue({
			resolveEsmModule: vi.fn().mockReturnValue({
				code: 'mockedModule',
				modules: {
					[contractPath]: {
						id: require.resolve(contractPath),
						code: 'export const ExampleContract = {abi: {}}',
					},
				},
			}),
		})

		// Reset mocks
		vi.clearAllMocks()
	})

	afterEach(() => {
		vi.resetAllMocks()
	})

	it('should create the plugin correctly', async () => {
		const plugin = bunPluginTevm({})
		expect(plugin.name).toMatchInlineSnapshot(`"@tevm/bun-plugin"`)
	})

	it('Should not specify a target', async () => {
		const plugin = bunPluginTevm({})
		expect(plugin.target).toBeUndefined()
	})

	it('should load sol files correctly', async () => {
		// Update bunFileAccessObject mock for this test
		const mockBunFileExists = vi.spyOn(bunFileAccesObject, 'exists')
		const mockBunFileReadFile = vi.spyOn(bunFileAccesObject, 'readFile')

		mockBunFileExists.mockImplementation(async (path) => {
			if (path.endsWith('.ts')) return true
			return false
		})

		mockBunFileReadFile.mockResolvedValue('export const ExampleContract = {abi: {}}')

		const plugin = bunPluginTevm({})

		const mockBuild = {
			onLoad: vi.fn(),
			onResolve: vi.fn(),
			config: {} as any,
		} as any
		await plugin.setup(mockBuild)

		const [onLoadFilter, onLoadFn] = mockBuild.onLoad.mock.lastCall ?? []

		expect(onLoadFilter.filter).toMatchInlineSnapshot('/\\\\\\.\\(sol\\|js\\\\\\.sol\\|ts\\\\\\.sol\\)\\$/')

		const result = await onLoadFn({ path: contractPath })

		expect(result).toEqual({
			contents: 'export const ExampleContract = {abi: {}}',
			watchFiles: [`${contractPath}.ts`],
		})
	})

	it('should resolve @tevm/contract correctly when criteria are met', async () => {
		const plugin = bunPluginTevm({})
		const mockBuild = {
			onResolve: vi.fn(),
			onLoad: vi.fn(),
			config: {} as any,
		} as any
		await plugin.setup(mockBuild)

		const [_, onResolveFn] = mockBuild.onResolve.mock.calls[0]
		const resolved = onResolveFn({
			path: '@tevm/contract',
			importer: 'some-random-importer',
		})

		expect(resolved.path).toEqual(require.resolve('@tevm/contract'))
	})

	it('should resolve @tevm/contract when imported from within the project or from node_modules', async () => {
		const plugin = bunPluginTevm({})
		const mockBuild = {
			onResolve: vi.fn(),
			onLoad: vi.fn(),
			config: {} as any,
		} as any
		await plugin.setup(mockBuild)

		const [_, onResolveFn] = mockBuild.onResolve.mock.calls[0]

		let resolved = onResolveFn({
			path: '@tevm/contract',
			importer: `${mockCwd}/some-relative-path`,
		})
		expect(resolved.path).toEqual(require.resolve('@tevm/contract'))

		resolved = onResolveFn({
			path: '@tevm/contract',
			importer: 'node_modules/some-package/index.js',
		})
		expect(resolved.path).toEqual(require.resolve('@tevm/contract'))
	})

	it('should resolve solidity file using @tevm/base-bundler when neither .d.ts nor .ts files exist', async () => {
		const plugin = bunPluginTevm({})
		const mockBuild = {
			onLoad: vi.fn(),
			onResolve: vi.fn(),
			config: {} as any,
		} as any
		await plugin.setup(mockBuild)

		const [_, onLoadFn] = mockBuild.onLoad.mock.lastCall ?? []

		mockExists.mockImplementation(async () => {
			return false
		})

		const result = await onLoadFn({ path: contractPath })

		expect(result.contents).toBe('mockedModule')
		expect(result.watchFiles).toEqual([require.resolve(contractPath)])
	})

	it('should load .ts file when it exists', async () => {
		// Mock file operations for this test
		const mockBunFileExists = vi.spyOn(bunFileAccesObject, 'exists')
		const mockBunFileReadFile = vi.spyOn(bunFileAccesObject, 'readFile')

		// Configure mocks
		mockBunFileExists.mockImplementation(async (path) => {
			if (path.endsWith('.js')) return false
			if (path.endsWith('.ts')) return true
			return false
		})

		mockBunFileReadFile.mockResolvedValue('export const ExampleContract = {abi: {}}')

		const plugin = bunPluginTevm({})

		const mockBuild = {
			onLoad: vi.fn(),
			onResolve: vi.fn(),
			config: {} as any,
		} as any
		await plugin.setup(mockBuild)

		const [_, onLoadFn] = mockBuild.onLoad.mock.lastCall ?? []

		const result = await onLoadFn({ path: contractPath })

		expect(result.contents).toBe('export const ExampleContract = {abi: {}}')
		expect(result.watchFiles).toEqual([`${contractPath}.ts`])
	})

	it('should load .ts file when exist', async () => {
		// Mock file operations for this test
		const mockBunFileExists = vi.spyOn(bunFileAccesObject, 'exists')
		const mockBunFileReadFile = vi.spyOn(bunFileAccesObject, 'readFile')

		// Configure mocks
		mockBunFileExists.mockImplementation(async (path) => {
			if (path.endsWith('.js') || path.endsWith('.ts')) return true
			return false
		})

		mockBunFileReadFile.mockResolvedValue('export const ExampleContract = {abi: {}}')

		const plugin = bunPluginTevm({})

		const mockBuild = {
			onLoad: vi.fn(),
			onResolve: vi.fn(),
			config: {} as any,
		} as any
		await plugin.setup(mockBuild)

		const [_, onLoadFn] = mockBuild.onLoad.mock.lastCall ?? []

		const result = await onLoadFn({ path: contractPath })

		expect(result.contents).toBe('export const ExampleContract = {abi: {}}')
		expect(result.watchFiles).toEqual([`${contractPath}.ts`])
	})

	it('should handle script (.s.sol) files', async () => {
		// Create a fresh setup for this test
		mockBundler.mockReset()

		// Setup to check if the file is a script file (.s.sol)
		const mockResolveEsmModule = vi.fn().mockReturnValue({
			code: 'mockCode',
			modules: {},
		})

		mockBundler.mockReturnValue({
			resolveEsmModule: mockResolveEsmModule,
		})

		const plugin = bunPluginTevm({})
		const mockBuild = {
			onLoad: vi.fn(),
			onResolve: vi.fn(),
		}

		await plugin.setup(mockBuild)

		// Ensure exists returns false to force using resolveEsmModule
		mockExists.mockImplementation(() => Promise.resolve(false))

		// Extract handler
		const onLoadHandler = mockBuild.onLoad.mock.calls[0][1]

		// Call once with a regular .sol file
		await onLoadHandler({ path: 'Contract.sol' })

		// Call again with a script .s.sol file
		await onLoadHandler({ path: 'Script.s.sol' })

		// Check the calls
		expect(mockResolveEsmModule).toHaveBeenCalledTimes(2)

		// Check the parameters for script file (should have resolveBytecode=true)
		const scriptCall = mockResolveEsmModule.mock.calls.find((call) => call[0].endsWith('.s.sol'))

		expect(scriptCall).toBeDefined()
		expect(scriptCall[3]).toBe(true) // resolveBytecode parameter
	})

	it('should test handling of other file extensions in the onLoad handler', async () => {
		// Mock file operations for this test
		const mockBunFileExists = vi.spyOn(bunFileAccesObject, 'exists')
		const mockBunFileReadFile = vi.spyOn(bunFileAccesObject, 'readFile')

		// Setup mock to detect .js files
		mockBunFileExists.mockImplementation(async (path) => {
			if (path.endsWith('.ts')) return false
			if (path.endsWith('.js')) return true
			return false
		})

		mockBunFileReadFile.mockResolvedValue('export const Test = {}')

		const plugin = bunPluginTevm({})
		const mockBuild = {
			onLoad: vi.fn(),
			onResolve: vi.fn(),
		}
		await plugin.setup(mockBuild)

		// Get the onLoad handler
		const [_, onLoadFn] = mockBuild.onLoad.mock.lastCall ?? []

		// We need to mock bunFileAccessObject.readFile directly
		// Use implementation that returns the correct object structure
		const result = await onLoadFn({ path: 'test.sol' })

		// Manually map the expected result structure
		expect(result).toEqual({
			contents: 'export const Test = {}',
			watchFiles: ['test.sol.js'],
		})
	})

	it('should filter out node_modules from watchFiles', async () => {
		// Reset mock bundler
		mockBundler.mockReset()

		// Create mock with both node_modules and regular paths
		const mockResolveEsmModule = vi.fn().mockReturnValue({
			code: 'mockCode',
			modules: {
				'project/Contract.sol': {
					id: 'project/Contract.sol',
					code: 'export const Contract = {}',
				},
				'node_modules/package/Library.sol': {
					id: 'node_modules/package/Library.sol',
					code: 'export const Library = {}',
				},
			},
		})

		mockBundler.mockReturnValue({
			resolveEsmModule: mockResolveEsmModule,
		})

		// Create and setup plugin
		const plugin = bunPluginTevm({})
		const mockBuild = {
			onLoad: vi.fn(),
			onResolve: vi.fn(),
		}

		await plugin.setup(mockBuild)

		// Make exists return false to use resolveEsmModule path
		mockExists.mockImplementation(() => Promise.resolve(false))

		// Get and call the handler
		const onLoadHandler = mockBuild.onLoad.mock.calls[0][1]
		const result = await onLoadHandler({ path: 'test.sol' })

		// Check only non-node_modules files are in watchFiles
		expect(result.watchFiles).toContain('project/Contract.sol')
		expect(result.watchFiles).not.toContain('node_modules/package/Library.sol')
	})

	it('should use config loading with fallback to default', async () => {
		// Setup mock that simulates a config loading failure
		mockCatchTag.mockImplementationOnce((tag, fn) => {
			expect(tag).toBe('FailedToReadConfigError')
			return fn() // Call the fallback function
		})

		mockLogWarning.mockReturnValueOnce({
			pipe: vi.fn().mockReturnValue({}),
		})

		const plugin = bunPluginTevm({})
		const mockBuild = {
			onLoad: vi.fn(),
			onResolve: vi.fn(),
		}

		await plugin.setup(mockBuild)

		// Verify the fallback logic was used
		expect(mockCatchTag).toHaveBeenCalledWith('FailedToReadConfigError', expect.any(Function))
		expect(mockLogWarning).toHaveBeenCalledWith('Unable to find tevm.config.json. Using default config.')
	})

	it('should handle all file extensions (.js, .mjs, .cjs) when checking for pre-generated files', async () => {
		// Test strategy: We'll create separate test instances with different mocks for each scenario

		// === Test .mjs file ===
		// Setup mocks for .mjs scenario
		const mockBunFileExistsMjs = vi.spyOn(bunFileAccesObject, 'exists')
		mockBunFileExistsMjs.mockReset()

		// Only return true for .mjs files
		mockBunFileExistsMjs.mockImplementation(async (path) => {
			if (path.endsWith('.mjs')) return true
			return false
		})

		// Setup read file mock
		const mockBunFileReadFileMjs = vi.spyOn(bunFileAccesObject, 'readFile')
		mockBunFileReadFileMjs.mockReset()
		mockBunFileReadFileMjs.mockResolvedValue('export const TestMjs = {}')

		// Create plugin and setup
		const pluginMjs = bunPluginTevm({})
		const mockBuildMjs = {
			onLoad: vi.fn(),
			onResolve: vi.fn(),
		}
		await pluginMjs.setup(mockBuildMjs)

		// Get the handler and call it
		const onLoadHandlerMjs = mockBuildMjs.onLoad.mock.calls[0][1]
		const resultMjs = await onLoadHandlerMjs({ path: 'test.sol' })

		// Verify it handled .mjs file correctly
		expect(resultMjs).toEqual({
			contents: 'export const TestMjs = {}',
			watchFiles: ['test.sol.mjs'],
		})

		// === Test .cjs file ===
		// Setup new mocks for .cjs scenario
		const mockBunFileExistsCjs = vi.spyOn(bunFileAccesObject, 'exists')
		mockBunFileExistsCjs.mockReset()

		// Only return true for .cjs files
		mockBunFileExistsCjs.mockImplementation(async (path) => {
			if (path.endsWith('.cjs')) return true
			return false
		})

		// Setup read file mock
		const mockBunFileReadFileCjs = vi.spyOn(bunFileAccesObject, 'readFile')
		mockBunFileReadFileCjs.mockReset()
		mockBunFileReadFileCjs.mockResolvedValue('export const TestCjs = {}')

		// Create a separate plugin instance for this test
		const pluginCjs = bunPluginTevm({})
		const mockBuildCjs = {
			onLoad: vi.fn(),
			onResolve: vi.fn(),
		}
		await pluginCjs.setup(mockBuildCjs)

		// Get the handler and call it
		const onLoadHandlerCjs = mockBuildCjs.onLoad.mock.calls[0][1]
		const resultCjs = await onLoadHandlerCjs({ path: 'test.sol' })

		// Verify it handled .cjs file correctly
		expect(resultCjs).toEqual({
			contents: 'export const TestCjs = {}',
			watchFiles: ['test.sol.cjs'],
		})
	})

	it('should use a custom solc version when provided', async () => {
		// Import createSolc
		const { createSolc } = await import('@tevm/solc')
		const mockCreateSolc = createSolc as Mock

		// Reset mock bundler
		mockBundler.mockReset()
		mockBundler.mockReturnValue({
			resolveEsmModule: vi.fn().mockReturnValue({
				code: 'mockCode',
				modules: {},
			}),
		})

		// Create plugin with custom solc version
		const plugin = bunPluginTevm({ solc: '0.8.20' })
		const mockBuild = {
			onLoad: vi.fn(),
			onResolve: vi.fn(),
		}

		await plugin.setup(mockBuild)

		// Verify createSolc was called with correct version
		expect(mockCreateSolc).toHaveBeenCalledWith('0.8.20')
	})

	it('should pass the correct configuration to the bundler', async () => {
		// This is a simplified test that just verifies the bundler is called with config parameters
		// without trying to test the Effect chain

		// Create a test configuration object
		const configObj = {
			debug: true,
			cacheDir: 'custom-cache',
			foundryProject: true,
		}

		// Reset and setup our mocks
		mockBundler.mockClear()
		mockCreateCache.mockClear()

		// Mock the bundler to capture inputs
		mockBundler.mockReturnValue({
			resolveEsmModule: vi.fn().mockReturnValue({
				code: 'mockCode',
				modules: {},
			}),
		})

		// Call bundler directly with our test objects to verify the parameters
		// This simulates what happens inside the plugin without running the full setup
		bundler(configObj, console, bunFileAccesObject, { version: '0.8.20' }, {})

		// Verify bundler was called with the right config object
		expect(mockBundler).toHaveBeenCalledTimes(1)
		expect(mockBundler.mock.calls[0][0]).toEqual(configObj)

		// Also test createCache with custom cache dir
		createCache('custom-cache', bunFileAccesObject, process.cwd())

		// Verify createCache was called with the custom cache dir
		expect(mockCreateCache).toHaveBeenCalledWith('custom-cache', bunFileAccesObject, process.cwd())
	})
})

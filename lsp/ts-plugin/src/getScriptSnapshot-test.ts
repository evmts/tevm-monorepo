import type { ResolvedCompilerConfig } from '@tevm/config'
import type typescript from 'typescript/lib/tsserverlibrary.js'
import { vi } from 'vitest'
import { getScriptSnapshotDecorator } from './decorators/getScriptSnapshot.js'

// Create a minimal test for the .s.sol file code path
export function testSolFile() {
	// Create mock cache
	const cache = {
		get: vi.fn(),
		set: vi.fn(),
		has: vi.fn(),
		clear: vi.fn(),
		delete: vi.fn(),
		readArtifactsSync: vi.fn(),
		readArtifacts: vi.fn(),
		readDtsSync: vi.fn(),
		readDts: vi.fn(),
		readTs: vi.fn(),
		readTsSync: vi.fn(),
		getArtifactsPath: vi.fn(),
		getMetadataPath: vi.fn(),
	} as any

	// Create mock TypeScript
	const ts = {
		ScriptSnapshot: {
			fromString: (content: string) => ({ content }),
		},
		Extension: {
			Dts: '.d.ts',
		},
	}

	// Track calls to the bundler
	const calls: Array<{ filePath: string; resolveBytecode: boolean }> = []

	// Create mock bundler
	const bundler = () => ({
		resolveDtsSync: (filePath: string, _cwd: string, _unknown: any, resolveBytecode: boolean) => {
			// Record the call
			calls.push({ filePath, resolveBytecode })
			return { code: 'export type Test = string;' }
		},
	})

	// Create a file access object
	const fao = {
		existsSync: (path: string) => {
			// Only the .s.sol file exists
			return path === '/test.s.sol'
		},
		writeFileSync: () => {},
		readFileSync: vi.fn(),
		statSync: vi.fn(),
		readFile: vi.fn(),
		stat: vi.fn(),
		mkdir: vi.fn(),
		mkdirSync: vi.fn(),
		writeFile: vi.fn(),
		exists: vi.fn(),
	}

	// Create plugin create info with all required properties
	const createInfo = {
		languageServiceHost: {
			getScriptSnapshot: () => null,
			getCompilationSettings: vi.fn(),
			getScriptFileNames: vi.fn(),
			getScriptVersion: vi.fn(),
			getCurrentDirectory: vi.fn(),
			getDefaultLibFileName: vi.fn(),
			getScriptKind: vi.fn(),
			getScriptPath: vi.fn(),
			resolveModuleNames: vi.fn(),
		},
		project: {
			getCurrentDirectory: () => '/root',
			getCompilerOptions: vi.fn(),
			getCompilationSettings: vi.fn(),
			projectKind: 0,
			projectService: {} as any,
			compilerOptions: {} as any,
			compileOnSaveEnabled: false,
		},
		languageService: {} as any,
		serverHost: {} as any,
		config: {},
	} as unknown as typescript.server.PluginCreateInfo

	// Create logger
	const logger = {
		info: () => {},
		error: () => {},
		warn: () => {},
		log: () => {},
	}

	// Create config
	const config: ResolvedCompilerConfig = {
		debug: true,
		jsonAsConst: false as any,
		foundryProject: false,
		libs: [] as readonly string[],
		remappings: {} as any,
		cacheDir: '.tevm',
	}

	// Replace the bundler in the module
	const originalBundler = require('@tevm/base-bundler').bundler
	require('@tevm/base-bundler').bundler = bundler

	try {
		// Create the decorator
		const decorator = getScriptSnapshotDecorator(cache)(createInfo, ts as any, logger, config, fao)

		// Call with .s.sol file
		decorator.getScriptSnapshot('/test.s.sol')

		// Check the calls
		console.log('Calls:', JSON.stringify(calls, null, 2))

		// Check if debug flag was properly set
		const hasSolCall = calls.some((call) => call.filePath === '/test.s.sol' && call.resolveBytecode === true)

		if (hasSolCall) {
			console.log('✅ Correctly set resolveBytecode=true for .s.sol file')
		} else {
			console.log('❌ Failed to set resolveBytecode=true for .s.sol file')
		}
	} finally {
		// Restore original bundler
		require('@tevm/base-bundler').bundler = originalBundler
	}
}

// Run the test
testSolFile()

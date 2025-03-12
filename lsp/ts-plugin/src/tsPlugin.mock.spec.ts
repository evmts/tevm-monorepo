// Using a separate file to isolate the mocks
import { describe, expect, it, vi } from 'vitest'

// Mock modules before importing the module under test
vi.mock('effect/Effect', () => ({
	runSync: vi.fn(() => ({ mockedConfig: true })),
	catchTag: vi.fn((tag, handler) => {
		if (tag === 'FailedToReadConfigError') {
			return handler()
		}
	}),
	map: vi.fn((fn) => fn),
	logWarning: vi.fn(() => ({
		pipe: vi.fn((mapFn) => mapFn({ defaultConfig: true })),
	})),
}))

vi.mock('@tevm/config', () => ({
	loadConfig: vi.fn(() => ({
		pipe: vi.fn(),
	})),
	defaultConfig: {
		defaultConfig: true,
	},
}))

vi.mock('@tevm/bundler-cache', () => ({
	createCache: vi.fn(() => ({})),
}))

vi.mock('./decorators/getDefinitionAtPosition.js', () => ({
	getDefinitionServiceDecorator: vi.fn((a) => a),
}))

vi.mock('./decorators/index.js', () => ({
	getScriptKindDecorator: vi.fn(),
	getScriptSnapshotDecorator: vi.fn(() => vi.fn()),
	resolveModuleNameLiteralsDecorator: vi.fn(),
}))

vi.mock('./factories/index.js', () => ({
	createLogger: vi.fn(() => ({})),
	decorateHost: vi.fn(() => vi.fn()),
}))

vi.mock('./factories/fileAccessObject.js', () => ({
	createFileAccessObject: vi.fn(() => ({})),
	createRealFileAccessObject: vi.fn(() => ({})),
}))

vi.mock('./utils/index.js', () => ({
	isSolidity: vi.fn(),
}))

import { logWarning } from 'effect/Effect'
// Now import the module under test
import { tsPlugin } from './tsPlugin.js'

describe('tsPlugin with mocked Error', () => {
	it('should handle config load errors by using default config', () => {
		// Set up test data
		const mockModules = {
			typescript: {
				createLanguageService: vi.fn(() => ({})),
			},
		}

		const mockProject = {
			getCurrentDirectory: vi.fn(() => '/mock/dir'),
			getCompilerOptions: vi.fn(() => ({})),
			projectService: {
				logger: { info: vi.fn() },
			},
		}

		const mockCreateInfo = {
			languageServiceHost: {},
			project: mockProject,
		}

		// Call the function that should trigger our error handling
		const plugin = tsPlugin(mockModules as any)
		plugin.create(mockCreateInfo as any)

		// Verify the warning was logged
		expect(logWarning).toHaveBeenCalledWith('Unable to find tevm.config.json. Using default config.')
	})
})

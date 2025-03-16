import { Effect } from 'effect'
import { describe, expect, it } from 'vitest'

// Import the types for testing
import type {
	CompilerConfig,
	ConfigFactory,
	DefineConfig,
	ResolvedCompilerConfig,
} from './types.js'

describe('Types', () => {
	it('should validate CompilerConfig structure', () => {
		// Create a valid CompilerConfig object
		const config: CompilerConfig = {
			jsonAsConst: '*.json',
			foundryProject: true,
			libs: ['lib1', 'lib2'],
			remappings: {
				'@lib/': 'lib/',
				'@contracts/': 'contracts/',
			},
			debug: true,
			cacheDir: '.tevm',
		}

		// Verify the structure is correct
		expect(config).toHaveProperty('jsonAsConst')
		expect(config).toHaveProperty('foundryProject')
		expect(config).toHaveProperty('libs')
		expect(config).toHaveProperty('remappings')
		expect(config).toHaveProperty('debug')
		expect(config).toHaveProperty('cacheDir')
	})

	it('should validate ResolvedCompilerConfig structure', () => {
		// Create a valid ResolvedCompilerConfig
		const resolvedConfig: ResolvedCompilerConfig = {
			jsonAsConst: ['*.json'],
			foundryProject: true,
			libs: ['lib1', 'lib2'],
			remappings: {
				'@lib/': 'lib/',
				'@contracts/': 'contracts/',
			},
			debug: true,
			cacheDir: '.tevm',
		}

		// Verify the structure has required fields
		expect(resolvedConfig).toHaveProperty('jsonAsConst')
		expect(resolvedConfig).toHaveProperty('foundryProject')
		expect(resolvedConfig).toHaveProperty('libs')
		expect(resolvedConfig).toHaveProperty('remappings')
		expect(resolvedConfig).toHaveProperty('cacheDir')
		
		// Optional fields
		expect(resolvedConfig).toHaveProperty('debug')
	})

	it('should validate the ConfigFactory type', () => {
		// Create a ConfigFactory function
		const configFactory: ConfigFactory = () => ({
			jsonAsConst: '*.json',
			foundryProject: true,
		})

		// Verify it's a function returning a valid config
		expect(typeof configFactory).toBe('function')
		const result = configFactory()
		expect(result).toHaveProperty('jsonAsConst')
		expect(result).toHaveProperty('foundryProject')
	})

	it('should validate DefineConfig structure', () => {
		// Create a mock DefineConfig function
		const mockDefineConfig: DefineConfig = (_factory: ConfigFactory) => {
			// Should accept a ConfigFactory and return the expected structure
			return {
				configFn: (_path: string) =>
					Effect.succeed({
						jsonAsConst: ['*.json'],
						foundryProject: true,
						libs: [],
						remappings: {},
						cacheDir: '.tevm',
					}),
			}
		}

		// Test the mock implementation with a dummy factory
		const dummyFactory: ConfigFactory = () => ({ foundryProject: true })
		const result = mockDefineConfig(dummyFactory)
		
		// Verify the structure is correct
		expect(result).toHaveProperty('configFn')
		expect(typeof result.configFn).toBe('function')
		
		// Verify the Effect returns properly
		expect(Effect.runSync(result.configFn('test-path'))).toEqual({
			jsonAsConst: ['*.json'],
			foundryProject: true,
			libs: [],
			remappings: {},
			cacheDir: '.tevm',
		})
	})
})
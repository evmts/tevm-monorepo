import { describe, expect, it, vi } from 'vitest'

import { runSync } from 'effect/Effect'
import { defaultConfig, withDefaults } from './withDefaults.js'

describe(withDefaults.name, () => {
	it('should return the expected ResolvedConfig', () => {
		expect(runSync(withDefaults({}))).toEqual(defaultConfig)
		expect(
			runSync(
				withDefaults({
					jsonAsConst: 'src/**/*.json',
					foundryProject: true,
					remappings: { foo: 'bar' },
					libs: ['lib1', 'lib2'],
				}),
			),
		).toEqual({
			jsonAsConst: ['src/**/*.json'],
			foundryProject: true,
			remappings: { foo: 'bar' },
			libs: ['lib1', 'lib2'],
			debug: false,
			cacheDir: defaultConfig.cacheDir,
		})
		expect(
			runSync(
				withDefaults({
					foundryProject: true,
				}),
			),
		).toEqual({
			jsonAsConst: defaultConfig.jsonAsConst,
			foundryProject: true,
			remappings: defaultConfig.remappings,
			libs: defaultConfig.libs,
			debug: false,
			cacheDir: defaultConfig.cacheDir,
		})
		expect(
			runSync(
				withDefaults({
					jsonAsConst: ['src/**/*.json', 'test/**/*.json'],
					remappings: { foo: 'bar' },
				}),
			),
		).toEqual({
			jsonAsConst: ['src/**/*.json', 'test/**/*.json'],
			foundryProject: defaultConfig.foundryProject,
			remappings: { foo: 'bar' },
			libs: defaultConfig.libs,
			debug: false,
			cacheDir: defaultConfig.cacheDir,
		})
		expect(
			runSync(
				withDefaults({
					libs: ['lib1', 'lib2'],
				}),
			),
		).toEqual({
			jsonAsConst: defaultConfig.jsonAsConst,
			foundryProject: false,
			remappings: defaultConfig.remappings,
			libs: ['lib1', 'lib2'],
			debug: false,
			cacheDir: defaultConfig.cacheDir,
		})
	})

	it('should handle invalid jsonAsConst by using default', () => {
		const originalConsoleError = console.error
		console.error = vi.fn()

		// @ts-ignore - Testing invalid type
		expect(runSync(withDefaults({ jsonAsConst: 123 }))).toEqual({
			jsonAsConst: [],
			foundryProject: false,
			remappings: {},
			libs: [],
			debug: false,
			cacheDir: '.tevm',
		})

		expect(console.error).toHaveBeenCalledWith('Invalid jsonAsConst value must be a string or array of strings')
		console.error = originalConsoleError
	})
})

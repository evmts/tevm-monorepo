import { describe, expect, it } from 'vitest'

import { runSync } from 'effect/Effect'
import { defaultConfig, withDefaults } from './withDefaults.js'

describe(withDefaults.name, () => {
	it('should return the expected ResolvedConfig', () => {
		expect(runSync(withDefaults({}))).toEqual(defaultConfig)
		expect(
			runSync(
				withDefaults({
					jsonAbiAsConst: 'src/**/*.json',
					foundryProject: true,
					remappings: { foo: 'bar' },
					libs: ['lib1', 'lib2'],
				}),
			),
		).toEqual({
			jsonAbiAsConst: ['src/**/*.json'],
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
			jsonAbiAsConst: defaultConfig.jsonAbiAsConst,
			foundryProject: true,
			remappings: defaultConfig.remappings,
			libs: defaultConfig.libs,
			debug: false,
			cacheDir: defaultConfig.cacheDir,
		})
		expect(
			runSync(
				withDefaults({
					jsonAbiAsConst: ['src/**/*.json', 'test/**/*.json'],
					remappings: { foo: 'bar' },
				}),
			),
		).toEqual({
			jsonAbiAsConst: ['src/**/*.json', 'test/**/*.json'],
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
			jsonAbiAsConst: defaultConfig.jsonAbiAsConst,
			foundryProject: false,
			remappings: defaultConfig.remappings,
			libs: ['lib1', 'lib2'],
			debug: false,
			cacheDir: defaultConfig.cacheDir,
		})
	})
})

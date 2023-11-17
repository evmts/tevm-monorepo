import { describe, expect, it } from 'vitest'

import { defaultConfig, withDefaults } from './withDefaults.js'
import { runSync } from 'effect/Effect'

describe(withDefaults.name, () => {
	it('should return the expected ResolvedConfig', () => {
		expect(runSync(withDefaults({}))).toEqual(defaultConfig)
		expect(
			runSync(
				withDefaults({
					foundryProject: true,
					remappings: { foo: 'bar' },
					libs: ['lib1', 'lib2'],
				}),
			),
		).toEqual({
			foundryProject: true,
			remappings: { foo: 'bar' },
			libs: ['lib1', 'lib2'],
			debug: false,
		})
		expect(
			runSync(
				withDefaults({
					foundryProject: true,
				}),
			),
		).toEqual({
			foundryProject: true,
			remappings: defaultConfig.remappings,
			libs: defaultConfig.libs,
			debug: false,
		})
		expect(
			runSync(
				withDefaults({
					remappings: { foo: 'bar' },
				}),
			),
		).toEqual({
			foundryProject: defaultConfig.foundryProject,
			remappings: { foo: 'bar' },
			libs: defaultConfig.libs,
			debug: false,
		})
		expect(
			runSync(
				withDefaults({
					libs: ['lib1', 'lib2'],
				}),
			),
		).toEqual({
			foundryProject: false,
			remappings: defaultConfig.remappings,
			libs: ['lib1', 'lib2'],
			debug: false,
		})
	})
})

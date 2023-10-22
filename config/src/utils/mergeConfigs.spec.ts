import { mergeConfigs } from './mergeConfigs.js'
import { runSync } from 'effect/Effect'
import { describe, expect, it } from 'vitest'

describe(mergeConfigs.name, () => {
	it('should correctly merge multiple configurations', () => {
		const config1 = { remappings: { key1: 'value1' }, libs: ['lib1', 'lib2'] }
		const config2 = { remappings: { key2: 'value2' }, libs: ['lib3'] }
		const config3 = { foundryProject: 'forge' }

		const result = runSync(mergeConfigs([config1, config2, config3]))

		expect(result).toEqual({
			remappings: { key1: 'value1', key2: 'value2' },
			libs: ['lib3', 'lib1', 'lib2'],
			foundryProject: 'forge',
		})
	})

	it('should handle missing properties in configurations', () => {
		const config1 = { remappings: { key1: 'value1' } }
		const config2 = { libs: ['lib3'] }

		const result = runSync(mergeConfigs([config1, config2]))

		expect(result).toEqual({
			remappings: { key1: 'value1' },
			libs: ['lib3'],
			foundryProject: undefined,
		})
	})

	it('should deduplicate libraries', () => {
		const config1 = { libs: ['lib3', 'lib4'] }
		const config2 = { libs: ['lib1', 'lib2', 'lib2', 'lib3'] }

		const result = runSync(mergeConfigs([config1, config2]))

		expect(result).toEqual({
			remappings: {},
			libs: ['lib1', 'lib2', 'lib3', 'lib4'],
			foundryProject: undefined,
		})
	})
})

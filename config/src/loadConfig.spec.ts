import { loadConfig } from './index.js'
import { runSync } from 'effect/Effect'
import { join } from 'path'
import { describe, expect, it } from 'vitest'

describe(loadConfig.name, () => {
	it('should work in basic case', () => {
		expect(() =>
			runSync(loadConfig(join(__dirname, 'fixtures/basic'))),
		).toMatchInlineSnapshot('[Function]')
	})

	it('should work with jsconfig', () => {
		expect(() =>
			runSync(loadConfig(join(__dirname, 'fixtures/jsconfig'))),
		).toMatchInlineSnapshot('[Function]')
	})

	it('should work with jsonc (json with comments)', () => {
		expect(() =>
			runSync(loadConfig(join(__dirname, 'fixtures/jsonc'))),
		).toMatchInlineSnapshot('[Function]')
	})

	it('should work with foundry', () => {
		expect(() =>
			runSync(loadConfig(join(__dirname, 'fixtures/withFoundry'))),
		).toMatchInlineSnapshot('[Function]')
	})

	it('should throw an error if tsconfig.json does not exist', () => {
		expect(() =>
			runSync(loadConfig('nonexistentpath')),
		).toThrowErrorMatchingInlineSnapshot(
			'"Failed to find nonexistentpath/tsconfig.json"',
		)
	})

	it('should throw an error when the tsconfig.json is not valid', () => {
		expect(() =>
			runSync(loadConfig(join(__dirname, 'fixtures/invalid'))),
		).toThrowErrorMatchingInlineSnapshot('"Invalid tsconfig.json detected"')
	})

	it('should throw an error when the tsconfig.json is not valid json', () => {
		expect(() =>
			runSync(loadConfig(join(__dirname, 'fixtures/invalidJson'))),
		).toThrowErrorMatchingInlineSnapshot('"Failed to parse tsconfig.json"')
	})
})

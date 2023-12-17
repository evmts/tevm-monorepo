import { loadConfig } from './index.js'
import { LoadConfigError } from './loadConfig.js'
import { flip, runSync } from 'effect/Effect'
import { join } from 'path'
import { describe, expect, it } from 'vitest'

describe(loadConfig.name, () => {
	it('should work in basic case', () => {
		const config = loadConfig(join(__dirname, 'fixtures/basic'))
		expect({
			...runSync(config),
			remappings: Object.fromEntries(
				Object.entries(runSync(config).remappings).map(([a, b]) => [
					a,
					b.replace(process.cwd(), ''),
				]),
			),
		}).toMatchInlineSnapshot(`
			{
			  "cacheDir": ".cache",
			  "debug": false,
			  "foundryProject": false,
			  "libs": [
			    "mylib",
			  ],
			  "remappings": {},
			}
		`)
	})

	it('should work with jsconfig', () => {
		expect(() =>
			runSync(loadConfig(join(__dirname, 'fixtures/jsconfig'))),
		).toMatchInlineSnapshot('[Function]')
	})

	it('should work with jsonc (json with comments)', () => {
		expect(
			runSync(loadConfig(join(__dirname, 'fixtures/jsonc'))),
		).toMatchInlineSnapshot(`
			{
			  "cacheDir": ".tevm",
			  "debug": false,
			  "foundryProject": false,
			  "libs": [],
			  "remappings": {},
			}
		`)
	})

	it('should work with foundry', () => {
		expect(
			runSync(loadConfig(join(__dirname, 'fixtures/withFoundry'))),
		).toMatchInlineSnapshot(`
			{
			  "cacheDir": ".tevm",
			  "debug": false,
			  "foundryProject": true,
			  "libs": [
			    "lib",
			  ],
			  "remappings": {
			    "@solmate-utils/": "/Users/willcory/evmts-monorepo/bundler/config/src/fixtures/withFoundry/lib/solmate/src/utils/",
			  },
			}
		`)
	})

	it('should throw an error if tsconfig.json does not exist', () => {
		expect(() =>
			runSync(loadConfig('nonexistentpath')),
		).toThrowErrorMatchingSnapshot()
	})

	it('should throw an InvalidConfigError when the tsconfig.json is not valid', () => {
		const configEffect = loadConfig(join(__dirname, 'fixtures/invalid'))
		const errorChannel = flip(configEffect)
		const e = runSync(errorChannel)
		expect(e).toBeInstanceOf(LoadConfigError)
		expect(e._tag).toBe('InvalidConfigError')
		expect(e.name).toBe('InvalidConfigError')
		expect(
			e.message.startsWith('InvalidConfigError: Unable load config from'),
		).toBe(true)
	})

	it('should throw a InvalidConfigError when the tsconfig.json is not valid json', () => {
		const configEffect = loadConfig(join(__dirname, 'fixtures/invalidJson'))
		const errorChannel = flip(configEffect)
		const e = runSync(errorChannel)
		expect(e).toBeInstanceOf(LoadConfigError)
		expect(e._tag).toBe('InvalidConfigError')
		expect(e.name).toBe('InvalidConfigError')
		expect(
			e.message.startsWith('InvalidConfigError: Unable load config from'),
		).toBe(true)
	})
})

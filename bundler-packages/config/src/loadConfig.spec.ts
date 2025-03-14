import { join } from 'node:path'
import { flip, runSync } from 'effect/Effect'
import { describe, expect, it } from 'vitest'
import { loadConfig } from './index.js'
import { LoadConfigError } from './loadConfig.js'

describe(loadConfig.name, () => {
	it('should work in basic case', () => {
		const config = loadConfig(join(__dirname, 'fixtures/basic'))
		expect({
			...runSync(config),
			remappings: Object.fromEntries(
				Object.entries(runSync(config).remappings).map(([a, b]) => [a, b.replace(process.cwd(), '')]),
			),
		}).toMatchInlineSnapshot(`
			{
			  "cacheDir": ".cache",
			  "debug": false,
			  "foundryProject": false,
			  "jsonAsConst": [],
			  "libs": [
			    "mylib",
			  ],
			  "remappings": {},
			}
		`)
	})

	it('should work with jsconfig', () => {
		expect(() => runSync(loadConfig(join(__dirname, 'fixtures/jsconfig')))).toMatchInlineSnapshot('[Function]')
	})

	it('should work with jsonc (json with comments)', () => {
		expect(runSync(loadConfig(join(__dirname, 'fixtures/jsonc')))).toMatchInlineSnapshot(`
			{
			  "cacheDir": ".tevm",
			  "debug": false,
			  "foundryProject": false,
			  "jsonAsConst": [],
			  "libs": [],
			  "remappings": {},
			}
		`)
	})

	it('should work with foundry', () => {
		const res = runSync(loadConfig(join(__dirname, 'fixtures/withFoundry')))
		expect({
			...res,
			remappings: Object.fromEntries(Object.entries(res.remappings).map(([a, b]) => [a, b.replace(process.cwd(), '')])),
		}).toMatchInlineSnapshot(`
			{
			  "cacheDir": ".tevm",
			  "debug": false,
			  "foundryProject": true,
			  "jsonAsConst": [],
			  "libs": [
			    "lib",
			  ],
			  "remappings": {
			    "@solmate-utils/": "/src/fixtures/withFoundry/lib/solmate/src/utils/",
			  },
			}
		`)
	})

	it('should throw an error if tsconfig.json does not exist', () => {
		expect(() => runSync(loadConfig('nonexistentpath'))).toThrowErrorMatchingSnapshot()
	})

	it('should throw an InvalidConfigError when the tsconfig.json is not valid', () => {
		const configEffect = loadConfig(join(__dirname, 'fixtures/invalid'))
		const errorChannel = flip(configEffect)
		const e = runSync(errorChannel)
		expect(e).toBeInstanceOf(LoadConfigError)
		expect(e._tag).toBe('InvalidConfigError')
		expect(e.name).toBe('InvalidConfigError')
	})

	it('should throw a InvalidJsonError when the tsconfig.json is not valid json', () => {
		const configEffect = loadConfig(join(__dirname, 'fixtures/invalidJson'))
		const errorChannel = flip(configEffect)
		const e = runSync(errorChannel)
		expect(e._tag).toBe('InvalidJsonConfigError')
	})

	it('should be able to load a remappings.txt even when foundryConfig is not set', () => {
		const configEffect = loadConfig(join(__dirname, 'fixtures/withRemappingsTxt'))
		const config = runSync(configEffect)
		expect(config.remappings['@solmate-utils/']?.includes('lib/solmate/src/utils/')).toBe(true)
	})
})

import { describe, expect, it } from 'vitest'

import { FailedToReadConfigError, loadTsConfig } from './loadTsConfig.js'
import { runSync } from 'effect/Effect'
import { join } from 'path'

describe(loadTsConfig.name, () => {
	it('should correctly load a tsconfig.json', async () => {
		expect(
			runSync(loadTsConfig(join(__dirname, '../fixtures/basic'))),
		).toMatchInlineSnapshot(`
			{
			  "compilerOptions": {
			    "paths": {
			      "@/*": [
			        "./*",
			      ],
			    },
			    "plugins": [
			      {
			        "name": "@tevm/ts-plugin",
			      },
			    ],
			  },
			}
		`)
	})
	it('should load a jsconfig.json', async () => {
		expect(
			runSync(loadTsConfig(join(__dirname, '../fixtures/legacy-js'))),
		).toMatchInlineSnapshot(`
			{
			  "compilerOptions": {
			    "plugins": [
			      {
			        "name": "@tevm/ts-plugin",
			      },
			    ],
			  },
			}
		`)
	})
	it('should load a jsonc (json with comments)', async () => {
		expect(
			runSync(loadTsConfig(join(__dirname, '../fixtures/jsonc'))),
		).toMatchInlineSnapshot(`
			{
			  "compilerOptions": {
			    "plugins": [
			      {
			        "name": "@tevm/ts-plugin",
			      },
			    ],
			  },
			}
		`)
	})
	it(`should throw ${FailedToReadConfigError.name} if the file doesn't exist`, () => {
		expect(() =>
			runSync(loadTsConfig(join(__dirname, '../fixtures/doesntexist'))),
		).toThrowError(
			new FailedToReadConfigError(join(__dirname, '../fixtures/doesntexist')),
		)
	})
})

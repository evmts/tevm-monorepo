import { describe, expect, it } from 'vitest'

import {
	FailedToReadConfigError,
	InvalidTsConfigError,
	loadTsConfig,
} from './loadTsConfig.js'
import { ParseJsonError } from '@evmts/effect'
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
			        "name": "@evmts/ts-plugin",
			      },
			    ],
			  },
			}
		`)
	})
	it('should load a jsconfig.json', async () => {
		expect(
			runSync(loadTsConfig(join(__dirname, '../fixtures/js'))),
		).toMatchInlineSnapshot(`
			{
			  "compilerOptions": {
			    "plugins": [
			      {
			        "name": "@evmts/ts-plugin",
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
			        "name": "@evmts/ts-plugin",
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
	it(`should throw a ${ParseJsonError.name} if the file is invalid json`, () => {
		expect(() =>
			runSync(loadTsConfig(join(__dirname, '../fixtures/invalidJson'))),
		).toThrowError(new ParseJsonError())
	})
	it(`should throw a ${InvalidTsConfigError.name} if the file is invalid tsconfig`, () => {
		expect(() =>
			runSync(loadTsConfig(join(__dirname, '../fixtures/invalid'))),
		).toThrowError(new InvalidTsConfigError())
	})
})

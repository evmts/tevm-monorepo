import { describe, expect, it } from 'vitest'

import {
	FailedToReadConfigError,
	InvalidTsConfigError,
	loadTsConfig,
} from './loadTsConfig.js'
import { ParseJsonError } from './parseJson.js'
import { runSync } from 'effect/Effect'
import { readFileSync } from 'fs'
import { parse } from 'jsonc-parser'
import { join } from 'path'

describe(loadTsConfig.name, () => {
	it('should correctly load a tsconfig.json', async () => {
		expect(runSync(loadTsConfig(join(__dirname, '../fixtures/basic')))).toEqual(
			await import('../fixtures/basic/tsconfig.json'),
		)
	})
	it('should load a jsconfig.json', async () => {
		expect(runSync(loadTsConfig(join(__dirname, '../fixtures/js')))).toEqual(
			await import('../fixtures/js/jsconfig.json'),
		)
	})
	it('should load a jsonc (json with comments)', async () => {
		expect(runSync(loadTsConfig(join(__dirname, '../fixtures/js')))).toEqual(
			parse(readFileSync('../fixtures/js/tsconfig.json', 'utf8')),
		)
	})
	it(`should throw ${FailedToReadConfigError.name} if the file doesn't exist`, () => {
		expect(() =>
			runSync(loadTsConfig(join(__dirname, '../fixtures/doesntexist'))),
		).toThrowError(new FailedToReadConfigError('../fixtures/doesntexist'))
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

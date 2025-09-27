import { existsSync, readFileSync } from 'node:fs'
import { access, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { runPromise } from 'effect/Effect'
import { describe, expect, it } from 'vitest'
import { moduleFactory } from './moduleFactory.js'
import type { FileAccessObject } from './types.js'

const fao: FileAccessObject = {
	existsSync: existsSync,
	readFile: readFile,
	readFileSync: readFileSync,
	exists: async (file: string) => {
		try {
			await access(file)
			return true
		} catch (_e) {
			return false
		}
	},
}

class Fixture {
	constructor(public readonly name: string) {}
	dir = () => join(__dirname, 'fixtures', this.name)
	entrypoint = () => join(this.dir(), 'Contract.sol')
	rawCode = () => readFileSync(this.entrypoint(), 'utf8')
	remappings = () => {
		if (existsSync(join(this.dir(), 'remappings.json'))) {
			return JSON.parse(readFileSync(join(this.dir(), 'remappings.json'), 'utf8'))
		}
		return {}
	}
	libs = () => {
		if (existsSync(join(this.dir(), 'lib'))) {
			return [join(this.dir(), 'lib')]
		}
		return []
	}
}
const fixtures = {
	basic: new Fixture('basic'),
	withlib: new Fixture('withlib'),
	withremappings: new Fixture('withremappings'),
	noimports: new Fixture('noimports'),
	circular: new Fixture('circular'),
	unusualpaths: new Fixture('unusualpaths'),
	multilevel: new Fixture('multilevel'),
	withcomments: new Fixture('withcomments'),
	differentpragma: new Fixture('differentpragma'),
}

const absolutePathToNormalize = join(__dirname, '..', '..', '..')

describe('moduleFactory', () => {
	const cases: Array<Array<keyof typeof fixtures>> = [
		['basic'],
		['withlib'],
		['withremappings'],
		['noimports'],
		// ['circular'],
		['unusualpaths'],
		['multilevel'],
		['withcomments'],
		['differentpragma'],
	]

	it.each(cases)('should resolve correctly for case %s', async (testCase: keyof typeof fixtures) => {
		let runSyncronously = true
		let modules = await runPromise(
			moduleFactory(
				fixtures[testCase].entrypoint(),
				fixtures[testCase].rawCode(),
				fixtures[testCase].remappings(),
				fixtures[testCase].libs(),
				fao,
				runSyncronously,
			),
		)
		expect([...modules.keys()].map((key) => key.replace(absolutePathToNormalize, ''))).toMatchSnapshot()
		expect(
			JSON.stringify(modules.get(fixtures[testCase].entrypoint()), null, 2).replaceAll(absolutePathToNormalize, ''),
		).toMatchSnapshot()
		runSyncronously = false
		modules = await runPromise(
			moduleFactory(
				fixtures[testCase].entrypoint(),
				fixtures[testCase].rawCode(),
				fixtures[testCase].remappings(),
				fixtures[testCase].libs(),
				fao,
				runSyncronously,
			),
		)
		expect([...modules.keys()].map((key) => key.replace(absolutePathToNormalize, ''))).toMatchSnapshot()
		expect(
			JSON.stringify(modules.get(fixtures[testCase].entrypoint()), null, 2).replaceAll(absolutePathToNormalize, ''),
		).toMatchSnapshot()
	})

	it.skip('should throw when importing a non-existent file', async () => {
		const nonexistentFixture = new Fixture('nonexistent')
		expect(
			await moduleFactory(
				nonexistentFixture.entrypoint(),
				nonexistentFixture.rawCode(),
				nonexistentFixture.remappings(),
				nonexistentFixture.libs(),
				fao,
				true,
			),
		).rejects.toThrow()
	})

	it.skip('should throw when resolving absolute imports to non-existent files', async () => {
		const absoluteFixture = new Fixture('absolute')
		expect(
			await moduleFactory(
				absoluteFixture.entrypoint(),
				absoluteFixture.rawCode(),
				absoluteFixture.remappings(),
				absoluteFixture.libs(),
				fao,
				true,
			),
		).rejects.toThrow()
	})

	it.skip('should handle absolute imports with custom fs function', async () => {
		const absoluteFixture = new Fixture('absolute')
		const customFao: FileAccessObject = {
			...fao,
			readFileSync: (path: string, encoding: BufferEncoding) => {
				if (path === '/Users/williamcory/absolute/path/to/some/contract.sol') {
					return '// SPDX-License-Identifier: MIT\npragma solidity ^0.8.17;\n\ncontract AbsoluteContract {}'
				}
				return readFileSync(path, encoding)
			},
			readFile: async (path: string, encoding: BufferEncoding) => {
				if (path === '/Users/williamcory/absolute/path/to/some/contract.sol') {
					return '// SPDX-License-Identifier: MIT\npragma solidity ^0.8.17;\n\ncontract AbsoluteContract {}'
				}
				return readFile(path, encoding)
			},
			existsSync: (path: string) => {
				if (path === '/Users/williamcory/absolute/path/to/some/contract.sol') {
					return true
				}
				return existsSync(path)
			},
			exists: async (path: string) => {
				if (path === '/Users/williamcory/absolute/path/to/some/contract.sol') {
					return true
				}
				try {
					await access(path)
					return true
				} catch (_e) {
					return false
				}
			},
		}

		const modules = await runPromise(
			moduleFactory(
				absoluteFixture.entrypoint(),
				absoluteFixture.rawCode(),
				absoluteFixture.remappings(),
				absoluteFixture.libs(),
				customFao,
				false,
			),
		)

		// Should successfully resolve both imports
		expect(modules.size).toBeGreaterThan(1)
		expect(modules.has('/Users/williamcory/absolute/path/to/some/contract.sol')).toBeTruthy()
	})

	it.skip('should handle basic fixture correctly', async () => {
		const basicFixture = new Fixture('basic')

		const modules = await runPromise(
			moduleFactory(
				basicFixture.entrypoint(),
				basicFixture.rawCode(),
				basicFixture.remappings(),
				basicFixture.libs(),
				fao,
				false,
			),
		)

		const mainModule = modules.get(basicFixture.entrypoint())
		expect(mainModule?.code).toContain('pragma solidity >=0.8.0;')
	})
})

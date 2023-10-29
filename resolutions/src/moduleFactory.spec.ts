import { moduleFactory } from './moduleFactory.js'
import type { FileAccessObject } from './types.js'
import { runPromise, runSync } from 'effect/Effect'
import { existsSync, readFileSync } from 'fs'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { describe, expect, it } from 'vitest'

const fao: FileAccessObject = {
	existsSync: existsSync,
	readFile: readFile,
	readFileSync: readFileSync,
}

class Fixture {
	constructor(public readonly name: string) {}
	dir = () => join(__dirname, 'fixtures', this.name)
	entrypoint = () => join(this.dir(), 'Contract.sol')
	rawCode = () => readFileSync(this.entrypoint(), 'utf8')
	remappings = () => {
		if (existsSync(join(this.dir(), 'remappings.json'))) {
			return JSON.parse(
				readFileSync(join(this.dir(), 'remappings.json'), 'utf8'),
			)
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
}

const absolutePathToNormalize = join(__dirname, '..', '..', '..')

describe('moduleFactory', () => {
	const cases: Array<Array<keyof typeof fixtures>> = [
		['basic'],
		['withlib'],
		['withremappings'],
	]
	it.each(cases)(
		'should resolve correctly for case $s',
		async (testCase: keyof typeof fixtures) => {
			let runSyncronously = true
			let modules = runSync(
				moduleFactory(
					fixtures[testCase].entrypoint(),
					fixtures[testCase].rawCode(),
					fixtures[testCase].remappings(),
					fixtures[testCase].libs(),
					fao,
					runSyncronously,
				),
			)
			expect(modules.keys()).toMatchSnapshot()
			expect(
				JSON.stringify(
					modules.get(fixtures[testCase].entrypoint()),
					null,
					2,
				).replaceAll(absolutePathToNormalize, ''),
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
			expect(modules.keys()).toMatchSnapshot()
			expect(
				JSON.stringify(
					modules.get(fixtures[testCase].entrypoint()),
					null,
					2,
				).replaceAll(absolutePathToNormalize, ''),
			).toMatchSnapshot()
		},
	)
})

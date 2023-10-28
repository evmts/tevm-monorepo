import { flip, runPromise, runSync } from 'effect/Effect'
import { resolveImportPath } from './resolveImportPath.js'
import { describe, expect, it } from 'vitest'

describe('resolveImportPath', () => {
	it('should correctly resolve paths using Foundry remappings', () => {
		const remappings = {
			'key1/': '/path/to/key1',
			'key2/': '/path/to/key2',
		} as const

		const importPath = runPromise(resolveImportPath(
			'/project/src',
			'key1/somefile',
			remappings,
			[],
			false
		))
		expect(importPath).toMatchInlineSnapshot('"/path/to/key1somefile"')

		const importPath2 = runPromise(resolveImportPath(
			'/project/src',
			'key2/somefile',
			remappings,
			[],
			false
		))
		expect(importPath2).toMatchInlineSnapshot('"/path/to/key2somefile"')
	})
	it('should correctly resolve paths using Foundry remappings syncronously', () => {
		const remappings = {
			'key1/': '/path/to/key1',
			'key2/': '/path/to/key2',
		} as const

		const importPath = runSync(resolveImportPath(
			'/project/src',
			'key1/somefile',
			remappings,
			[],
			true
		))
		expect(importPath).toMatchInlineSnapshot('"/path/to/key1somefile"')

		const importPath2 = runSync(resolveImportPath(
			'/project/src',
			'key2/somefile',
			remappings,
			[],
			true
		))
		expect(importPath2).toMatchInlineSnapshot('"/path/to/key2somefile"')
	})

	it('should correctly resolve local imports', () => {
		const importPath = runPromise(resolveImportPath('/project/src', './somefile', {}, [], false))
		expect(importPath).toMatchInlineSnapshot('"/project/somefile"')
	})

	it('should correctly resolve with node resolution', () => {
		const importPath = runPromise(resolveImportPath('/project/src', 'somemodule', {}, [
			'../node_modules',
		], false))
		// Assuming somemodule can be found in ../node_modules/somemodule
		expect(importPath).toMatchInlineSnapshot('"somemodule"')
	})

	it('should return an error if not able to resolve', async () => {
		let error = await runPromise(flip(resolveImportPath('/project/src', 'somemodule', {}, [], false)))
		expect(error).toMatchInlineSnapshot()
		error = runSync(flip(resolveImportPath('/project/src', 'somemodule', {}, [], true)))
		expect(error).toMatchInlineSnapshot()
	})
})

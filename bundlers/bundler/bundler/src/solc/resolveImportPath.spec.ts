import { resolveImportPath } from './resolveImportPath'
import { describe, expect, it } from 'vitest'

describe('resolveImportPath', () => {
	it('should correctly resolve paths using Foundry remappings', () => {
		const remappings = {
			'key1/': '/path/to/key1',
			'key2/': '/path/to/key2',
		} as const

		const importPath = resolveImportPath(
			'/project/src',
			'key1/somefile',
			remappings,
			[],
		)
		expect(importPath).toMatchInlineSnapshot('"/path/to/key1somefile"')

		const importPath2 = resolveImportPath(
			'/project/src',
			'key2/somefile',
			remappings,
			[],
		)
		expect(importPath2).toMatchInlineSnapshot('"/path/to/key2somefile"')
	})

	it('should correctly resolve local imports', () => {
		const importPath = resolveImportPath('/project/src', './somefile', {}, [])
		expect(importPath).toMatchInlineSnapshot('"/project/somefile"')
	})

	it('should correctly resolve with node resolution', () => {
		const importPath = resolveImportPath('/project/src', 'somemodule', {}, [
			'../node_modules',
		])
		// Assuming somemodule can be found in ../node_modules/somemodule
		expect(importPath).toMatchInlineSnapshot('"somemodule"')
	})

	it('should return the import path itself if not able to resolve', () => {
		const importPath = resolveImportPath('/project/src', 'somemodule', {}, [])
		// Assuming somemodule can't be found in the base directory
		expect(importPath).toMatchInlineSnapshot('"somemodule"')
	})
})

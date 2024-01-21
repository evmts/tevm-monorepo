import { resolveImportPath } from './resolveImportPath.js'
import { flip, runPromise, runSync } from 'effect/Effect'
import { describe, expect, it } from 'vitest'

describe('resolveImportPath', () => {
	it('should correctly resolve paths using Foundry remappings', async () => {
		const remappings = {
			'key1/': '/path/to/key1',
			'key2/': '/path/to/key2',
		} as const

		const importPath = await runPromise(
			resolveImportPath('/project/src', 'key1/somefile', remappings, [], false),
		)
		expect(importPath).toMatchInlineSnapshot('"/path/to/key1somefile"')

		const importPath2 = await runPromise(
			resolveImportPath('/project/src', 'key2/somefile', remappings, [], false),
		)
		expect(importPath2).toMatchInlineSnapshot('"/path/to/key2somefile"')
	})
	it('should correctly resolve paths using Foundry remappings syncronously', async () => {
		const remappings = {
			'key1/': '/path/to/key1',
			'key2/': '/path/to/key2',
		} as const

		const importPath = runSync(
			resolveImportPath('/project/src', 'key1/somefile', remappings, [], true),
		)
		expect(importPath).toMatchInlineSnapshot('"/path/to/key1somefile"')

		const importPath2 = runSync(
			resolveImportPath('/project/src', 'key2/somefile', remappings, [], true),
		)
		expect(importPath2).toMatchInlineSnapshot('"/path/to/key2somefile"')
	})

	it('should correctly resolve local imports', async () => {
		const importPath = await runPromise(
			resolveImportPath('/project/src', './somefile', {}, [], false),
		)
		expect(importPath).toMatchInlineSnapshot('"/project/somefile"')
	})

	it('should return an error if not able to resolve', async () => {
		let error = await runPromise(
			flip(resolveImportPath('/project/src', 'somemodule', {}, [], false)),
		)
		expect(error).toMatchInlineSnapshot(
			'[CouldNotResolveImportError: Could not resolve import somemodule from /project/src. Please check your remappings and libraries.]',
		)
		error = runSync(
			flip(resolveImportPath('/project/src', 'somemodule', {}, [], true)),
		)
		expect(error).toMatchInlineSnapshot(
			'[CouldNotResolveImportError: Could not resolve import somemodule from /project/src. Please check your remappings and libraries.]',
		)
	})
})

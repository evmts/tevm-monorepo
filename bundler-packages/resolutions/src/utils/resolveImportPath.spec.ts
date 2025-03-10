import { flip, runPromise, runSync } from 'effect/Effect'
import { describe, expect, it } from 'vitest'
import { resolveImportPath } from './resolveImportPath.js'

describe('resolveImportPath', () => {
	it('should correctly resolve paths using Foundry remappings', async () => {
		const remappings = {
			'key1/': '/path/to/key1',
			'key2/': '/path/to/key2',
		} as const

		const importPath = await runPromise(resolveImportPath('/project/src', 'key1/somefile', remappings, [], false))
		expect(importPath).toMatchInlineSnapshot('"/path/to/key1somefile"')

		const importPath2 = await runPromise(resolveImportPath('/project/src', 'key2/somefile', remappings, [], false))
		expect(importPath2).toMatchInlineSnapshot('"/path/to/key2somefile"')
	})
	it('should correctly resolve paths using Foundry remappings syncronously', async () => {
		const remappings = {
			'key1/': '/path/to/key1',
			'key2/': '/path/to/key2',
		} as const

		const importPath = runSync(resolveImportPath('/project/src', 'key1/somefile', remappings, [], true))
		expect(importPath).toMatchInlineSnapshot('"/path/to/key1somefile"')

		const importPath2 = runSync(resolveImportPath('/project/src', 'key2/somefile', remappings, [], true))
		expect(importPath2).toMatchInlineSnapshot('"/path/to/key2somefile"')
	})

	it('should correctly resolve local imports', async () => {
		const importPath = await runPromise(resolveImportPath('/project/src', './somefile', {}, [], false))
		expect(importPath).toMatchInlineSnapshot('"/project/somefile"')
	})

	it('should return an error if not able to resolve', async () => {
		// Use a path we know won't resolve
		let error = await runPromise(flip(resolveImportPath(process.cwd(), 'non-existent-module-12345', {}, [], false)))
		expect(error._tag).toBe('CouldNotResolveImportError')
		expect(error.message).toContain('Could not resolve import non-existent-module-12345')

		// Test sync path
		error = runSync(flip(resolveImportPath(process.cwd(), 'non-existent-module-12345', {}, [], true)))
		expect(error._tag).toBe('CouldNotResolveImportError')
		expect(error.message).toContain('Could not resolve import non-existent-module-12345')
	})
})

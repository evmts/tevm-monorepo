import { updateImportPaths } from './updateImportPath.js'
import { runSync } from 'effect/Effect'
import { describe, expect, it } from 'vitest'

describe('updateImportPaths', () => {
	it('should update all import paths', () => {
		const mockCode = `import something from "./oldPath1";
import somethingElse from "./oldPath2";
    `
		const mockResolvedImports = [
			{
				original: './oldPath1',
				updated: './newPath1',
				absolute: '/path/to/newPath1',
			},
			{
				original: './oldPath2',
				updated: './newPath2',
				absolute: '/path/to/newPath2',
			},
		]

		const result = runSync(updateImportPaths(mockCode, mockResolvedImports))

		expect(result).toContain('import something from "./newPath1";')
		expect(result).toContain('import somethingElse from "./newPath2";')
	})

	it('should update some import paths', () => {
		const mockCode = `import something from "./oldPath1";
import somethingElse from "./oldPath2";
    `
		const mockResolvedImports = [
			{
				original: './oldPath1',
				updated: './newPath1',
				absolute: '/path/to/newPath1',
			},
		]

		const result = runSync(updateImportPaths(mockCode, mockResolvedImports))

		expect(result).toContain('import something from "./newPath1";')
		expect(result).toContain('import somethingElse from "./oldPath2";')
	})

	it('should not update import paths if none match', () => {
		const mockCode = `import something from "./oldPath1";
import somethingElse from "./oldPath2";
    `
		const mockResolvedImports = [
			{
				original: './notPresent1',
				updated: './newPath1',
				absolute: '/path/to/newPath1',
			},
			{
				original: './notPresent2',
				updated: './newPath2',
				absolute: '/path/to/newPath2',
			},
		]

		const result = runSync(updateImportPaths(mockCode, mockResolvedImports))

		expect(result).toContain('import something from "./oldPath1";')
		expect(result).toContain('import somethingElse from "./oldPath2";')
	})

	it('should return the original code if no imports present', () => {
		const mockCode = `console.log("No imports here!");`
		const mockResolvedImports = [
			{
				original: './oldPath1',
				updated: './newPath1',
				absolute: '/path/to/newPath1',
			},
		]

		const result = runSync(updateImportPaths(mockCode, mockResolvedImports))

		expect(result).toBe(mockCode)
	})
})

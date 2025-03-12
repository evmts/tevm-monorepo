import { runSync } from 'effect/Effect'
import { describe, expect, it } from 'vitest'
import { updateImportPath, updateImportPaths } from './updateImportPath.js'

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

	// Additional tests for edge cases
	it('should handle imports with different quote styles', () => {
		const mockCode = `import single from './singleQuote';
import double from "./doubleQuote";
    `
		const mockResolvedImports = [
			{
				original: './singleQuote',
				updated: './newSingleQuote',
				absolute: '/path/to/newSingleQuote',
			},
			{
				original: './doubleQuote',
				updated: './newDoubleQuote',
				absolute: '/path/to/newDoubleQuote',
			},
		]

		const result = runSync(updateImportPaths(mockCode, mockResolvedImports))

		expect(result).toContain("import single from './newSingleQuote';")
		expect(result).toContain('import double from "./newDoubleQuote";')
	})

	it('should handle imports with extra spaces and comments', () => {
		const mockCode = `// Header comment
import something from  "./oldPath1"  ; // End comment
/* Block comment */
import  somethingElse  from  "./oldPath2"  ; // Another comment
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

		expect(result).toContain('import something from  "./newPath1"  ; // End comment')
		expect(result).toContain('import  somethingElse  from  "./newPath2"  ; // Another comment')
	})
})

describe('updateImportPath', () => {
	it('should update a single import path', () => {
		const source = `import { ContractType } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";`
		const result = updateImportPath(source, '@openzeppelin/contracts/token/ERC721/ERC721.sol', 'ERC721.sol')
		expect(result).toBe(`import { ContractType } from "ERC721.sol";`)
	})

	it('should handle multiple occurrences of the same import path', () => {
		const source = `import { A } from "path/to/Contract.sol";
import { B } from "path/to/Contract.sol";`
		const result = updateImportPath(source, 'path/to/Contract.sol', 'Contract.sol')
		expect(result).toBe(`import { A } from "Contract.sol";
import { B } from "Contract.sol";`)
	})

	it('should handle different import syntaxes', () => {
		// Named imports
		let source = 'import {Symbol1, Symbol2} from "path/to/Contract.sol";'
		let result = updateImportPath(source, 'path/to/Contract.sol', 'Contract.sol')
		expect(result).toBe('import {Symbol1, Symbol2} from "Contract.sol";')

		// Direct import
		source = 'import "path/to/Contract.sol";'
		result = updateImportPath(source, 'path/to/Contract.sol', 'Contract.sol')
		expect(result).toBe('import "Contract.sol";')
	})

	it('should handle both single and double quotes', () => {
		const source = `import { A } from "path/to/Contract.sol";
import { B } from 'path/to/OtherContract.sol';`

		const result1 = updateImportPath(source, 'path/to/Contract.sol', 'Contract.sol')
		expect(result1).toBe(`import { A } from "Contract.sol";
import { B } from 'path/to/OtherContract.sol';`)

		const result2 = updateImportPath(result1, 'path/to/OtherContract.sol', 'OtherContract.sol')
		expect(result2).toBe(`import { A } from "Contract.sol";
import { B } from 'OtherContract.sol';`)
	})
})

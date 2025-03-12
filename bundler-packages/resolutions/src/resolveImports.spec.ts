import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { runSync } from 'effect/Effect'
import { beforeAll, describe, expect, it } from 'vitest'
import { resolveImports } from './resolveImports.js'
import type { ResolvedImport } from './types.js'

const repoDir = join(__dirname, '..', '..', '..')
const normalizeImports = (imports: ReadonlyArray<ResolvedImport>) => {
	return imports.map((i) => ({
		...i,
		absolute: i.absolute.replace(repoDir, ''),
		original: i.original.replace(repoDir, ''),
		updated: i.updated.replace(repoDir, ''),
	}))
}

describe('resolveImports', () => {
	it('should correctly resolve local imports', () => {
		const code = `import { WagmiMintExample } from "../fixtures/basic/Contract.sol"`
		const imports = runSync(resolveImports(__dirname, code, {}, [], true))

		expect(normalizeImports(imports)).toMatchInlineSnapshot(`
			[
			  {
			    "absolute": "/bundler-packages/fixtures/basic/Contract.sol",
			    "original": "../fixtures/basic/Contract.sol",
			    "updated": "/bundler-packages/fixtures/basic/Contract.sol",
			  },
			]
		`)
	})

	it('should correctly resolve non-local imports', () => {
		const code = `import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol"`
		const imports = runSync(resolveImports(__dirname, code, {}, [], true))

		expect(normalizeImports(imports)).toMatchInlineSnapshot(`
			[
			  {
			    "absolute": "/bundler-packages/resolutions/node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol",
			    "original": "@openzeppelin/contracts/token/ERC20/ERC20.sol",
			    "updated": "/bundler-packages/resolutions/node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol",
			  },
			]
		`)
	})

	it('should correctly handle multiple imports', () => {
		const code = `import { WagmiMintExample } from "../fixtures/basic/Contract.sol"
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol"
        `
		const imports = runSync(resolveImports(__dirname, code, {}, [], true))

		expect(normalizeImports(imports)).toMatchInlineSnapshot(`
			[
			  {
			    "absolute": "/bundler-packages/fixtures/basic/Contract.sol",
			    "original": "../fixtures/basic/Contract.sol",
			    "updated": "/bundler-packages/fixtures/basic/Contract.sol",
			  },
			  {
			    "absolute": "/bundler-packages/resolutions/node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol",
			    "original": "@openzeppelin/contracts/token/ERC20/ERC20.sol",
			    "updated": "/bundler-packages/resolutions/node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol",
			  },
			]
		`)
	})

	it('should return an empty array if there are no imports', () => {
		const code = 'const x = 10'
		const imports = runSync(resolveImports(__dirname, code, {}, [], true))

		expect(normalizeImports(imports)).toMatchInlineSnapshot('[]')
	})

	it('should throw an error if import path does not exist', () => {
		const code = 'import { Something } from ""'
		expect(() => runSync(resolveImports('/project/src', code, {}, [], true))).toThrowErrorMatchingInlineSnapshot(
			'[(FiberFailure) ImportDoesNotExistError: Import does not exist]',
		)
	})

	it('should correctly resolve import nothing statements', () => {
		const code = 'import "./something"'
		const imports = runSync(resolveImports('/project/src', code, {}, [], true))
		expect(normalizeImports(imports)).toMatchInlineSnapshot(`
			[
			  {
			    "absolute": "/project/something",
			    "original": "./something",
			    "updated": "/project/something",
			  },
			]
		`)
	})

	it('should ignore lines that resemble import statements', () => {
		const code = 'console.log("import { Something } from \\"./something\\"")'
		const imports = runSync(resolveImports('/project/src', code, {}, [], true))
		expect(normalizeImports(imports)).toMatchInlineSnapshot('[]')
	})

	it('should die if non string is passed in for absolute path', () => {
		const code = 'console.log("import { Something } from \\"./something\\"")'
		expect(() => runSync(resolveImports(52n as any, code, {}, [], true))).toThrowErrorMatchingInlineSnapshot(
			'[(FiberFailure) Error: Type bigint is not of type string]',
		)
	})

	it('should die if non string is passed in for absolute path', () => {
		const code = 52n as any
		expect(() => runSync(resolveImports('/project/src', code, {}, [], true))).toThrowErrorMatchingInlineSnapshot(
			'[(FiberFailure) Error: Type bigint is not of type string]',
		)
	})

	it('should die if non boolean is passed in for sync', () => {
		expect(() =>
			runSync(resolveImports('/project/src', "import {Foo} from 'bar'", {}, [], 5 as any)),
		).toThrowErrorMatchingInlineSnapshot('[(FiberFailure) Error: Type number is not of type boolean]')
	})

	// Additional test cases for new fixtures
	describe('Advanced import scenarios', () => {
		it('should process a contract with no imports', () => {
			const filePath = join(__dirname, './fixtures/noimports/Contract.sol')
			const source = readFileSync(filePath, 'utf8')
			const result = runSync(resolveImports(filePath, source, {}, [], true))
			expect(result).toHaveLength(0)
		})

		it('should handle circular imports correctly', () => {
			const filePath = join(__dirname, './fixtures/circular/ContractA.sol')
			const source = readFileSync(filePath, 'utf8')
			const result = runSync(resolveImports(filePath, source, {}, [], true))
			expect(result).toHaveLength(1)
			expect(result[0].original).toBe('./ContractB.sol')

			// Verify ContractB imports ContractA
			const contractBPath = join(__dirname, './fixtures/circular/ContractB.sol')
			const contractBSource = readFileSync(contractBPath, 'utf8')
			const resultB = runSync(resolveImports(contractBPath, contractBSource, {}, [], true))
			expect(resultB).toHaveLength(1)
			expect(resultB[0].original).toBe('./ContractA.sol')
		})

		it('should handle paths with spaces', () => {
			const filePath = join(__dirname, './fixtures/unusualpaths/Contract.sol')
			const source = readFileSync(filePath, 'utf8')
			const result = runSync(resolveImports(filePath, source, {}, [], true))
			expect(result).toHaveLength(1)
			expect(result[0].original).toBe('./Path With Spaces.sol')
		})

		it('should handle multi-level imports', () => {
			const filePath = join(__dirname, './fixtures/multilevel/Contract.sol')
			const source = readFileSync(filePath, 'utf8')
			const result = runSync(resolveImports(filePath, source, {}, [], true))
			expect(result).toHaveLength(1)
			expect(result[0].original).toBe('./level1/ContractLevel1.sol')

			// Verify level 1 imports level 2
			const level1Path = join(__dirname, './fixtures/multilevel/level1/ContractLevel1.sol')
			const level1Source = readFileSync(level1Path, 'utf8')
			const level1Result = runSync(resolveImports(level1Path, level1Source, {}, [], true))
			expect(level1Result).toHaveLength(1)
			expect(level1Result[0].original).toBe('../level2/ContractLevel2.sol')

			// Verify level 2 imports level 3
			const level2Path = join(__dirname, './fixtures/multilevel/level2/ContractLevel2.sol')
			const level2Source = readFileSync(level2Path, 'utf8')
			const level2Result = runSync(resolveImports(level2Path, level2Source, {}, [], true))
			expect(level2Result).toHaveLength(1)
			expect(level2Result[0].original).toBe('../level3/ContractLevel3.sol')
		})

		it('should handle imports with comments and only import real imports', () => {
			const filePath = join(__dirname, './fixtures/withcomments/Contract.sol')
			const source = readFileSync(filePath, 'utf8')
			const result = runSync(resolveImports(filePath, source, {}, [], true))
			expect(result).toHaveLength(1)
			expect(result[0].original).toBe('./ImportedContract.sol')
		})

		it('should handle contracts with different pragma versions', () => {
			const filePath = join(__dirname, './fixtures/differentpragma/Contract.sol')
			const source = readFileSync(filePath, 'utf8')
			const result = runSync(resolveImports(filePath, source, {}, [], true))
			expect(result).toHaveLength(1)
			expect(result[0].original).toBe('./OlderContract.sol')

			// Verify the pragma version in imported contract is different
			const importedResult = readFileSync(result[0].absolute, 'utf8')
			expect(importedResult).toContain('pragma solidity ^0.7.6')
		})

		it('should throw when importing a non-existent file', () => {
			const filePath = join(__dirname, './fixtures/nonexistent/Contract.sol')
			const source = readFileSync(filePath, 'utf8')
			expect(() => runSync(resolveImports(filePath, source, {}, [], true))).toThrow()
		})

		it('should attempt to resolve absolute imports', () => {
			const filePath = join(__dirname, './fixtures/absolute/Contract.sol')
			const source = readFileSync(filePath, 'utf8')

			// This will throw on the second import which doesn't exist
			expect(() => runSync(resolveImports(filePath, source, {}, [], true))).toThrow()

			// Mock the filesystem to handle the absolute import
			const mockFs = (path: string) => {
				if (path === '/Users/williamcory/absolute/path/to/some/contract.sol') {
					return '// Mock content for absolute import'
				}
				return readFileSync(path, 'utf8')
			}

			const result = runSync(resolveImports(filePath, source, {}, [], true, mockFs as any))
			expect(result).toHaveLength(2)
			expect(result[0].original).toBe(
				'/Users/williamcory/tevm-monorepo/bundler-packages/resolutions/src/fixtures/basic/Contract.sol',
			)
			expect(result[1].original).toBe('/Users/williamcory/absolute/path/to/some/contract.sol')
		})
	})
})

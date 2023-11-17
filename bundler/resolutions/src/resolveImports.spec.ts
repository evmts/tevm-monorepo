import { resolveImports } from './resolveImports.js'
import type { ResolvedImport } from './types.js'
import { runSync } from 'effect/Effect'
import { join } from 'path'
import { describe, expect, it } from 'vitest'

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
			    "absolute": "/bundler/fixtures/basic/Contract.sol",
			    "original": "../fixtures/basic/Contract.sol",
			    "updated": "/bundler/fixtures/basic/Contract.sol",
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
			    "absolute": "/bundler/resolutions/node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol",
			    "original": "@openzeppelin/contracts/token/ERC20/ERC20.sol",
			    "updated": "/bundler/resolutions/node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol",
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
			    "absolute": "/bundler/fixtures/basic/Contract.sol",
			    "original": "../fixtures/basic/Contract.sol",
			    "updated": "/bundler/fixtures/basic/Contract.sol",
			  },
			  {
			    "absolute": "/bundler/resolutions/node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol",
			    "original": "@openzeppelin/contracts/token/ERC20/ERC20.sol",
			    "updated": "/bundler/resolutions/node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol",
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
		expect(() =>
			runSync(resolveImports('/project/src', code, {}, [], true)),
		).toThrowErrorMatchingInlineSnapshot('"Import does not exist"')
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
		expect(() =>
			runSync(resolveImports(52n as any, code, {}, [], true)),
		).toThrowErrorMatchingInlineSnapshot('"Type bigint is not of type string"')
	})

	it('should die if non string is passed in for absolute path', () => {
		const code = 52n as any
		expect(() =>
			runSync(resolveImports('/project/src', code, {}, [], true)),
		).toThrowErrorMatchingInlineSnapshot('"Type bigint is not of type string"')
	})

	it('should die if non boolean is passed in for sync', () => {
		expect(() =>
			runSync(
				resolveImports(
					'/project/src',
					"import {Foo} from 'bar'",
					{},
					[],
					5 as any,
				),
			),
		).toThrowErrorMatchingInlineSnapshot('"Type number is not of type boolean"')
	})
})

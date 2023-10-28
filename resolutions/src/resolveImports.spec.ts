import { resolveImports } from './resolveImports.js'
import { runSync } from 'effect/Effect'
import { describe, expect, it } from 'vitest'

describe('resolveImports', () => {
	it('should correctly resolve local imports', () => {
		const code = `import { Something } from "./something"`
		const imports = runSync(resolveImports('/project/src', code))

		expect(imports).toMatchInlineSnapshot(`
			[
			  "/project/something",
			]
		`)
	})

	it('should correctly resolve non-local imports', () => {
		const code = `import { Something } from "some-module"`
		const imports = runSync(resolveImports('/project/src', code))

		expect(imports).toMatchInlineSnapshot(`
			[
			  "some-module",
			]
		`)
	})

	it('should correctly handle multiple imports', () => {
		const code = `
import { Something } from "./something"
import { Other } from "other-module"
        `
		const imports = runSync(resolveImports('/project/src', code))

		expect(imports).toMatchInlineSnapshot(`
			[
			  "/project/something",
			  "other-module",
			]
		`)
	})

	it('should return an empty array if there are no imports', () => {
		const code = 'const x = 10'
		const imports = runSync(resolveImports('/project/src', code))

		expect(imports).toMatchInlineSnapshot('[]')
	})

	it('should throw an error if import path does not exist', () => {
		const code = 'import { Something } from ""'
		expect(() =>
			runSync(resolveImports('/project/src', code)),
		).toThrowErrorMatchingInlineSnapshot('"Import does not exist"')
	})

	it('should correctly resolve import nothing statements', () => {
		const code = 'import "./something"'
		const imports = runSync(resolveImports('/project/src', code))
		expect(imports).toMatchInlineSnapshot('[]')
	})

	it('should ignore lines that resemble import statements', () => {
		const code = 'console.log("import { Something } from \\"./something\\"")'
		const imports = runSync(resolveImports('/project/src', code))
		expect(imports).toMatchInlineSnapshot('[]')
	})
})

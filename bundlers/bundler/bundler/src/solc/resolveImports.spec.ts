import { resolveImports } from './resolveImports'
import { describe, expect, it } from 'vitest'

describe('resolveImports', () => {
	it('should correctly resolve local imports', () => {
		const code = `import { Something } from "./something"`
		const imports = resolveImports('/project/src', code)

		expect(imports).toMatchInlineSnapshot(`
      [
        "/project/something",
      ]
    `)
	})

	it('should correctly resolve non-local imports', () => {
		const code = `import { Something } from "some-module"`
		const imports = resolveImports('/project/src', code)

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
		const imports = resolveImports('/project/src', code)

		expect(imports).toMatchInlineSnapshot(`
      [
        "/project/something",
        "other-module",
      ]
    `)
	})

	it('should return an empty array if there are no imports', () => {
		const code = 'const x = 10'
		const imports = resolveImports('/project/src', code)

		expect(imports).toMatchInlineSnapshot('[]')
	})

	it('should throw an error if import path does not exist', () => {
		const code = 'import { Something } from ""'
		expect(() =>
			resolveImports('/project/src', code),
		).toThrowErrorMatchingInlineSnapshot('"expected import path to exist"')
	})

	it('should correctly resolve import nothing statements', () => {
		const code = 'import "./something"'
		const imports = resolveImports('/project/src', code)
		expect(imports).toMatchInlineSnapshot(`
          [
            "/project/something",
          ]
        `)
	})

	it('should ignore lines that resemble import statements', () => {
		const code = 'console.log("import { Something } from \\"./something\\"")'
		const imports = resolveImports('/project/src', code)
		expect(imports).toMatchInlineSnapshot('[]')
	})
})

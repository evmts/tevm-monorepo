import * as ts from 'typescript/lib/tsserverlibrary.js'
import { describe, expect, it } from 'vitest'
import { findNode } from './findNode.js'

describe('findNode', () => {
	it('should find the correct node', () => {
		const sourceFile = ts.createSourceFile(
			'test.ts',
			`const x = 42;
				const y = 42;
				const fn = () => {
					return x + y;
				}
				export { fn }
				`,
			ts.ScriptTarget.ES2015,
			true,
			ts.ScriptKind.TS,
		)

		const node0 = findNode(sourceFile, 0)
		expect(node0?.getText()).toMatchInlineSnapshot('"const x = 42"')

		const node7 = findNode(sourceFile, 7)
		expect(node7?.getText()).toMatchInlineSnapshot('"x"')

		const node20 = findNode(sourceFile, 20)
		expect(node20?.getText()).toMatchInlineSnapshot('"const y = 42"')

		const node40 = findNode(sourceFile, 40)
		expect(node40?.getText()).toMatchInlineSnapshot('"fn"')

		const nodeOutOfRange = findNode(sourceFile, 100)
		expect(nodeOutOfRange).toBeNull()
	})

	it('should throw if negative position', () => {
		const sourceFile = ts.createSourceFile(
			'test.ts',
			`const x = 42;
				const y = 42;
				const fn = () => {
					return x + y;
				}
				export { fn }
				`,
			ts.ScriptTarget.ES2015,
			true,
			ts.ScriptKind.TS,
		)

		expect(() => findNode(sourceFile, -1)).toThrowErrorMatchingInlineSnapshot('[Error: Position must be non-negative]')
	})

	it('should throw if non-integer position', () => {
		const sourceFile = ts.createSourceFile(
			'test.ts',
			`const x = 42;
				const y = 42;
				const fn = () => {
					return x + y;
				}
				export { fn }
				`,
			ts.ScriptTarget.ES2015,
			true,
			ts.ScriptKind.TS,
		)
		expect(() => findNode(sourceFile, 1.5)).toThrowErrorMatchingInlineSnapshot('[Error: Position must be an integer]')
	})

	it('should find nodes within nested expressions', () => {
		const sourceFile = ts.createSourceFile(
			'test.ts',
			`function complex() {
				if (true) {
					const nestedVar = { key: "value" };
					return nestedVar.key;
				}
			}`,
			ts.ScriptTarget.ES2015,
			true,
			ts.ScriptKind.TS,
		)

		// Position pointing to the object property 'key'
		const objectPropertyNode = findNode(sourceFile, 65)
		expect(objectPropertyNode?.getText()).toMatchInlineSnapshot('"key"')

		// Position pointing to the property access 'nestedVar.key'
		const propertyAccessNode = findNode(sourceFile, 85)
		expect(propertyAccessNode?.getText()).toMatchInlineSnapshot('"nestedVar.key"')
	})

	it('should handle boundary positions correctly', () => {
		const sourceFile = ts.createSourceFile(
			'test.ts',
			`const arr = [1, 2, 3];`,
			ts.ScriptTarget.ES2015,
			true,
			ts.ScriptKind.TS,
		)

		// Position exactly at the start of the array literal
		const arrayStartNode = findNode(sourceFile, 12)
		expect(arrayStartNode?.getText()).toMatchInlineSnapshot('"[1, 2, 3]"')

		// Position exactly at the end of the array literal
		const arrayEndNode = findNode(sourceFile, 20)
		expect(arrayEndNode?.getText()).toMatchInlineSnapshot('"[1, 2, 3]"')
	})
})
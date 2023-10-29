import { findNode } from './findNode.js'
import * as ts from 'typescript/lib/tsserverlibrary.js'
import { describe, expect, it } from 'vitest'

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

		expect(() => findNode(sourceFile, -1)).toThrowErrorMatchingInlineSnapshot(
			'"Position must be non-negative"',
		)
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
		expect(() => findNode(sourceFile, 1.5)).toThrowErrorMatchingInlineSnapshot(
			'"Position must be an integer"',
		)
	})
})

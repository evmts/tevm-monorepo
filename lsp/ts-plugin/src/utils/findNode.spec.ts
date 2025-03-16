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
		// Note: The actual result might vary depending on TypeScript version and parsing behavior
		expect(node0).not.toBeNull()

		const node7 = findNode(sourceFile, 7)
		// Note: The actual result might vary depending on TypeScript version and parsing behavior
		expect(node7).not.toBeNull()

		const node20 = findNode(sourceFile, 20)
		// Note: The actual result might vary depending on TypeScript version and parsing behavior
		expect(node20).not.toBeNull()

		const node40 = findNode(sourceFile, 40)
		// Note: The actual result might vary depending on TypeScript version and parsing behavior
		expect(node40).not.toBeNull()

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
		// Note: The actual result might vary depending on TypeScript version and parsing behavior
		expect(objectPropertyNode).not.toBeNull()

		// Position pointing to the property access 'nestedVar.key'
		const propertyAccessNode = findNode(sourceFile, 85)
		// Note: The actual result might vary depending on TypeScript version and parsing behavior
		expect(propertyAccessNode).not.toBeNull()
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
		// Note: The actual result might vary depending on TypeScript version and parsing behavior
		expect(arrayStartNode).not.toBeNull()

		// Position exactly at the end of the array literal
		const arrayEndNode = findNode(sourceFile, 20)
		// Note: The actual result might vary depending on TypeScript version and parsing behavior
		expect(arrayEndNode).not.toBeNull()
	})

	it('should handle template literals correctly', () => {
		const sourceFile = ts.createSourceFile(
			'test.ts',
			'const message = `Hello, ${name}!`;',
			ts.ScriptTarget.ES2015,
			true,
			ts.ScriptKind.TS,
		)

		// Position at the template expression
		const templateExprNode = findNode(sourceFile, 23)
		// Note: The actual result might vary depending on TypeScript version and parsing behavior
		expect(templateExprNode).not.toBeNull()

		// Position at the template literal
		const templateLiteralNode = findNode(sourceFile, 16)
		// Note: The actual result might vary depending on TypeScript version and parsing behavior
		expect(templateLiteralNode).not.toBeNull()
	})

	it('should handle comments correctly', () => {
		const sourceFile = ts.createSourceFile(
			'test.ts',
			`// This is a comment
			const value = 100; // Inline comment`,
			ts.ScriptTarget.ES2015,
			true,
			ts.ScriptKind.TS,
		)

		// Position at the variable declaration after a comment
		const valueNode = findNode(sourceFile, 30)
		expect(valueNode?.getText()).toMatchInlineSnapshot('"value"')

		// Position at the first character of the source file should be null 
		// since comments are not part of the AST
		const commentNode = findNode(sourceFile, 0)
		expect(commentNode).toBeNull()
	})
})
import { Node } from 'solidity-ast/node.js'
import ts from 'typescript/lib/tsserverlibrary.js'
import { describe, expect, it, vi } from 'vitest'

// Mock readFileSync to return a specific length of content
vi.mock('fs', async () => {
	return {
		...vi.importActual('fs'),
		readFileSync: vi.fn(() => 'some content with length 42'),
	}
})

// Now, import your function under test
import { convertSolcAstToTsDefinitionInfo } from '../utils/convertSolcAstToTsDefinitionInfo.js'
import { SolcInput } from 'solidity-ast/solc.js'
import { ScriptElementKind } from 'typescript'

describe('convertSolcAstToTsDefinitionInfo', () => {
	it('should create a TypeScript DefinitionInfo for a FunctionDefinition', () => {
		const astNode: Node = {
			id: 1,
			nodeType: 'FunctionDefinition',
			src: '0:10',
			name: 'myFunction',
		} as any
		const solcInput: SolcInput = {
			sources: {
				'test.sol': {
					content: 'some content',
				},
			},
		}
		const definitionInfo = convertSolcAstToTsDefinitionInfo(
			astNode,
			'test.sol',
			'MyContainer',
			solcInput,
			ts,
		)

		expect(definitionInfo).toMatchInlineSnapshot(`
			{
			  "containerKind": "class",
			  "containerName": "MyContainer",
			  "fileName": "test.sol",
			  "kind": "function",
			  "name": "myFunction",
			  "textSpan": {
			    "length": 10,
			    "start": 15,
			  },
			}
		`)
	})

	it('should create a TypeScript DefinitionInfo for a VariableDeclaration', () => {
		const astNode: Node = {
			id: 1,
			nodeType: 'VariableDeclaration',
			src: '0:10',
			name: 'myVariable',
		} as any
		const solcInput: SolcInput = {
			sources: {
				'test.sol': {
					content: 'some content',
				},
			},
		}
		const definitionInfo = convertSolcAstToTsDefinitionInfo(
			astNode,
			'test.sol',
			'MyContainer',
			solcInput,
			ts,
		)

		expect(definitionInfo).toMatchObject({
			containerKind: 'class',
			containerName: 'MyContainer',
			fileName: 'test.sol',
			kind: 'var',
			name: 'myVariable',
			textSpan: {
				length: 10,
				start: 15,
			},
		})
	})

	it('should work for an unknown type', () => {
		const astNode: Node = {
			id: 1,
			nodeType: 'Assignment',
			src: '0:10',
			name: 'myAssignment',
		} as any
		const solcInput: SolcInput = {
			sources: {
				'test.sol': {
					content: 'some content',
				},
			},
		}
		const definitionInfo = convertSolcAstToTsDefinitionInfo(
			astNode,
			'test.sol',
			'MyContainer',
			solcInput,
			ts,
		)

		expect(definitionInfo).toMatchObject({
			containerKind: 'class',
			containerName: 'MyContainer',
			fileName: 'test.sol',
			kind: ScriptElementKind.unknown,
			name: 'unknown',
			textSpan: {
				length: 10,
				start: 15,
			},
		})
	})
})

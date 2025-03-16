import type { Node } from 'solidity-ast/node.js'
import ts from 'typescript/lib/tsserverlibrary.js'
import { describe, expect, it, vi } from 'vitest'

// Mock readFileSync to return a specific length of content
vi.mock('fs', async () => {
	return {
		...vi.importActual('fs'),
		readFileSync: vi.fn(() => 'some content with length 42'),
	}
})

import type { SolcInput } from 'solidity-ast/solc.js'
import { ScriptElementKind } from 'typescript'
// Now, import your function under test
import { convertSolcAstToTsDefinitionInfo } from '../utils/convertSolcAstToTsDefinitionInfo.js'

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
		const definitionInfo = convertSolcAstToTsDefinitionInfo(astNode, 'test.sol', 'MyContainer', solcInput, ts)

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
		const definitionInfo = convertSolcAstToTsDefinitionInfo(astNode, 'test.sol', 'MyContainer', solcInput, ts)

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
		const definitionInfo = convertSolcAstToTsDefinitionInfo(astNode, 'test.sol', 'MyContainer', solcInput, ts)

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

	it('should handle complex source positions correctly', () => {
		const astNode: Node = {
			id: 1,
			nodeType: 'FunctionDefinition',
			src: '125:67',  // Starting at position 125 with length 67
			name: 'complexFunction',
		} as any
		const solcInput: SolcInput = {
			sources: {
				'ComplexContract.sol': {
					content: 'contract with complex source mapping',
				},
			},
		}
		const definitionInfo = convertSolcAstToTsDefinitionInfo(astNode, 'ComplexContract.sol', 'ComplexContract', solcInput, ts)

		expect(definitionInfo).toMatchObject({
			containerKind: 'class',
			containerName: 'ComplexContract',
			fileName: 'ComplexContract.sol',
			kind: 'function',
			name: 'complexFunction',
			textSpan: {
				length: 67,
				start: 140,  // 125 + (inputLength - actualLength) which is mocked at 15
			},
		})
	})

	it('should handle different container names for nested contexts', () => {
		const astNode: Node = {
			id: 1,
			nodeType: 'VariableDeclaration',
			src: '5:10',
			name: 'nestedVar',
		} as any
		const solcInput: SolcInput = {
			sources: {
				'NestedStructs.sol': {
					content: 'nested struct content',
				},
			},
		}
		
		// Using a deeply nested container name like "Contract.Struct.NestedStruct"
		const containerName = 'Contract.Struct.NestedStruct'
		const definitionInfo = convertSolcAstToTsDefinitionInfo(astNode, 'NestedStructs.sol', containerName, solcInput, ts)

		expect(definitionInfo).toMatchObject({
			containerKind: 'class',
			containerName: containerName,
			fileName: 'NestedStructs.sol',
			kind: 'var',
			name: 'nestedVar',
			textSpan: {
				length: 10,
				start: 20,  // 5 + (inputLength - actualLength) which is mocked at 15
			},
		})
	})
})

import { findContractDefinitionFileNameFromEvmtsNode } from './findContractDefinitionFileNameFromEvmtsNode.js'
import { findNode } from './findNode.js'
import ts from 'typescript/lib/tsserverlibrary.js'
import { MockedFunction, describe, expect, it, vi } from 'vitest'

const mockContractFile = '/path/to/ContractDefinitionFile.sol'

// Mock TypeScript's LanguageService
const mockLanguageService = {
	getDefinitionAtPosition: vi.fn((fileName: string, position: number) => [
		{
			fileName: mockContractFile,
		},
	]),
} as unknown as ts.LanguageService

describe('findContractDefinitionFileNameFromEvmtsNode', () => {
	it('should find contract definition file name', () => {
		const fileText = `import { viemClient } from './viemClient';
import { MyContract } from './MyContract.sol';
const readCall = viemClient.readContract(MyContract.read().someProperty());
const writeCall = MyContract.write().someWrite
const eventCall = MyContract.events().someEvent(5, 'foo')
`
		const sourceFile = ts.createSourceFile(
			'test.ts',
			fileText,
			{ languageVersion: ts.ScriptTarget.ESNext },
			true,
			ts.ScriptKind.TS,
		)

		const somePropertyNode = findNode(
			sourceFile,
			fileText.indexOf('someProperty()'),
		)
		const someWriteNode = findNode(sourceFile, fileText.indexOf('someWrite'))
		const someEventNode = findNode(sourceFile, fileText.indexOf('someEvent'))
		if (!somePropertyNode || !someWriteNode || !someEventNode) {
			throw new Error('node is not valid')
		}

		expect(
			findContractDefinitionFileNameFromEvmtsNode(
				somePropertyNode,
				mockLanguageService,
				'test.ts',
				ts,
			),
		).toBe(mockContractFile)
		expect(
			(mockLanguageService.getDefinitionAtPosition as MockedFunction<any>).mock
				.lastCall,
		).toMatchInlineSnapshot(`
			[
			  "test.ts",
			  131,
			]
		`)

		expect(
			findContractDefinitionFileNameFromEvmtsNode(
				someWriteNode,
				mockLanguageService,
				'test.ts',
				ts,
			),
		).toBe(mockContractFile)
		expect(
			(mockLanguageService.getDefinitionAtPosition as MockedFunction<any>).mock
				.lastCall,
		).toMatchInlineSnapshot(`
			[
			  "test.ts",
			  184,
			]
		`)

		expect(
			findContractDefinitionFileNameFromEvmtsNode(
				someEventNode,
				mockLanguageService,
				'test.ts',
				ts,
			),
		).toBe(mockContractFile)
		expect(
			(mockLanguageService.getDefinitionAtPosition as MockedFunction<any>).mock
				.lastCall,
		).toMatchInlineSnapshot(`
			[
			  "test.ts",
			  231,
			]
		`)
	})

	it('should return null if the node does not match criteria', () => {
		const fileText = `
        const notAContract = {
          somethingElse: 42
        };
        notAContract.test0;
        test1;
        notAContract.test2();
        notAContract.notread.test3();
				write.eventreadwrite().test4();
				write().test5(test4);
				noContractInScope.read.test6();
      `
		const sourceFile = ts.createSourceFile(
			'test.ts',
			fileText,
			ts.ScriptTarget.ES2015,
			true,
			ts.ScriptKind.TS,
		)
		;['test0', 'test1', 'test2', 'test3', 'test4', 'test5', 'test6'].forEach(
			(testcase) => {
				const node = findNode(sourceFile, fileText.indexOf(testcase))
				if (!node) {
					throw new Error('node is not valid')
				}
				const contractDefinitionFileName =
					findContractDefinitionFileNameFromEvmtsNode(
						node,
						mockLanguageService,
						'test.ts',
						ts,
					)
				expect(contractDefinitionFileName).toBeNull()
			},
		)
	})

	it('should handle no definition existing', () => {
		const fileText = `
        foo.read().test();
      `
		const sourceFile = ts.createSourceFile(
			'test.ts',
			fileText,
			ts.ScriptTarget.ES2015,
			true,
			ts.ScriptKind.TS,
		)
		const node = findNode(sourceFile, fileText.indexOf('test'))
		if (!node) {
			throw new Error('node is not valid')
		}
		mockLanguageService.getDefinitionAtPosition = vi.fn(() => [])
		let contractDefinitionFileName =
			findContractDefinitionFileNameFromEvmtsNode(
				node,
				mockLanguageService,
				'test.ts',
				ts,
			)
		expect(contractDefinitionFileName).toBeNull()
		mockLanguageService.getDefinitionAtPosition = vi.fn(() => null as any)
		contractDefinitionFileName = findContractDefinitionFileNameFromEvmtsNode(
			node,
			mockLanguageService,
			'test.ts',
			ts,
		)
		expect(contractDefinitionFileName).toBeNull()
	})

	it('should return null if definition file is not a solidity file', () => {
		const fileText = `import { MyContract } from './MyContract.js';
const res = MyContract.read().myMethod();
      `
		const sourceFile = ts.createSourceFile(
			'test.ts',
			fileText,
			ts.ScriptTarget.ES2015,
			true,
			ts.ScriptKind.TS,
		)
		const node = findNode(sourceFile, fileText.indexOf('myMethod'))
		if (!node) {
			throw new Error('node is not valid')
		}
		mockLanguageService.getDefinitionAtPosition = () =>
			[{ fileName: 'foo.js' }] as any
		const contractDefinitionFileName =
			findContractDefinitionFileNameFromEvmtsNode(
				node,
				mockLanguageService,
				'test.ts',
				ts,
			)
		expect(contractDefinitionFileName).toBeNull()
	})
})

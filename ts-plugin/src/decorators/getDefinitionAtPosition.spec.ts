import { getDefinitionServiceDecorator } from './getDefinitionAtPosition'
import typescript from 'typescript/lib/tsserverlibrary'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// TODO these tests are awful this should be tested e2e against real fixtures

vi.mock('@evmts/bundler', async () => ({
	bundler: vi.fn(),
}))
vi.mock('@evmts/config', async () => ({
	ResolvedConfig: vi.fn(),
}))
vi.mock('../utils', async () => {
	return {
		...vi.importActual('../utils'),
		findNode: vi.fn(() => ({
			getText: vi.fn(() => 'some text'),
		})),
		convertSolcAstToTsDefinitionInfo: vi.fn(),
		findContractDefinitionFileNameFromEvmtsNode: vi.fn(
			() => '/bar/Contract.sol',
		),
	}
})

const mockLogger = {
	error: vi.fn(),
}

const mockLanguageService = {
	getDefinitionAtPosition: vi.fn(() => {
		return [
			{
				fileName: 'someFile.ts',
				textSpan: {
					start: 0,
					length: 0,
				},
			},
		]
	}),
	getDefinitionAndBoundSpan: vi.fn(() => {
		return {
			definitions: [
				{
					fileName: 'someFile.ts',
					textSpan: {
						start: 0,
						length: 0,
					},
				},
			],
			textSpan: {
				start: 0,
				length: 0,
			},
		}
	}),
	getProgram: vi.fn(() => ({
		getSourceFile: vi.fn(() =>
			typescript.createSourceFile(
				'someFile.ts',
				'const x = "foo"',
				typescript.ScriptTarget.ESNext,
				true,
				typescript.ScriptKind.TS,
			),
		),
	})),
} as unknown as typescript.LanguageService

describe('getDefinitionServiceDecorator', () => {
	beforeEach(() => {
		vi.mock('@evmts/bundler', async () => ({
			bundler: vi.fn(),
		}))
		vi.mock('@evmts/config', async () => ({
			ResolvedConfig: vi.fn(),
		}))
		vi.mock('../utils', async () => {
			return {
				...vi.importActual('../utils'),
				findNode: vi.fn(() => ({
					getText: vi.fn(() => 'some text'),
				})),
				convertSolcAstToTsDefinitionInfo: vi.fn(),
				findContractDefinitionFileNameFromEvmtsNode: vi.fn(
					() => '/bar/Contract.sol',
				),
			}
		})
	})
	it('should decorate getDefinitionAtPosition properly', () => {
		const decoratedService = getDefinitionServiceDecorator(
			mockLanguageService,
			{} as any,
			mockLogger as any,
			typescript,
		)

		const definitions = decoratedService.getDefinitionAtPosition(
			'someFile.ts',
			42,
		)
		expect(definitions).toMatchInlineSnapshot(`
			[
			  {
			    "fileName": "someFile.ts",
			    "textSpan": {
			      "length": 0,
			      "start": 0,
			    },
			  },
			]
		`)
	})

	it('should decorate getDefinitionAndBoundSpan properly', () => {
		const decoratedService = getDefinitionServiceDecorator(
			mockLanguageService,
			{} as any,
			mockLogger as any,
			typescript,
		)

		const result = decoratedService.getDefinitionAndBoundSpan('someFile.ts', 42)
		expect(result).toMatchInlineSnapshot(`
			{
			  "definitions": [
			    {
			      "fileName": "someFile.ts",
			      "textSpan": {
			        "length": 0,
			        "start": 0,
			      },
			    },
			  ],
			  "textSpan": {
			    "length": 0,
			    "start": 0,
			  },
			}
		`)
	})

	it('should return original definitions if evmtsContractPath is null', () => {
		vi.mock(
			'../utils/findContractDefinitionFileNameFromEvmtsNode',
			async () => ({
				findContractDefinitionFileNameFromEvmtsNode: vi.fn(() => null),
			}),
		)

		const decoratedService = getDefinitionServiceDecorator(
			mockLanguageService,
			{} as any,
			mockLogger as any,
			typescript,
		)

		const definitions = decoratedService.getDefinitionAtPosition(
			'someFile.ts',
			42,
		)

		expect(definitions).toMatchInlineSnapshot(`
			[
			  {
			    "fileName": "someFile.ts",
			    "textSpan": {
			      "length": 0,
			      "start": 0,
			    },
			  },
			]
		`)
	})

	it('should log an error if resolveDtsSync cannot resolve ASTs', () => {
		vi.mock('@evmts/bundler', async () => ({
			bundler: vi.fn(() => ({
				resolveDtsSync: vi.fn(() => ({ asts: null })),
			})),
		}))
		vi.mock('../utils', async () => {
			return {
				...vi.importActual('../utils'),
				findNode: vi.fn(() => ({
					getText: vi.fn(() => 'some text'),
				})),
				convertSolcAstToTsDefinitionInfo: vi.fn(),
				findContractDefinitionFileNameFromEvmtsNode: vi.fn(
					() => '/bar/Contract.sol',
				),
			}
		})

		const decoratedService = getDefinitionServiceDecorator(
			mockLanguageService,
			{} as any,
			mockLogger as any,
			typescript,
		)

		const definitions = decoratedService.getDefinitionAtPosition(
			'someFile.ts',
			42,
		)
		expect(definitions).toMatchInlineSnapshot(`
			[
			  {
			    "fileName": "someFile.ts",
			    "textSpan": {
			      "length": 0,
			      "start": 0,
			    },
			  },
			]
		`)

		expect(mockLogger.error.mock.lastCall).toMatchInlineSnapshot(`
			[
			  "@evmts/ts-plugin: unable to find definitions /bar/Contract.sol",
			]
		`)
	})

	it('should log an error if unable to find definitions in ASTs', () => {
		vi.mock('solidity-ast/utils', async () => ({
			findAll: vi.fn(() => []),
		}))

		const decoratedService = getDefinitionServiceDecorator(
			mockLanguageService,
			{} as any,
			mockLogger as any,
			typescript,
		)

		const definitions = decoratedService.getDefinitionAtPosition(
			'someFile.ts',
			42,
		)
		expect(definitions).toMatchInlineSnapshot(`
			[
			  {
			    "fileName": "someFile.ts",
			    "textSpan": {
			      "length": 0,
			      "start": 0,
			    },
			  },
			]
		`)

		expect(mockLogger.error.mock.lastCall).toMatchInlineSnapshot(`
			[
			  "@evmts/ts-plugin: unable to find definitions /bar/Contract.sol",
			]
		`)
	})

	it('should handle multiple ASTs', () => {
		vi.mock('@evmts/bundler', async () => ({
			bundler: vi.fn(() => ({
				resolveDtsSync: vi.fn(() => ({
					asts: {
						file1: {},
						file2: {},
					},
					solcInput: {},
				})),
			})),
		}))

		const decoratedService = getDefinitionServiceDecorator(
			mockLanguageService,
			{} as any,
			mockLogger as any,
			typescript,
		)

		const definitions = decoratedService.getDefinitionAtPosition(
			'someFile.ts',
			42,
		)
		expect(definitions).toMatchInlineSnapshot(`
			[
			  {
			    "fileName": "someFile.ts",
			    "textSpan": {
			      "length": 0,
			      "start": 0,
			    },
			  },
			]
		`)
	})
})

import { getDefinitionServiceDecorator } from './getDefinitionAtPosition.js'
import { FileAccessObject } from '@tevm/base-bundler'
import { createCache } from '@tevm/bundler-cache'
import { access, mkdir, writeFile } from 'fs/promises'
import { tmpdir } from 'os'
import typescript from 'typescript/lib/tsserverlibrary.js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// TODO these tests are awful this should be tested e2e against real fixtures

vi.mock('@tevm/base-bundler', async () => ({
	bundler: vi.fn(),
}))
vi.mock('../utils', async () => {
	return {
		...vi.importActual('../utils'),
		findNode: vi.fn(() => ({
			getText: vi.fn(() => 'some text'),
		})),
		convertSolcAstToTsDefinitionInfo: vi.fn(),
		findContractDefinitionFileNameFromTevmNode: vi.fn(
			() => '/bar/Contract.sol',
		),
	}
})

const fao: FileAccessObject = {
	existsSync: vi.fn() as any,
	readFileSync: vi.fn() as any,
	readFile: vi.fn() as any,
	writeFileSync: vi.fn() as any,
	statSync: vi.fn() as any,
	stat: vi.fn() as any,
	mkdirSync: vi.fn() as any,
	mkdir,
	writeFile,
	exists: async (path: string) => {
		try {
			await access(path)
			return true
		} catch (e) {
			return false
		}
	},
}

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
		vi.mock('@tevm/base-bundler', async () => ({
			bundler: vi.fn(),
		}))
		vi.mock('../utils', async () => {
			return {
				...vi.importActual('../utils'),
				findNode: vi.fn(() => ({
					getText: vi.fn(() => 'some text'),
				})),
				convertSolcAstToTsDefinitionInfo: vi.fn(),
				findContractDefinitionFileNameFromTevmNode: vi.fn(
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
			fao,
			createCache(tmpdir(), fao, tmpdir()),
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
			fao,
			createCache(tmpdir(), fao, tmpdir()),
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

	it('should return original definitions if ContractPath is null', () => {
		vi.mock(
			'../utils/findContractDefinitionFileNameFromTevmNode',
			async () => ({
				findContractDefinitionFileNameFromTevmNode: vi.fn(() => null),
			}),
		)

		const decoratedService = getDefinitionServiceDecorator(
			mockLanguageService,
			{} as any,
			mockLogger as any,
			typescript,
			fao,
			createCache(tmpdir(), fao, tmpdir()),
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
		vi.mock('@tevm/base-bundler', async () => ({
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
				findContractDefinitionFileNameFromTevmNode: vi.fn(
					() => '/bar/Contract.sol',
				),
			}
		})

		const decoratedService = getDefinitionServiceDecorator(
			mockLanguageService,
			{} as any,
			mockLogger as any,
			typescript,
			fao,
			createCache(tmpdir(), fao, tmpdir()),
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
			  "@tevm/ts-plugin: unable to find definitions /bar/Contract.sol",
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
			fao,
			createCache(tmpdir(), fao, tmpdir()),
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
			  "@tevm/ts-plugin: unable to find definitions /bar/Contract.sol",
			]
		`)
	})

	it('should handle multiple ASTs', () => {
		vi.mock('@tevm/base-bundler', async () => ({
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
			fao,
			createCache(tmpdir(), fao, tmpdir()),
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

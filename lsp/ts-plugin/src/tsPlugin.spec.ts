import path from 'node:path'
import type { CompilerConfig } from '@tevm/config'
import { defaultConfig } from '@tevm/config'
import * as Effect from 'effect/Effect'
import typescript from 'typescript/lib/tsserverlibrary.js'
import { type Mock, describe, expect, it, vi } from 'vitest'
import tsPlugin from './index.js'
import { tsPlugin as tsPluginDirect } from './tsPlugin.js'

type TestAny = any

const config: CompilerConfig = {}

const createInfo: typescript.server.PluginCreateInfo = {
	config,
	languageServiceHost: {
		getCurrentDirectory: vi.fn(),
		resolveModuleNameLiterals: vi.fn(),
		getScriptSnapshot: vi.fn(),
		getScriptKind: vi.fn(),
		getResolvedModuleWithFailedLookupLocationsFromCache: vi.fn(),
	},
	getDefinitionAtPosition: vi.fn(),
	getDefinitionAndBoundSpan: vi.fn(),
	project: {
		getCurrentDirectory: () => path.join(__dirname, 'fixtures', 'basic'),
		getCompilerOptions: () => ({ baseUrl: 'foo' }),
		projectService: {
			logger: {
				info: vi.fn(),
			},
		},
	},
} as TestAny
;(createInfo.languageServiceHost.getScriptKind as Mock).mockImplementation((fileName: string) => {
	if (fileName.endsWith('.ts')) {
		return typescript.ScriptKind.TS
	}
	return typescript.ScriptKind.Unknown
})

describe(tsPlugin.name, () => {
	it('should return a create decorator', () => {
		const decorator = tsPlugin({ typescript })
		expect(Object.keys(decorator)).toMatchInlineSnapshot(`
      [
        "create",
        "getExternalFiles",
      ]
    `)
		const host = decorator.create(createInfo)
		expect(host).toMatchInlineSnapshot(`
			{
			  "applyCodeActionCommand": [Function],
			  "cleanupSemanticCache": [Function],
			  "clearSourceMapperCache": [Function],
			  "commentSelection": [Function],
			  "dispose": [Function],
			  "findReferences": [Function],
			  "findRenameLocations": [Function],
			  "getApplicableRefactors": [Function],
			  "getAutoImportProvider": [Function],
			  "getBraceMatchingAtPosition": [Function],
			  "getBreakpointStatementAtPosition": [Function],
			  "getCodeFixesAtPosition": [Function],
			  "getCombinedCodeFix": [Function],
			  "getCompilerOptionsDiagnostics": [Function],
			  "getCompletionEntryDetails": [Function],
			  "getCompletionEntrySymbol": [Function],
			  "getCompletionsAtPosition": [Function],
			  "getCurrentProgram": [Function],
			  "getDefinitionAndBoundSpan": [Function],
			  "getDefinitionAtPosition": [Function],
			  "getDocCommentTemplateAtPosition": [Function],
			  "getDocumentHighlights": [Function],
			  "getEditsForFileRename": [Function],
			  "getEditsForRefactor": [Function],
			  "getEmitOutput": [Function],
			  "getEncodedSemanticClassifications": [Function],
			  "getEncodedSyntacticClassifications": [Function],
			  "getFileReferences": [Function],
			  "getFormattingEditsAfterKeystroke": [Function],
			  "getFormattingEditsForDocument": [Function],
			  "getFormattingEditsForRange": [Function],
			  "getImplementationAtPosition": [Function],
			  "getIndentationAtPosition": [Function],
			  "getJsxClosingTagAtPosition": [Function],
			  "getLinkedEditingRangeAtPosition": [Function],
			  "getMoveToRefactoringFileSuggestions": [Function],
			  "getNameOrDottedNameSpan": [Function],
			  "getNavigateToItems": [Function],
			  "getNavigationBarItems": [Function],
			  "getNavigationTree": [Function],
			  "getNonBoundSourceFile": [Function],
			  "getOutliningSpans": [Function],
			  "getPasteEdits": [Function],
			  "getProgram": [Function],
			  "getQuickInfoAtPosition": [Function],
			  "getReferencesAtPosition": [Function],
			  "getRegionSemanticDiagnostics": [Function],
			  "getRenameInfo": [Function],
			  "getSemanticClassifications": [Function],
			  "getSemanticDiagnostics": [Function],
			  "getSignatureHelpItems": [Function],
			  "getSmartSelectionRange": [Function],
			  "getSourceMapper": [Function],
			  "getSpanOfEnclosingComment": [Function],
			  "getSuggestionDiagnostics": [Function],
			  "getSupportedCodeFixes": [Function],
			  "getSyntacticClassifications": [Function],
			  "getSyntacticDiagnostics": [Function],
			  "getTodoComments": [Function],
			  "getTypeDefinitionAtPosition": [Function],
			  "isValidBraceCompletionAtPosition": [Function],
			  "mapCode": [Function],
			  "organizeImports": [Function],
			  "prepareCallHierarchy": [Function],
			  "preparePasteEditsForFile": [Function],
			  "provideCallHierarchyIncomingCalls": [Function],
			  "provideCallHierarchyOutgoingCalls": [Function],
			  "provideInlayHints": [Function],
			  "toLineColumnOffset": [Function],
			  "toggleLineComment": [Function],
			  "toggleMultilineComment": [Function],
			  "uncommentSelection": [Function],
			  "updateIsDefinitionOfReferencedSymbols": [Function],
			}
		`)
	})

	it('should handle a .sol file with proper decoration', () => {
		// Spy on the language service creation
		const createLanguageServiceSpy = vi.spyOn(typescript, 'createLanguageService')
		const decorator = tsPlugin({ typescript })

		// Create service
		const service = decorator.create(createInfo)

		// Ensure language service was created with properly decorated host
		expect(createLanguageServiceSpy).toHaveBeenCalled()

		// Since we have a mocked service now, let's test some edge cases

		// Test getting a definition for a Solidity file
		const mockGetDefAtPos = createInfo.getDefinitionAtPosition as Mock
		mockGetDefAtPos.mockReturnValue([{ fileName: 'mock.ts', textSpan: { start: 0, length: 0 } }])

		// Invoke getDefinitionAtPosition
		service.getDefinitionAtPosition('test.sol', 0)

		// Verify the service passes through to the decoration chain
		expect(mockGetDefAtPos).toHaveBeenCalledWith('test.sol', 0)
	})

	it('getExternalFiles should work', () => {
		// return project.getFileNames().filter(isSolidity)
		const mockProject = {
			getFileNames: () => ['foo.ts', 'bar.sol'],
		}
		const decorator = tsPlugin({ typescript })
		expect(decorator.getExternalFiles?.(mockProject as any, 0)).toEqual(['bar.sol'])
	})

	it('should handle config load errors by using default config', () => {
		// Create a mock error pipe
		const mockErrorPipe = vi.fn(() => defaultConfig)

		// Mock Effect.runSync to simulate a config load failure
		const runSyncSpy = vi.spyOn(Effect, 'runSync')
		runSyncSpy.mockImplementationOnce(() => {
			// Simulate the chain of operations that would happen in a failure case
			const mockCatchTag = vi.fn((tag, handler) => handler())
			const mockLoadConfig = {
				pipe: vi.fn(() => mockCatchTag),
			}
			return mockLoadConfig
		})

		// Create decorator with the mocked effect
		const decorator = tsPlugin({ typescript })

		// Create should still work despite config error
		const service = decorator.create(createInfo)

		// Verify we got a working service back
		expect(service).toBeDefined()
		expect(typeof service.getDefinitionAtPosition).toBe('function')

		// Verify our mock was called
		expect(runSyncSpy).toHaveBeenCalled()

		// Restore original implementation
		runSyncSpy.mockRestore()
	})

	it('should create file access objects and caches correctly', () => {
		// Spy on factory functions
		const createFaoSpy = vi.spyOn(require('./factories/fileAccessObject'), 'createFileAccessObject')
		const createRealFaoSpy = vi.spyOn(require('./factories/fileAccessObject'), 'createRealFileAccessObject')
		const createCacheSpy = vi.spyOn(require('@tevm/bundler-cache'), 'createCache')

		// Create our decorator
		const decorator = tsPlugin({ typescript })
		const service = decorator.create(createInfo)

		// Verify factories were called correctly
		expect(createFaoSpy).toHaveBeenCalledWith(createInfo.languageServiceHost)
		expect(createRealFaoSpy).toHaveBeenCalled()
		expect(createCacheSpy).toHaveBeenCalledWith(
			expect.any(String), // config.cacheDir
			expect.anything(), // real file access object
			expect.any(String), // current directory
		)

		// Cleanup
		createFaoSpy.mockRestore()
		createRealFaoSpy.mockRestore()
		createCacheSpy.mockRestore()
	})
})

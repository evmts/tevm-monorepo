import path from 'node:path'
import type { CompilerConfig } from '@tevm/config'
import { defaultConfig } from '@tevm/config'
import typescript from 'typescript/lib/tsserverlibrary.js'
import { type Mock, describe, expect, it, vi } from 'vitest'
import tsPlugin from './index.js'

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

	it('should handle a .sol file', () => {
		const decorator = tsPlugin({ typescript })
		decorator.create(createInfo)
		// Just check it doesn't throw
	})

	it('getExternalFiles should work', () => {
		// return project.getFileNames().filter(isSolidity)
		const mockProject = {
			getFileNames: () => ['foo.ts', 'bar.sol'],
		}
		const decorator = tsPlugin({ typescript })
		expect(decorator.getExternalFiles?.(mockProject as any, 0)).toEqual(['bar.sol'])
	})

	it('should setup service with decorators', () => {
		// Create a plugin and verify it has all expected methods
		const decorator = tsPlugin({ typescript })
		const service = decorator.create(createInfo)

		// Verify expected methods are present
		expect(service.getDefinitionAtPosition).toBeDefined()
		expect(service.getDefinitionAndBoundSpan).toBeDefined()
	})
})

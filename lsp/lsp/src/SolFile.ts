import { bundler, createCache } from '@tevm/base-bundler'
import { loadConfig } from '@tevm/config'
import {
	FileCapabilities,
	FileKind,
	type VirtualFile,
} from '@volar/language-core'
import { runSync } from 'effect/Effect'
import { existsSync, readFileSync } from 'fs'
import { readFile } from 'fs/promises'
// @ts-expect-error
import solc from 'solc'
import type ts from 'typescript/lib/tsserverlibrary.js'

export class SolFile implements VirtualFile {
	// regular file not typescript host file
	kind: VirtualFile['kind'] = FileKind.TextFile
	// diagnostic: true
	// foldingRange: true
	// documentFormatting: true
	// documentSymbol: true
	// codeAction: true
	// inlayHint: true
	capabilities: VirtualFile['capabilities'] = FileCapabilities.full
	// This seems to be source maps but I can't find anyone using htis
	codegenStacks: VirtualFile['codegenStacks'] = []

	mappings: VirtualFile['mappings'] = []
	embeddedFiles: VirtualFile['embeddedFiles'] = []

	constructor(
		public readonly fileName: VirtualFile['fileName'],
		public snapshot: ts.IScriptSnapshot,
	) {
		this.update(snapshot)
	}

	public update(newSnapshot: ts.IScriptSnapshot) {
		this.snapshot = newSnapshot
		const c = runSync(loadConfig(process.cwd()))
		const cache = createCache(console)
		const b = bundler(
			c,
			console,
			{
				existsSync: existsSync,
				readFile: readFile,
				readFileSync: readFileSync,
			},
			solc,
			cache,
		)
		const tsFile = b.resolveTsModuleSync(
			this.fileName,
			process.cwd(),
			false,
			false,
		)
		this.embeddedFiles = [
			{
				fileName: `${this.fileName}.ts`,
				snapshot: {
					getText(start, end) {
						return tsFile.code.substring(start, end)
					},
					getLength() {
						return tsFile.code.length
					},
					getChangeRange() {
						return undefined
					},
				},
				kind: FileKind.TypeScriptHostFile,
				capabilities: {
					...FileCapabilities.full,
					foldingRange: false,
					documentSymbol: false,
					documentFormatting: false,
				},
				// TODO generate source mappings https://github.com/evmts/tevm-monorepo/issues/731
				mappings: [],
				embeddedFiles: [],
				codegenStacks: [],
			},
		]
	}
}

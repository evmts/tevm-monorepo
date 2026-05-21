import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { bundler, type FileAccessObject } from '@tevm/base-bundler'
import { createCache } from '@tevm/bundler-cache'
import { loadConfig } from '@tevm/config'
import { FileCapabilities, FileKind, type VirtualFile } from '@volar/language-core'
import { runSync } from 'effect/Effect'
import path from 'node:path'
// @ts-expect-error
import solc from 'solc'
import type ts from 'typescript/lib/tsserverlibrary.js'

const hashText = (text: string): number => {
	let hash = 0
	for (let i = 0; i < text.length; i++) {
		hash = (hash * 31 + text.charCodeAt(i)) >>> 0
	}
	return hash
}

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
		const projectRoot = path.dirname(this.fileName)
		const c = runSync(loadConfig(projectRoot))
		const snapshotText = this.snapshot.getText(0, this.snapshot.getLength())
		const snapshotMtimeMs = hashText(snapshotText)
		const activeFilePath = path.resolve(this.fileName)
		const isActiveFile = (fileName: string) =>
			path.resolve(fileName) === activeFilePath || path.resolve(projectRoot, fileName) === activeFilePath
		const fao = {
			exists: async (fileName) => isActiveFile(fileName) || existsSync(fileName),
			existsSync: (fileName) => isActiveFile(fileName) || existsSync(fileName),
			mkdir,
			mkdirSync,
			readFile: (fileName, encoding) => {
				if (isActiveFile(fileName)) {
					return Promise.resolve(snapshotText)
				}
				return readFile(fileName, { encoding })
			},
			readFileSync: (fileName, encoding) => {
				if (isActiveFile(fileName)) {
					return snapshotText
				}
				return readFileSync(fileName, { encoding })
			},
			stat: async (fileName) => {
				if (!isActiveFile(fileName)) {
					return stat(fileName)
				}
				try {
					return { ...(await stat(fileName)), mtimeMs: snapshotMtimeMs } as Awaited<ReturnType<typeof stat>>
				} catch (_e) {
					return { mtimeMs: snapshotMtimeMs } as Awaited<ReturnType<typeof stat>>
				}
			},
			statSync: (fileName) => {
				if (!isActiveFile(fileName)) {
					return statSync(fileName)
				}
				try {
					return { ...statSync(fileName), mtimeMs: snapshotMtimeMs } as ReturnType<typeof statSync>
				} catch (_e) {
					return { mtimeMs: snapshotMtimeMs } as ReturnType<typeof statSync>
				}
			},
			writeFile,
			writeFileSync,
		} satisfies FileAccessObject
		const cache = createCache(c.cacheDir, fao, projectRoot)
		const b = bundler(
			c,
			console,
			fao,
			solc,
			cache,
		)
		const tsFile = b.resolveTsModuleSync(this.fileName, projectRoot, false, false)
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

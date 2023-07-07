import {
	FileCapabilities,
	FileKind,
	Language,
	VirtualFile,
} from '@volar/language-core'
import type * as typescript from 'typescript/lib/tsserverlibrary'
import { DiagnosticMessage } from 'typescript/lib/tsserverlibrary'

export const getSolidityLanguageModule = (
	ts: typeof typescript,
): Language<SolidityFile> => {
	return {
		createVirtualFile: (fileName, snapshot) => {
			if (fileName.endsWith('.sol')) {
				return new SolidityFile(fileName, snapshot, ts)
			}
		},
		updateVirtualFile: (solidityFile, snapshot) => {
			solidityFile.update(snapshot)
		},
		resolveHost: (host) => {
			// this appears to be the same thing as the ts plugin
			return host
		},
	}
}

export class SolidityFile implements VirtualFile {
	kind = FileKind.TextFile
	capabilities = FileCapabilities.full

	mappings: VirtualFile['mappings'] = []
	embeddedFiles: VirtualFile[] = []
	compilerDiagnostics: DiagnosticMessage[] = []
	scriptFiles: string[] = []
	codegenStacks: VirtualFile['codegenStacks'] = []

	constructor(
		public readonly fileName: string,
		public snapshot: typescript.IScriptSnapshot,
		public readonly ts: typeof import('typescript/lib/tsserverlibrary'),
	) {}

	get hasCompilationErrors(): boolean {
		return false
	}

	public readonly update = (newSnapshot: typescript.IScriptSnapshot) => {
		this.snapshot = newSnapshot
		this.onSnapshotUpdated()
	}

	public readonly onSnapshotUpdated = () => {
		this.mappings = [
			/*
       *
       {
          sourceRange: [0, this.snapshot.getLength()],
          generatedRange: [0, this.snapshot.getLength()],
          data: FileRangeCapabilities.full,
       }
       */
		]
	}
}

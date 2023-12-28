import type { CompiledContracts } from '@tevm/compiler'

/**
 * Generalized interface for accessing file system
 * Allows this package to be used in browser environments or otherwise pluggable
 */
export type FileAccessObject = {
	writeFileSync: (path: string, data: string) => void
	readFile: (path: string, encoding: BufferEncoding) => Promise<string>
	readFileSync: (path: string, encoding: BufferEncoding) => string
	existsSync: (path: string) => boolean
}

export type CachedItem = 'artifactsJson' | 'dts' | 'mjs'

export type ReadArtifacts = (entryModuleId: string) => CompiledContracts | undefined

export type ReadDts = (entryModuleId: string) => string | undefined

export type ReadMjs = (entryModuleId: string) => string | undefined

export type WriteArtifacts = (
	entryModuleId: string,
	artifacts: CompiledContracts
) => string

export type WriteDts = (entryModuleId: string, dtsFile: string) => void

export type WriteMjs = (entryModuleId: string, mjsFile: string) => void

export type Cache = {
	readArtifacts: ReadArtifacts
	readDts: ReadDts
	readMjs: ReadMjs
	writeArtifacts: WriteArtifacts
	writeDts: WriteDts
	writeMjs: WriteMjs
}

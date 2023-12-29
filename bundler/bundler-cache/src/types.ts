import type { ResolvedArtifacts } from '@tevm/compiler'
import { mkdirSync, statSync } from 'fs'
import type { mkdir, stat, writeFile } from 'fs/promises'

/**
 * Generalized interface for accessing file system
 * Allows this package to be used in browser environments or otherwise pluggable
 */
export type FileAccessObject = {
	writeFileSync: (path: string, data: string) => void
	writeFile: typeof writeFile
	readFile: (path: string, encoding: BufferEncoding) => Promise<string>
	readFileSync: (path: string, encoding: BufferEncoding) => string
	exists: (path: string) => Promise<boolean>
	existsSync: (path: string) => boolean
	statSync: typeof statSync
	stat: typeof stat
	mkdirSync: typeof mkdirSync
	mkdir: typeof mkdir
}

export type CachedItem = 'artifactsJson' | 'dts' | 'mjs'

export type ReadArtifactsSync = (
	entryModuleId: string,
) => ResolvedArtifacts | undefined
export type ReadArtifacts = (
	entryModuleId: string,
) => Promise<ResolvedArtifacts | undefined>

export type ReadDtsSync = (entryModuleId: string) => string | undefined
export type ReadDts = (entryModuleId: string) => Promise<string | undefined>

export type ReadMjsSync = (entryModuleId: string) => string | undefined
export type ReadMjs = (entryModuleId: string) => Promise<string | undefined>

export type WriteArtifactsSync = (
	entryModuleId: string,
	artifacts: ResolvedArtifacts,
) => string
export type WriteArtifacts = (
	entryModuleId: string,
	artifacts: ResolvedArtifacts,
) => Promise<string>

export type WriteDtsSync = (entryModuleId: string, dtsFile: string) => string
export type WriteDts = (
	entryModuleId: string,
	dtsFile: string,
) => Promise<string>

export type WriteMjsSync = (entryModuleId: string, mjsFile: string) => string
export type WriteMjs = (
	entryModuleId: string,
	mjsFile: string,
) => Promise<string>

export type Cache = {
	readArtifactsSync: ReadArtifactsSync
	readArtifacts: ReadArtifacts
	readDtsSync: ReadDtsSync
	readDts: ReadDts
	readMjsSync: ReadMjsSync
	readMjs: ReadMjs
	writeArtifactsSync: WriteArtifactsSync
	writeArtifacts: WriteArtifacts
	writeDtsSync: WriteDtsSync
	writeDts: WriteDts
	writeMjsSync: WriteMjsSync
	writeMjs: WriteMjs
}

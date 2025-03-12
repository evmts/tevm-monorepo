import * as fs from 'node:fs'
import * as fsPromises from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import { createCache } from './createCache.js'
import type {
	Cache,
	CachedItem,
	FileAccessObject,
	ReadArtifacts,
	ReadArtifactsSync,
	ReadDts,
	ReadDtsSync,
	ReadMjs,
	ReadMjsSync,
	WriteArtifacts,
	WriteArtifactsSync,
	WriteDts,
	WriteDtsSync,
	WriteMjs,
	WriteMjsSync,
} from './types.js'

describe('Types', () => {
	it('should allow creating a valid FileAccessObject', () => {
		// This test is mainly for type checking, not runtime behavior
		const fileAccess: FileAccessObject = {
			readFile: fsPromises.readFile,
			readFileSync: fs.readFileSync,
			writeFile: fsPromises.writeFile,
			writeFileSync: fs.writeFileSync,
			exists: async (path) => fs.existsSync(path),
			existsSync: fs.existsSync,
			statSync: fs.statSync,
			stat: fsPromises.stat,
			mkdirSync: fs.mkdirSync,
			mkdir: fsPromises.mkdir,
		}

		expect(fileAccess).toBeDefined()
	})

	it('should contain all CachedItem types', () => {
		const items: CachedItem[] = ['artifactsJson', 'dts', 'mjs']
		expect(items).toHaveLength(3)
	})

	it('should create a valid Cache object with all required properties', () => {
		// Mock minimal FileAccessObject for type checking
		const mockFs: FileAccessObject = {
			readFile: async () => '',
			readFileSync: () => '',
			writeFile: async () => {},
			writeFileSync: () => {},
			exists: async () => true,
			existsSync: () => true,
			statSync: () => ({ mtimeMs: 0 }) as fs.Stats,
			stat: async () => ({ mtimeMs: 0 }) as fs.Stats,
			mkdirSync: () => {},
			mkdir: async () => {},
		}

		const cache = createCache('.tevm', mockFs, '/test')

		// Check that all required Cache properties exist
		expect(cache).toHaveProperty('readArtifactsSync')
		expect(cache).toHaveProperty('readArtifacts')
		expect(cache).toHaveProperty('readDtsSync')
		expect(cache).toHaveProperty('readDts')
		expect(cache).toHaveProperty('readMjsSync')
		expect(cache).toHaveProperty('readMjs')
		expect(cache).toHaveProperty('writeArtifactsSync')
		expect(cache).toHaveProperty('writeArtifacts')
		expect(cache).toHaveProperty('writeDtsSync')
		expect(cache).toHaveProperty('writeDts')
		expect(cache).toHaveProperty('writeMjsSync')
		expect(cache).toHaveProperty('writeMjs')
	})
})

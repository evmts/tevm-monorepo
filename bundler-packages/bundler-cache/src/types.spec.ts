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

	it('should verify signature of read and write function types', () => {
		// We're testing the type structure by creating valid function implementations
		// that satisfy the type constraints - this ensures our types are well-designed

		// Read functions - they should return either an artifact or undefined
		const readArtifactsImpl: ReadArtifactsSync = (entryModuleId) => {
			return entryModuleId ? { abi: [], bytecode: '0x' } : undefined
		}

		const readDtsImpl: ReadDtsSync = (entryModuleId) => {
			return entryModuleId ? 'export declare class Test {}' : undefined
		}

		const readMjsImpl: ReadMjsSync = (entryModuleId) => {
			return entryModuleId ? 'export class Test {}' : undefined
		}

		// Async read functions should return Promise
		const readArtifactsAsyncImpl: ReadArtifacts = async (entryModuleId) => {
			return entryModuleId ? { abi: [], bytecode: '0x' } : undefined
		}

		const readDtsAsyncImpl: ReadDts = async (entryModuleId) => {
			return entryModuleId ? 'export declare class Test {}' : undefined
		}

		const readMjsAsyncImpl: ReadMjs = async (entryModuleId) => {
			return entryModuleId ? 'export class Test {}' : undefined
		}

		// Write functions - they should return a path
		const writeArtifactsImpl: WriteArtifactsSync = (entryModuleId, artifacts) => {
			return `/cache/${entryModuleId}.json`
		}

		const writeDtsImpl: WriteDtsSync = (entryModuleId, dtsFile) => {
			return `/cache/${entryModuleId}.d.ts`
		}

		const writeMjsImpl: WriteMjsSync = (entryModuleId, mjsFile) => {
			return `/cache/${entryModuleId}.mjs`
		}

		// Async write functions should return Promise of path
		const writeArtifactsAsyncImpl: WriteArtifacts = async (entryModuleId, artifacts) => {
			return `/cache/${entryModuleId}.json`
		}

		const writeDtsAsyncImpl: WriteDts = async (entryModuleId, dtsFile) => {
			return `/cache/${entryModuleId}.d.ts`
		}

		const writeMjsAsyncImpl: WriteMjs = async (entryModuleId, mjsFile) => {
			return `/cache/${entryModuleId}.mjs`
		}

		// Verify implementations match the expected types
		expect(typeof readArtifactsImpl).toBe('function')
		expect(typeof readDtsImpl).toBe('function')
		expect(typeof readMjsImpl).toBe('function')
		expect(typeof readArtifactsAsyncImpl).toBe('function')
		expect(typeof readDtsAsyncImpl).toBe('function')
		expect(typeof readMjsAsyncImpl).toBe('function')
		expect(typeof writeArtifactsImpl).toBe('function')
		expect(typeof writeDtsImpl).toBe('function')
		expect(typeof writeMjsImpl).toBe('function')
		expect(typeof writeArtifactsAsyncImpl).toBe('function')
		expect(typeof writeDtsAsyncImpl).toBe('function')
		expect(typeof writeMjsAsyncImpl).toBe('function')
	})

	it('should verify a complete Cache implementation with custom handlers', async () => {
		// Create a complete mock implementation of the Cache interface to validate
		// that the type definitions are working correctly

		const customCache: Cache = {
			readArtifactsSync: (entryModuleId) => {
				return entryModuleId === 'valid' ? { abi: [], bytecode: '0x' } : undefined
			},
			readArtifacts: async (entryModuleId) => {
				return entryModuleId === 'valid' ? { abi: [], bytecode: '0x' } : undefined
			},
			readDtsSync: (entryModuleId) => {
				return entryModuleId === 'valid' ? 'export declare class Test {}' : undefined
			},
			readDts: async (entryModuleId) => {
				return entryModuleId === 'valid' ? 'export declare class Test {}' : undefined
			},
			readMjsSync: (entryModuleId) => {
				return entryModuleId === 'valid' ? 'export class Test {}' : undefined
			},
			readMjs: async (entryModuleId) => {
				return entryModuleId === 'valid' ? 'export class Test {}' : undefined
			},
			writeArtifactsSync: (entryModuleId, artifacts) => {
				return `/cache/${entryModuleId}.json`
			},
			writeArtifacts: async (entryModuleId, artifacts) => {
				return `/cache/${entryModuleId}.json`
			},
			writeDtsSync: (entryModuleId, dtsFile) => {
				return `/cache/${entryModuleId}.d.ts`
			},
			writeDts: async (entryModuleId, dtsFile) => {
				return `/cache/${entryModuleId}.d.ts`
			},
			writeMjsSync: (entryModuleId, mjsFile) => {
				return `/cache/${entryModuleId}.mjs`
			},
			writeMjs: async (entryModuleId, mjsFile) => {
				return `/cache/${entryModuleId}.mjs`
			},
		}

		// Verify each method works as expected
		expect(customCache.readArtifactsSync('valid')).toEqual({ abi: [], bytecode: '0x' })
		expect(customCache.readArtifactsSync('invalid')).toBeUndefined()

		expect(customCache.readDtsSync('valid')).toBe('export declare class Test {}')
		expect(customCache.readDtsSync('invalid')).toBeUndefined()

		expect(customCache.readMjsSync('valid')).toBe('export class Test {}')
		expect(customCache.readMjsSync('invalid')).toBeUndefined()

		expect(customCache.writeArtifactsSync('test', { abi: [], bytecode: '0x' })).toBe('/cache/test.json')
		expect(customCache.writeDtsSync('test', 'content')).toBe('/cache/test.d.ts')
		expect(customCache.writeMjsSync('test', 'content')).toBe('/cache/test.mjs')

		// Test that async methods return promises
		await expect(customCache.readArtifacts('valid')).resolves.toEqual({ abi: [], bytecode: '0x' })
		await expect(customCache.readDts('valid')).resolves.toBe('export declare class Test {}')
		await expect(customCache.readMjs('valid')).resolves.toBe('export class Test {}')

		await expect(customCache.writeArtifacts('test', { abi: [], bytecode: '0x' })).resolves.toBe('/cache/test.json')
		await expect(customCache.writeDts('test', 'content')).resolves.toBe('/cache/test.d.ts')
		await expect(customCache.writeMjs('test', 'content')).resolves.toBe('/cache/test.mjs')
	})
})

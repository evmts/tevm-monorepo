import type { ResolvedArtifacts } from '@tevm/compiler'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createCache } from './createCache.js'
import type { FileAccessObject } from './types.js'

// Mock the path modules
vi.mock('./getArtifactsPath.js', () => ({
	getArtifactsPath: vi.fn((entryModuleId, item) => {
		const fileName = {
			dts: 'contract.d.ts',
			artifactsJson: 'artifacts.json',
			mjs: 'contract.mjs',
		}[item]
		const dir = `/mock/cwd/.tevm/${entryModuleId}`
		const path = `${dir}/${fileName}`
		return { dir, path }
	}),
}))

vi.mock('./getMetadataPath.js', () => ({
	getMetadataPath: vi.fn((entryModuleId) => {
		const dir = `/mock/cwd/.tevm/${entryModuleId}`
		const path = `${dir}/metadata.json`
		return { dir, path }
	}),
}))

describe('createCache', () => {
	// Mock file system operations
	const mockFs: FileAccessObject = {
		writeFileSync: vi.fn(),
		writeFile: vi.fn(),
		readFile: vi.fn(),
		readFileSync: vi.fn(),
		exists: vi.fn(),
		existsSync: vi.fn(),
		statSync: vi.fn(),
		stat: vi.fn(),
		mkdirSync: vi.fn(),
		mkdir: vi.fn(),
	}

	const mockCwd = '/mock/cwd'
	const mockCacheDir = '.tevm'
	const mockEntryModuleId = 'test/Contract.sol'
	const mockArtifacts: ResolvedArtifacts = {
		abi: [],
		bytecode: '0x123',
		deployedBytecode: '0x456',
	}

	beforeEach(() => {
		vi.resetAllMocks()
		mockFs.writeFileSync.mockImplementation(() => {})
		mockFs.writeFile.mockImplementation(() => Promise.resolve())
		mockFs.exists.mockImplementation(() => Promise.resolve(true))
		mockFs.existsSync.mockImplementation(() => true)
		mockFs.readFileSync.mockImplementation(() => '{"abi":[],"bytecode":"0x123","deployedBytecode":"0x456"}')
		mockFs.readFile.mockImplementation(() =>
			Promise.resolve('{"abi":[],"bytecode":"0x123","deployedBytecode":"0x456"}'),
		)
		mockFs.mkdirSync.mockImplementation(() => {})
		mockFs.mkdir.mockImplementation(() => Promise.resolve())
	})

	it('should create a cache object with all expected methods', () => {
		const cache = createCache(mockCacheDir, mockFs, mockCwd)

		expect(cache).toHaveProperty('writeArtifactsSync')
		expect(cache).toHaveProperty('writeArtifacts')
		expect(cache).toHaveProperty('readArtifactsSync')
		expect(cache).toHaveProperty('readArtifacts')
		expect(cache).toHaveProperty('writeDtsSync')
		expect(cache).toHaveProperty('writeDts')
		expect(cache).toHaveProperty('readDtsSync')
		expect(cache).toHaveProperty('readDts')
		expect(cache).toHaveProperty('writeMjsSync')
		expect(cache).toHaveProperty('writeMjs')
		expect(cache).toHaveProperty('readMjsSync')
		expect(cache).toHaveProperty('readMjs')
	})

	describe('dts operations', () => {
		it('should write dts file synchronously', () => {
			const cache = createCache(mockCacheDir, mockFs, mockCwd)
			const dtsContent = 'export declare class Contract {}'

			cache.writeDtsSync(mockEntryModuleId, dtsContent)

			expect(mockFs.mkdirSync).toHaveBeenCalled()
			expect(mockFs.writeFileSync).toHaveBeenCalledWith('/mock/cwd/.tevm/test/Contract.sol/contract.d.ts', dtsContent)
		})

		it('should write dts file asynchronously', async () => {
			const cache = createCache(mockCacheDir, mockFs, mockCwd)
			const dtsContent = 'export declare class Contract {}'

			await cache.writeDts(mockEntryModuleId, dtsContent)

			expect(mockFs.mkdir).toHaveBeenCalled()
			expect(mockFs.writeFile).toHaveBeenCalledWith('/mock/cwd/.tevm/test/Contract.sol/contract.d.ts', dtsContent)
		})

		it('should read dts file synchronously when it exists', () => {
			const cache = createCache(mockCacheDir, mockFs, mockCwd)
			const dtsContent = 'export declare class Contract {}'
			mockFs.existsSync.mockReturnValue(true)
			mockFs.readFileSync.mockReturnValue(dtsContent)

			const result = cache.readDtsSync(mockEntryModuleId)

			expect(mockFs.existsSync).toHaveBeenCalled()
			expect(mockFs.readFileSync).toHaveBeenCalledWith('/mock/cwd/.tevm/test/Contract.sol/contract.d.ts', 'utf8')
			expect(result).toBe(dtsContent)
		})

		it('should return undefined when reading dts synchronously if file does not exist', () => {
			const cache = createCache(mockCacheDir, mockFs, mockCwd)
			mockFs.existsSync.mockReturnValue(false)

			const result = cache.readDtsSync(mockEntryModuleId)

			expect(mockFs.existsSync).toHaveBeenCalled()
			expect(mockFs.readFileSync).not.toHaveBeenCalled()
			expect(result).toBeUndefined()
		})

		it('should read dts file asynchronously when it exists', async () => {
			const cache = createCache(mockCacheDir, mockFs, mockCwd)
			const dtsContent = 'export declare class Contract {}'
			mockFs.exists.mockResolvedValue(true)
			mockFs.readFile.mockResolvedValue(dtsContent)

			const result = await cache.readDts(mockEntryModuleId)

			expect(mockFs.exists).toHaveBeenCalled()
			expect(mockFs.readFile).toHaveBeenCalledWith('/mock/cwd/.tevm/test/Contract.sol/contract.d.ts', 'utf8')
			expect(result).toBe(dtsContent)
		})

		it('should return undefined when reading dts asynchronously if file does not exist', async () => {
			const cache = createCache(mockCacheDir, mockFs, mockCwd)
			mockFs.exists.mockResolvedValue(false)

			const result = await cache.readDts(mockEntryModuleId)

			expect(mockFs.exists).toHaveBeenCalled()
			expect(mockFs.readFile).not.toHaveBeenCalled()
			expect(result).toBeUndefined()
		})
	})

	describe('mjs operations', () => {
		it('should write mjs file synchronously', () => {
			const cache = createCache(mockCacheDir, mockFs, mockCwd)
			const mjsContent = 'export class Contract {}'

			cache.writeMjsSync(mockEntryModuleId, mjsContent)

			expect(mockFs.mkdirSync).toHaveBeenCalled()
			expect(mockFs.writeFileSync).toHaveBeenCalledWith('/mock/cwd/.tevm/test/Contract.sol/contract.mjs', mjsContent)
		})

		it('should write mjs file asynchronously', async () => {
			const cache = createCache(mockCacheDir, mockFs, mockCwd)
			const mjsContent = 'export class Contract {}'

			await cache.writeMjs(mockEntryModuleId, mjsContent)

			expect(mockFs.mkdir).toHaveBeenCalled()
			expect(mockFs.writeFile).toHaveBeenCalledWith('/mock/cwd/.tevm/test/Contract.sol/contract.mjs', mjsContent)
		})

		it('should read mjs file synchronously when it exists', () => {
			const cache = createCache(mockCacheDir, mockFs, mockCwd)
			const mjsContent = 'export class Contract {}'
			mockFs.existsSync.mockReturnValue(true)
			mockFs.readFileSync.mockReturnValue(mjsContent)

			const result = cache.readMjsSync(mockEntryModuleId)

			expect(mockFs.existsSync).toHaveBeenCalled()
			expect(mockFs.readFileSync).toHaveBeenCalledWith('/mock/cwd/.tevm/test/Contract.sol/contract.mjs', 'utf8')
			expect(result).toBe(mjsContent)
		})

		it('should return undefined when reading mjs synchronously if file does not exist', () => {
			const cache = createCache(mockCacheDir, mockFs, mockCwd)
			mockFs.existsSync.mockReturnValue(false)

			const result = cache.readMjsSync(mockEntryModuleId)

			expect(mockFs.existsSync).toHaveBeenCalled()
			expect(mockFs.readFileSync).not.toHaveBeenCalled()
			expect(result).toBeUndefined()
		})

		it('should read mjs file asynchronously when it exists', async () => {
			const cache = createCache(mockCacheDir, mockFs, mockCwd)
			const mjsContent = 'export class Contract {}'
			mockFs.exists.mockResolvedValue(true)
			mockFs.readFile.mockResolvedValue(mjsContent)

			const result = await cache.readMjs(mockEntryModuleId)

			expect(mockFs.exists).toHaveBeenCalled()
			expect(mockFs.readFile).toHaveBeenCalledWith('/mock/cwd/.tevm/test/Contract.sol/contract.mjs', 'utf8')
			expect(result).toBe(mjsContent)
		})

		it('should return undefined when reading mjs asynchronously if file does not exist', async () => {
			const cache = createCache(mockCacheDir, mockFs, mockCwd)
			mockFs.exists.mockResolvedValue(false)

			const result = await cache.readMjs(mockEntryModuleId)

			expect(mockFs.exists).toHaveBeenCalled()
			expect(mockFs.readFile).not.toHaveBeenCalled()
			expect(result).toBeUndefined()
		})
	})
})

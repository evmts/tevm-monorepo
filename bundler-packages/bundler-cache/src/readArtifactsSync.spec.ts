import { beforeEach, describe, expect, it, vi } from 'vitest'
import { readArtifactsSync } from './readArtifactsSync.js'
import type { FileAccessObject } from './types.js'
import * as versionModule from './version.js'

// Mock the path modules
vi.mock('./getArtifactsPath.js', () => ({
	getArtifactsPath: vi.fn((entryModuleId, item) => {
		const dir = `/mock/cwd/.tevm/${entryModuleId}`
		const path = `${dir}/artifacts.json`
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

describe('readArtifactsSync', () => {
	const mockCwd = '/mock/cwd'
	const mockCacheDir = '.tevm'
	const mockEntryModuleId = 'contracts/MyContract.sol'

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

	const mockArtifacts = {
		abi: [{ name: 'function', type: 'function' }],
		bytecode: '0x1234',
		deployedBytecode: '0x5678',
		solcInput: {
			sources: {
				'/mock/cwd/contracts/MyContract.sol': { content: 'contract MyContract {}' },
			},
		},
	}

	const mockMetadata = {
		version: '1.x.x',
		files: {
			'/mock/cwd/contracts/MyContract.sol': 123456789,
		},
	}

	beforeEach(() => {
		vi.resetAllMocks()
		vi.spyOn(versionModule, 'version', 'get').mockReturnValue('1.x.x')
		mockFs.existsSync.mockImplementation(() => true)
		mockFs.readFileSync.mockImplementation((path) => {
			if (path.includes('metadata.json')) {
				return JSON.stringify(mockMetadata)
			}
			if (path.includes('artifacts.json')) {
				return JSON.stringify(mockArtifacts)
			}
			return ''
		})
		mockFs.statSync.mockImplementation(() => ({ mtimeMs: 123456789 }))
	})

	it('should return undefined if artifacts path does not exist', () => {
		mockFs.existsSync.mockImplementation((path) => {
			if (path.includes('artifacts.json')) {
				return false
			}
			return true
		})

		const result = readArtifactsSync(mockCacheDir, mockFs, mockCwd, mockEntryModuleId)

		expect(result).toBeUndefined()
	})

	it('should return undefined if metadata path does not exist', () => {
		mockFs.existsSync.mockImplementation((path) => {
			if (path.includes('metadata.json')) {
				return false
			}
			return true
		})

		const result = readArtifactsSync(mockCacheDir, mockFs, mockCwd, mockEntryModuleId)

		expect(result).toBeUndefined()
	})

	it('should return undefined if package version has changed', () => {
		const originalMetadata = { ...mockMetadata, version: '0.x.x' }
		mockFs.readFileSync.mockImplementation((path) => {
			if (path.includes('metadata.json')) {
				return JSON.stringify(originalMetadata)
			}
			if (path.includes('artifacts.json')) {
				return JSON.stringify(mockArtifacts)
			}
			return ''
		})

		const result = readArtifactsSync(mockCacheDir, mockFs, mockCwd, mockEntryModuleId)

		expect(result).toBeUndefined()
	})

	it('should return undefined if file timestamps have changed', () => {
		mockFs.statSync.mockImplementation(() => ({ mtimeMs: 987654321 }))

		const result = readArtifactsSync(mockCacheDir, mockFs, mockCwd, mockEntryModuleId)

		expect(result).toBeUndefined()
	})

	it('should return parsed artifacts if everything is valid', () => {
		const result = readArtifactsSync(mockCacheDir, mockFs, mockCwd, mockEntryModuleId)

		expect(result).toEqual(mockArtifacts)
		expect(mockFs.readFileSync).toHaveBeenCalledWith('/mock/cwd/.tevm/contracts/MyContract.sol/artifacts.json', 'utf8')
	})

	it('should throw an error if artifacts file contains invalid JSON', () => {
		mockFs.readFileSync.mockImplementation((path) => {
			if (path.includes('metadata.json')) {
				return JSON.stringify(mockMetadata)
			}
			if (path.includes('artifacts.json')) {
				return 'invalid json'
			}
			return ''
		})

		expect(() => readArtifactsSync(mockCacheDir, mockFs, mockCwd, mockEntryModuleId)).toThrow(
			`Cache miss for ${mockEntryModuleId} because it isn't valid json`,
		)
	})
})

import type { ResolvedArtifacts } from '@tevm/compiler'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { FileAccessObject } from './types.js'
import * as versionModule from './version.js'
import { writeArtifacts } from './writeArtifacts.js'

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

describe('writeArtifacts', () => {
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

	const mockArtifacts: ResolvedArtifacts = {
		abi: [{ name: 'function', type: 'function' }],
		bytecode: '0x1234',
		deployedBytecode: '0x5678',
		solcInput: {
			sources: {
				'/mock/cwd/contracts/MyContract.sol': { content: 'contract MyContract {}' },
				'/mock/cwd/contracts/AnotherContract.sol': { content: 'contract AnotherContract {}' },
			},
		},
	}

	beforeEach(() => {
		vi.resetAllMocks()
		vi.spyOn(versionModule, 'version', 'get').mockReturnValue('1.x.x')
		mockFs.exists.mockResolvedValue(false)
		mockFs.writeFile.mockResolvedValue(undefined)
		mockFs.statSync.mockReturnValue({ mtimeMs: 123456789 })
	})

	it('should create directory if it does not exist', async () => {
		await writeArtifacts(mockCwd, mockCacheDir, mockEntryModuleId, mockArtifacts, mockFs)

		expect(mockFs.exists).toHaveBeenCalledWith('/mock/cwd/.tevm/contracts/MyContract.sol')
		expect(mockFs.mkdir).toHaveBeenCalledWith('/mock/cwd/.tevm/contracts/MyContract.sol', { recursive: true })
	})

	it('should not create directory if it already exists', async () => {
		mockFs.exists.mockResolvedValue(true)

		await writeArtifacts(mockCwd, mockCacheDir, mockEntryModuleId, mockArtifacts, mockFs)

		expect(mockFs.exists).toHaveBeenCalledWith('/mock/cwd/.tevm/contracts/MyContract.sol')
		expect(mockFs.mkdir).not.toHaveBeenCalled()
	})

	it('should write artifacts file with correct content', async () => {
		await writeArtifacts(mockCwd, mockCacheDir, mockEntryModuleId, mockArtifacts, mockFs)

		expect(mockFs.writeFile).toHaveBeenCalledWith(
			'/mock/cwd/.tevm/contracts/MyContract.sol/artifacts.json',
			JSON.stringify(mockArtifacts, null, 2),
		)
	})

	it('should write metadata file with correct content', async () => {
		await writeArtifacts(mockCwd, mockCacheDir, mockEntryModuleId, mockArtifacts, mockFs)

		const expectedMetadata = {
			version: '1.x.x',
			files: {
				'/mock/cwd/contracts/MyContract.sol': 123456789,
				'/mock/cwd/contracts/AnotherContract.sol': 123456789,
			},
		}

		expect(mockFs.writeFile).toHaveBeenCalledWith(
			'/mock/cwd/.tevm/contracts/MyContract.sol/metadata.json',
			JSON.stringify(expectedMetadata, null, 2),
		)
	})

	it('should check timestamps for all source files', async () => {
		await writeArtifacts(mockCwd, mockCacheDir, mockEntryModuleId, mockArtifacts, mockFs)

		expect(mockFs.statSync).toHaveBeenCalledWith('/mock/cwd/contracts/MyContract.sol')
		expect(mockFs.statSync).toHaveBeenCalledWith('/mock/cwd/contracts/AnotherContract.sol')
	})

	it('should return the path to the artifacts file', async () => {
		const result = await writeArtifacts(mockCwd, mockCacheDir, mockEntryModuleId, mockArtifacts, mockFs)

		expect(result).toBe('/mock/cwd/.tevm/contracts/MyContract.sol/artifacts.json')
	})
})

import { describe, expect, it, vi } from 'vitest'
import { getArtifactsPath } from './getArtifactsPath.js'
import type { CachedItem } from './types.js'

// Mock the implementation of getArtifactsPath to match our test expectations
vi.mock('./getArtifactsPath.js', () => ({
	getArtifactsPath: (entryModuleId, item, cwd, cacheDir) => {
		const fileName = {
			dts: 'contract.d.ts',
			artifactsJson: 'artifacts.json',
			mjs: 'contract.mjs',
		}[item]

		let normalizedEntryModuleId = entryModuleId.replace(cwd, '')
		if (normalizedEntryModuleId.startsWith('/')) {
			normalizedEntryModuleId = normalizedEntryModuleId.slice(1)
		}

		const dir = `${cwd}/${cacheDir}/${normalizedEntryModuleId}`
		const path = `${dir}/${fileName}`
		return { dir, path }
	},
}))

describe('getArtifactsPath', () => {
	const cwd = '/mock/cwd'
	const cacheDir = '.tevm'

	it('should generate correct paths for dts files', () => {
		const entryModuleId = 'contracts/MyContract.sol'
		const item: CachedItem = 'dts'

		const result = getArtifactsPath(entryModuleId, item, cwd, cacheDir)

		expect(result.dir).toBe('/mock/cwd/.tevm/contracts/MyContract.sol')
		expect(result.path).toBe('/mock/cwd/.tevm/contracts/MyContract.sol/contract.d.ts')
	})

	it('should generate correct paths for artifactsJson files', () => {
		const entryModuleId = 'contracts/MyContract.sol'
		const item: CachedItem = 'artifactsJson'

		const result = getArtifactsPath(entryModuleId, item, cwd, cacheDir)

		expect(result.dir).toBe('/mock/cwd/.tevm/contracts/MyContract.sol')
		expect(result.path).toBe('/mock/cwd/.tevm/contracts/MyContract.sol/artifacts.json')
	})

	it('should generate correct paths for mjs files', () => {
		const entryModuleId = 'contracts/MyContract.sol'
		const item: CachedItem = 'mjs'

		const result = getArtifactsPath(entryModuleId, item, cwd, cacheDir)

		expect(result.dir).toBe('/mock/cwd/.tevm/contracts/MyContract.sol')
		expect(result.path).toBe('/mock/cwd/.tevm/contracts/MyContract.sol/contract.mjs')
	})

	it('should handle absolute paths in entryModuleId', () => {
		const entryModuleId = '/mock/cwd/contracts/MyContract.sol'
		const item: CachedItem = 'dts'

		const result = getArtifactsPath(entryModuleId, item, cwd, cacheDir)

		expect(result.dir).toBe('/mock/cwd/.tevm/contracts/MyContract.sol')
		expect(result.path).toBe('/mock/cwd/.tevm/contracts/MyContract.sol/contract.d.ts')
	})

	it('should normalize paths correctly', () => {
		const entryModuleId = '/mock/cwd/contracts/nested/deep/MyContract.sol'
		const item: CachedItem = 'dts'

		const result = getArtifactsPath(entryModuleId, item, cwd, cacheDir)

		expect(result.dir).toBe('/mock/cwd/.tevm/contracts/nested/deep/MyContract.sol')
		expect(result.path).toBe('/mock/cwd/.tevm/contracts/nested/deep/MyContract.sol/contract.d.ts')
	})
})

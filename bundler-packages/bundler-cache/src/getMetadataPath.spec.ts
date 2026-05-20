import { describe, expect, it } from 'vitest'
import { cacheHash } from './cacheHash.js'
import { getMetadataPath } from './getMetadataPath.js'

describe('getMetadataPath', () => {
	const cwd = '/mock/cwd'
	const cacheDir = '.tevm'

	it('should generate correct metadata path', () => {
		const entryModuleId = 'contracts/MyContract.sol'

		const result = getMetadataPath(entryModuleId, cwd, cacheDir)

		expect(result.dir).toBe('/mock/cwd/.tevm/contracts/MyContract.sol')
		expect(result.path).toBe('/mock/cwd/.tevm/contracts/MyContract.sol/metadata.json')
	})

	it('should handle absolute paths in entryModuleId', () => {
		const entryModuleId = '/mock/cwd/contracts/MyContract.sol'

		const result = getMetadataPath(entryModuleId, cwd, cacheDir)

		expect(result.dir).toBe('/mock/cwd/.tevm/contracts/MyContract.sol')
		expect(result.path).toBe('/mock/cwd/.tevm/contracts/MyContract.sol/metadata.json')
	})

	it('should work with nested contract paths', () => {
		const entryModuleId = 'contracts/nested/deep/MyContract.sol'

		const result = getMetadataPath(entryModuleId, cwd, cacheDir)

		expect(result.dir).toBe('/mock/cwd/.tevm/contracts/nested/deep/MyContract.sol')
		expect(result.path).toBe('/mock/cwd/.tevm/contracts/nested/deep/MyContract.sol/metadata.json')
	})

	it('should namespace absolute cache directories by project root', () => {
		const projectHash = cacheHash(cwd).slice(0, 16)
		const result = getMetadataPath('contracts/MyContract.sol', cwd, '/shared/.tevm')

		expect(result.dir).toBe(`/shared/.tevm/__projects__/${projectHash}/contracts/MyContract.sol`)
		expect(result.path).toBe(`/shared/.tevm/__projects__/${projectHash}/contracts/MyContract.sol/metadata.json`)
	})
})

import { describe, expect, it } from 'vitest'
import { resolveVitestTestFilePath } from './resolveVitestTestFilePath.js'

describe('resolveVitestTestFilePath', () => {
	it('should return test directory, test file, and snapshot path', () => {
		const result = resolveVitestTestFilePath()

		expect(result).toHaveProperty('testDir')
		expect(result).toHaveProperty('testFile')
		expect(result).toHaveProperty('snapshotPath')

		// testDir should be a valid directory path
		expect(result.testDir).toMatch(/\/internal$/)

		// testFile should match this test file name
		expect(result.testFile).toBe('resolveVitestTestFilePath.spec.ts')

		// snapshotPath should include __rpc_snapshots__ directory
		expect(result.snapshotPath).toMatch(/\/__rpc_snapshots__\/resolveVitestTestFilePath\.spec\.ts\.snap\.json$/)
	})

	it('should place snapshot in __rpc_snapshots__ subdirectory', () => {
		const result = resolveVitestTestFilePath()

		expect(result.snapshotPath).toContain('__rpc_snapshots__')
		// Should be testDir/__rpc_snapshots__/baseName.snap.json
		expect(result.snapshotPath).toBe(`${result.testDir}/__rpc_snapshots__/resolveVitestTestFilePath.spec.ts.snap.json`)
	})
})

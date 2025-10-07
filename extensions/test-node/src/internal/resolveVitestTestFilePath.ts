import { basename, dirname, join } from 'node:path'
import { expect } from 'vitest'

/**
 * Resolves snapshot file path from vitest test context
 * @returns {object} Test path information
 * @returns {string} testDir - Directory containing test file
 * @returns {string} testFile - Test filename
 * @returns {string} snapshotPath - Full path to snapshot: testDir/__rpc_snapshots__/testFile.snap.json
 * @throws {Error} If not running in vitest context
 * @example
 * ```typescript
 * const { testDir, testFile, snapshotPath } = resolveVitestTestFilePath()
 * // testDir: '/path/to/tests'
 * // testFile: 'myTest.spec.ts'
 * // snapshotPath: '/path/to/tests/__rpc_snapshots__/myTest.spec.ts.snap.json'
 * ```
 */
export const resolveVitestTestFilePath = (): {
	testDir: string
	testFile: string
	snapshotPath: string
} => {
	const testPath = expect.getState().testPath
	if (!testPath) {
		throw new Error('Test file path not available. @tevm/test-node requires running within a vitest test context.')
	}

	const testDir = dirname(testPath)
	const testFile = basename(testPath)
	const snapshotPath = join(testDir, '__rpc_snapshots__', `${testFile}.snap.json`)

	return { testDir, testFile, snapshotPath }
}

import { basename, dirname, join } from 'node:path'
import { expect } from 'vitest'

/**
 * Resolves snapshot file path from vitest test context
 * @returns {string} snapshotPath - Full path to snapshot: testDir/__rpc_snapshots__/testFile.snap.json
 * @throws {Error} If not running in vitest context
 */
export const resolveVitestTestSnapshotPath = (): string => {
	const vitestNotAvailableError = new Error(
		'Test file path not available. If `resolveSnapshotPath: "vitest"` is used, you should be running in a vitest test context.',
	)
	if (typeof expect.getState !== 'function') throw vitestNotAvailableError
	const testPath = expect.getState().testPath
	if (!testPath) throw vitestNotAvailableError

	return join(dirname(testPath), '__rpc_snapshots__', `${basename(testPath)}.snap.json`)
}

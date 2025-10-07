import { join } from 'node:path'

/**
 * Resolves snapshot file path from Bun test context using import.meta
 * @returns {string} snapshotPath - Full path to snapshot: testDir/__rpc_snapshots__/testFile.snap.json
 * @throws {Error} If not running in Bun test context (import.meta properties unavailable)
 * @example
 * ```typescript
 * const snapshotPath = resolveBunTestSnapshotPath()
 * // Returns: '/path/to/tests/__rpc_snapshots__/myTest.test.ts.snap.json'
 * ```
 */
export const resolveBunTestSnapshotPath = (): string => {
	const bunNotAvailableError = new Error(
		'Test file path not available. If `resolveSnapshotPath: "bun"` is used, you should be running in a bun test context.',
	)
	if (!globalThis.Bun || typeof globalThis.Bun === 'undefined') {
		throw bunNotAvailableError
	}

	const testPath = globalThis.Bun.main
	const testDir = testPath.substring(0, testPath.lastIndexOf('/'))
	const testFile = testPath.split('/').pop()
	if (!testFile) throw bunNotAvailableError

	return join(testDir, '__rpc_snapshots__', `${testFile}.snap.json`)
}

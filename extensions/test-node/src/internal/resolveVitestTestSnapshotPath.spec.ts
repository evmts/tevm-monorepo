import { describe, expect, it } from 'vitest'
import { resolveVitestTestSnapshotPath } from './resolveVitestTestSnapshotPath.js'

// Detect if we're running in vitest (has expect.getState())
const isVitest = typeof expect.getState === 'function'

describe('resolveVitestTestSnapshotPath', () => {
	it.skipIf(isVitest)('should throw error when not running in vitest test context', () => {
		expect(() => resolveVitestTestSnapshotPath()).toThrow(
			'Test file path not available. If `resolveSnapshotPath: "vitest"` is used, you should be running in a vitest test context.',
		)
	})

	it.skipIf(!isVitest)('should return snapshot path when running in vitest', () => {
		const snapshotPath = resolveVitestTestSnapshotPath()
		expect(snapshotPath).toMatch(/\/__rpc_snapshots__\/resolveVitestTestSnapshotPath\.spec\.ts\.snap\.json$/)
	})
})

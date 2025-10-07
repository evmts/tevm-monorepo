import { describe, expect, it } from 'vitest'
import { resolveBunTestSnapshotPath } from './resolveBunTestSnapshotPath.js'

// Detect if we're running in Bun
const isBun = typeof (globalThis as any).Bun !== 'undefined'

describe('resolveBunTestSnapshotPath', () => {
	it.skipIf(isBun)('should throw error when not running in Bun test context', () => {
		// We're running in vitest, so this should throw
		expect(() => resolveBunTestSnapshotPath()).toThrow(
			'Test file path not available. If `resolveSnapshotPath: "bun"` is used, you should be running in a bun test context.',
		)
	})

	it.skipIf(!isBun)('should return snapshot path when running in Bun', () => {
		// This test only runs in Bun
		const snapshotPath = resolveBunTestSnapshotPath()
		expect(snapshotPath).toMatch(/\/__rpc_snapshots__\/resolveBunTestSnapshotPath\.spec\.ts\.snap\.json$/)
	})
})

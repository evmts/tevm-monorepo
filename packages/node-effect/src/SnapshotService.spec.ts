import { describe, it, expect } from 'vitest'
import { Context } from 'effect'
import { SnapshotService } from './SnapshotService.js'

describe('SnapshotService', () => {
	it('should be defined', () => {
		expect(SnapshotService).toBeDefined()
	})

	it('should be a Context.Tag', () => {
		expect(typeof SnapshotService).toBe('object')
		expect(Context.isTag(SnapshotService)).toBe(true)
	})

	it('should have the correct key', () => {
		// @ts-expect-error - accessing internal key
		expect(SnapshotService.key).toBe('@tevm/node-effect/SnapshotService')
	})
})

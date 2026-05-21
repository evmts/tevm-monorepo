import { describe, expect, it } from 'vitest'
import { chainIdToLightSyncNetwork, normalizeSlots, selectStartupCheckpoint } from './lightSync.js'

describe('lightSync helpers', () => {
	it('maps supported chain ids', () => {
		expect(chainIdToLightSyncNetwork(1)).toBe('mainnet')
		expect(chainIdToLightSyncNetwork(11155111)).toBe('sepolia')
		expect(chainIdToLightSyncNetwork(17000)).toBe('holesky')
	})

	it('selects explicit over persisted/default', () => {
		const selected = selectStartupCheckpoint({ explicitCheckpoint: '0xabc', defaultCheckpoint: '0xdef' })
		expect(selected).toEqual({ checkpointSource: 'explicit', checkpoint: '0xabc' })
	})

	it('falls back deterministically to default', () => {
		const selected = selectStartupCheckpoint({ defaultCheckpoint: '0xdef' })
		expect(selected).toEqual({ checkpointSource: 'default', checkpoint: '0xdef' })
	})

	it('uses persisted checkpoint when valid and fresh', () => {
		const selected = selectStartupCheckpoint({
			persistedCheckpointPath: '/tmp/checkpoint.json',
			nowMs: 1_000,
			maxCheckpointAgeMs: 500,
			fsOps: {
				existsSync: () => true,
				readFileSync: () => JSON.stringify({ checkpoint: '0xaaa', updatedAtMs: 900 }),
			},
		})
		expect(selected).toEqual({ checkpointSource: 'persisted', checkpoint: '0xaaa' })
	})

	it('handles missing persisted file deterministically in strict mode', () => {
		const selected = selectStartupCheckpoint({
			persistedCheckpointPath: '/tmp/missing.json',
			strictCheckpointAge: true,
			defaultCheckpoint: '0xdef',
			fsOps: { existsSync: () => false, readFileSync: () => '' },
		})
		expect(selected).toEqual({ checkpointSource: 'none', checkpoint: null })
	})

	it('handles malformed persisted file deterministically in strict mode', () => {
		const selected = selectStartupCheckpoint({
			persistedCheckpointPath: '/tmp/malformed.json',
			strictCheckpointAge: true,
			defaultCheckpoint: '0xdef',
			fsOps: { existsSync: () => true, readFileSync: () => '{bad-json' },
		})
		expect(selected).toEqual({ checkpointSource: 'none', checkpoint: null })
	})

	it('handles unreadable persisted file deterministically in strict mode', () => {
		const selected = selectStartupCheckpoint({
			persistedCheckpointPath: '/tmp/unreadable.json',
			strictCheckpointAge: true,
			defaultCheckpoint: '0xdef',
			fsOps: {
				existsSync: () => true,
				readFileSync: () => {
					throw new Error('EACCES')
				},
			},
		})
		expect(selected).toEqual({ checkpointSource: 'none', checkpoint: null })
	})

	it('handles stale persisted checkpoint based on strict mode', () => {
		const nonStrict = selectStartupCheckpoint({
			persistedCheckpointPath: '/tmp/stale.json',
			nowMs: 10_000,
			maxCheckpointAgeMs: 100,
			defaultCheckpoint: '0xdef',
			fsOps: {
				existsSync: () => true,
				readFileSync: () => JSON.stringify({ checkpoint: '0xaaa', updatedAtMs: 1 }),
			},
		})
		const strict = selectStartupCheckpoint({
			persistedCheckpointPath: '/tmp/stale.json',
			strictCheckpointAge: true,
			nowMs: 10_000,
			maxCheckpointAgeMs: 100,
			defaultCheckpoint: '0xdef',
			fsOps: {
				existsSync: () => true,
				readFileSync: () => JSON.stringify({ checkpoint: '0xaaa', updatedAtMs: 1 }),
			},
		})
		expect(nonStrict).toEqual({ checkpointSource: 'default', checkpoint: '0xdef' })
		expect(strict).toEqual({ checkpointSource: 'none', checkpoint: null })
	})

	it('enforces finalized <= safe <= optimistic', () => {
		const normalized = normalizeSlots({
			ready: true,
			status: 'ready',
			network: 'mainnet',
			checkpointSource: 'default',
			lastCheckpoint: '0xabc',
			optimisticSlot: 10n,
			safeSlot: 20n,
			finalizedSlot: 30n,
		})
		expect(normalized.optimisticSlot).toBe(10n)
		expect(normalized.safeSlot).toBe(10n)
		expect(normalized.finalizedSlot).toBe(10n)
	})
})

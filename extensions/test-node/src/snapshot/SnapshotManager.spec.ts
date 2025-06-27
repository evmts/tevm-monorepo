import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import fs from 'node:fs/promises'
import { SnapshotManager } from './SnapshotManager.js'
import { cleanupSnapshots } from '../test/snapshot-utils.js'

describe('SnapshotManager', () => {
	const testCacheDir = SnapshotManager.defaultCacheDir
	let manager: SnapshotManager

	beforeEach(async () => {
		cleanupSnapshots(testCacheDir)
		manager = new SnapshotManager(testCacheDir)
	})

	afterEach(async () => {
		cleanupSnapshots(testCacheDir)
	})

	it('should initialize with empty snapshots when no file exists', async () => {
		expect(manager.has('test-key')).toBe(false)
		expect(manager.get('test-key')).toBeUndefined()
	})

	it('should set and get snapshot values', async () => {
		const testData = { result: '0x123' }
		manager.set('test-key', testData)

		expect(manager.has('test-key')).toBe(true)
		expect(manager.get('test-key')).toEqual(testData)
	})

	it('should save snapshots to disk', async () => {
		const testData = { result: '0x123' }
		manager.set('test-key', testData)

		await manager.save()

		// @ts-expect-error - accessing private property for testing
		const snapshotPath = manager.snapshotPath
		const content = await fs.readFile(snapshotPath, 'utf-8')
		const saved = JSON.parse(content)

		expect(saved['test-key']).toEqual(testData)
	})

	it('should load existing snapshots from disk', async () => {
		// Create a snapshot file manually
		const testData = { 'existing-key': { result: '0x456' } }
		// @ts-expect-error - accessing private property for testing
		const snapshotDir = manager.snapshotDir
		await fs.mkdir(snapshotDir, { recursive: true })
		// @ts-expect-error - accessing private property for testing
		await fs.writeFile(manager.snapshotPath, JSON.stringify(testData, null, 2))

		// Create new manager to load from disk
		const newManager = new SnapshotManager(testCacheDir)

		expect(newManager.has('existing-key')).toBe(true)
		expect(newManager.get('existing-key')).toEqual({ result: '0x456' })
	})

	it('should handle multiple snapshots', async () => {
		const data1 = { result: '0x111' }
		const data2 = { result: '0x222' }
		const data3 = { result: '0x333' }

		manager.set('key1', data1)
		manager.set('key2', data2)
		manager.set('key3', data3)

		expect(manager.get('key1')).toEqual(data1)
		expect(manager.get('key2')).toEqual(data2)
		expect(manager.get('key3')).toEqual(data3)

		await manager.save()

		// Verify all saved
		const newManager = new SnapshotManager(testCacheDir)

		expect(newManager.get('key1')).toEqual(data1)
		expect(newManager.get('key2')).toEqual(data2)
		expect(newManager.get('key3')).toEqual(data3)
	})

	it('should handle corrupt snapshot file gracefully', async () => {
		// Create corrupt file
		// @ts-expect-error - accessing private property for testing
		const snapshotDir = manager.snapshotDir
		await fs.mkdir(snapshotDir, { recursive: true })
		// @ts-expect-error - accessing private property for testing
		await fs.writeFile(manager.snapshotPath, 'invalid json content')

		// Should start with empty snapshots
		const newManager = new SnapshotManager(testCacheDir)

		expect(newManager.has('any-key')).toBe(false)
	})

	it('should reload snapshots from disk when checking cache', async () => {
		const testData = { result: '0xabc' }
		manager.set('reload-test', testData)
		await manager.save()

		// Create new manager to simulate different process
		const newManager = new SnapshotManager(testCacheDir)

		expect(newManager.get('reload-test')).toEqual(testData)
	})
})
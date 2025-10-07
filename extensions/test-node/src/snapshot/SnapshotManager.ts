import fs from 'node:fs'
import fsPromises from 'node:fs/promises'
import path from 'node:path'
import { resolveVitestTestFilePath } from '../internal/resolveVitestTestFilePath.js'
import type { TestOptions } from '../types.js'

/**
 * Manages reading and writing of snapshot files for test caching
 * Places snapshots in __rpc_snapshots__/ subdirectory next to test files using vitest's test context
 */
export class SnapshotManager {
	private snapshots: Map<string, any> = new Map()
	private snapshotPath: string

	constructor(resolveSnapshotPath?: TestOptions['resolveSnapshotPath']) {
		this.snapshotPath = this.resolveSnapshotPath(resolveSnapshotPath)
		this.load()
	}

	/**
	 * Resolve the snapshot file path
	 * Snapshots are placed in __rpc_snapshots__/ subdirectory next to test files (vitest mode)
	 * or at custom location (function mode)
	 */
	private resolveSnapshotPath(resolver?: TestOptions['resolveSnapshotPath']): string {
		if (resolver === undefined || resolver === 'vitest') {
			const { snapshotPath } = resolveVitestTestFilePath()
			return snapshotPath
		}

		if (typeof resolver === 'function') {
			return resolver()
		}

		throw new Error(`Invalid resolveSnapshotPath: ${typeof resolver}`)
	}

	/**
	 * Initialize the snapshot manager by loading existing snapshots
	 */
	private load(): this {
		if (fs.existsSync(this.snapshotPath)) {
			const content = fs.readFileSync(this.snapshotPath, 'utf-8')
			const data = JSON.parse(content)
			this.snapshots = new Map(Object.entries(data))
		} else {
			this.snapshots = new Map()
		}

		return this
	}

	/**
	 * Get a snapshot by key
	 */
	get(key: string): any | undefined {
		return this.snapshots.get(key)
	}

	/**
	 * Set a snapshot value
	 */
	set(key: string, value: any): void {
		this.snapshots.set(key, value)
	}

	/**
	 * Check if a snapshot exists
	 */
	has(key: string): boolean {
		return this.snapshots.has(key)
	}

	/**
	 * Write all snapshots to disk
	 */
	async save(): Promise<void> {
		if (this.snapshots.size === 0) return

		const dir = path.dirname(this.snapshotPath)
		await fsPromises.mkdir(dir, { recursive: true })

		const data = Object.fromEntries(this.snapshots)
		const content = JSON.stringify(data, null, 2)

		await fsPromises.writeFile(this.snapshotPath, content, 'utf-8')
	}
}

import fs from 'node:fs'
import fsPromises from 'node:fs/promises'
import path from 'node:path'
import { getCurrentTestFile } from '../core/getCurrentTestFile.js'

/**
 * Manages reading and writing of snapshot files for test caching
 * Uses a format similar to Vitest snapshots
 */
export class SnapshotManager {
	static defaultCacheDir = path.join(process.cwd(), '.tevm', 'test-snapshots')
	private snapshotDir: string
	private testFile: string
	private snapshots: Map<string, any> = new Map()
	private snapshotPath: string

	constructor(cacheDir?: string) {
		this.testFile = getCurrentTestFile()
		const baseDir = cacheDir ?? SnapshotManager.defaultCacheDir
		this.snapshotDir = path.join(baseDir, this.testFile)
		this.snapshotPath = path.join(this.snapshotDir, 'snapshots.json')

		this.load()
	}

	/**
	 * Initialize the snapshot manager by loading existing snapshots
	 */
	private load(): this {
		try {
			const content = fs.readFileSync(this.snapshotPath, 'utf-8')
			const data = JSON.parse(content)
			this.snapshots = new Map(Object.entries(data))
		} catch (error) {
			// File doesn't exist or is invalid, start with empty snapshots
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
		await fsPromises.mkdir(this.snapshotDir, { recursive: true })

		const data = Object.fromEntries(this.snapshots)
		const content = JSON.stringify(data, null, 2)

		await fsPromises.writeFile(this.snapshotPath, content, 'utf-8')
	}

}
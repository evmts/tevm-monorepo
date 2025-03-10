import fs from 'node:fs'
import { access } from 'node:fs/promises'
import { Effect } from 'effect'
import { flip } from 'effect/Effect'
import { describe, expect, it } from 'vitest'
import type { FileAccessObject } from '../types.js'
import { ResolveError, resolveSafe } from './resolveSafe.js'
import { safeFao } from './safeFao.js'

// Create a real test without mocking resolve
const fao: FileAccessObject = {
	existsSync: (filePath: string) => fs.existsSync(filePath),
	readFile: (filePath: string, encoding: string) =>
		Promise.resolve(fs.readFileSync(filePath, { encoding: encoding as 'utf8' })),
	readFileSync: (filePath: string) => fs.readFileSync(filePath, 'utf8'),
	exists: async (filePath: string) => {
		try {
			await access(filePath)
			return true
		} catch (e) {
			return false
		}
	},
}

describe('resolveSafe', () => {
	it('should resolve a file path when successful', async () => {
		// Test with a file that should exist (package.json)
		const result = await Effect.runPromise(resolveSafe('./package.json', process.cwd(), safeFao(fao)))
		expect(result).toContain('package.json')
	})

	it('should fail with ResolveError for general errors', async () => {
		// Test with a file that doesn't exist
		const error = await Effect.runPromise(flip(resolveSafe('non-existent-file-12345.js', process.cwd(), safeFao(fao))))
		expect(error).toBeInstanceOf(ResolveError)
		expect(error._tag).toBe('ResolveError')
	})
})

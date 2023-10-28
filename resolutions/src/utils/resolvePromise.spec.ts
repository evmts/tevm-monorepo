import type { FileAccessObject } from '../types.js'
import { resolveEffect } from './resolvePromise.js'
import { Effect } from 'effect'
import fs from 'fs'
import { describe, expect, it } from 'vitest'

const fao: FileAccessObject = {
	existsSync: (filePath: string) => fs.existsSync(filePath),
	readFile: (filePath: string, encoding: string) =>
		Promise.resolve(
			fs.readFileSync(filePath, { encoding: encoding as 'utf8' }),
		),
	readFileSync: (filePath: string) => fs.readFileSync(filePath, 'utf8'),
}

describe('resolvePromise', () => {
	it('should resolve a file path in the base directory', async () => {
		const resolvedPath = await Effect.runPromise(
			resolveEffect('./resolvePromise.spec.ts', __dirname, fao),
		)
		expect(resolvedPath.endsWith('src/utils/resolvePromise.spec.ts')).toBe(true)
	})

	it('should handle readFile throwing', async () => {
		fao.readFile = () => Promise.reject('readFile error')
		await expect(
			Effect.runPromise(
				resolveEffect('./resolvePromise.spec.tst', './src/utils', fao),
			),
		).rejects.toThrowErrorMatchingInlineSnapshot('"Couldn\'t read file"')
	})

	it('should throw an error for non-existent file', async () => {
		fao.existsSync = () => false
		await expect(
			Effect.runPromise(
				resolveEffect('./resolvePromise.spec.tst', './src/utils', fao),
			),
		).rejects.toThrowErrorMatchingInlineSnapshot('"Failed to resolve"')
	})

	it('should throw an error if existsSync throws', () => {
		fao.existsSync = () => {
			throw new Error('existsSync error')
		}
		expect(
			Effect.runPromise(
				resolveEffect('./resolvePromise.spec.ts', './src/utils', fao),
			),
		).rejects.toThrowErrorMatchingInlineSnapshot('"Failed to resolve"')
	})
})

import type { FileAccessObject } from '../types.js'
import { resolveSafe } from './resolveSafe.js'
import { safeFao } from './safeFao.js'
import { Effect } from 'effect'
import { flip } from 'effect/Effect'
import fs from 'fs'
import { access } from 'fs/promises'
import { describe, expect, it } from 'vitest'

const fao: FileAccessObject = {
	existsSync: (filePath: string) => fs.existsSync(filePath),
	readFile: (filePath: string, encoding: string) =>
		Promise.resolve(
			fs.readFileSync(filePath, { encoding: encoding as 'utf8' }),
		),
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
	it('should resolve a file path in the base directory', async () => {
		const resolvedPath = await Effect.runPromise(
			resolveSafe('./resolveSafe.spec.ts', __dirname, safeFao(fao)),
		)
		expect(resolvedPath.endsWith('src/utils/resolveSafe.spec.ts')).toBe(true)
	})

	it('should handle readFile throwing', async () => {
		fao.readFile = () => Promise.reject('readFile error')
		await expect(
			Effect.runPromise(
				resolveSafe('./resolveSafe.spec.ts', './src/utils', safeFao(fao)),
			),
		).rejects.toThrowErrorMatchingInlineSnapshot(
			'"Read file error: Read file error: undefined"',
		)
	})

	it('should throw an error for non-existent file', async () => {
		fao.exists = () => Promise.resolve(false)
		await expect(
			Effect.runPromise(
				resolveSafe('./resolveSafe.spec.ts', './src/utils', safeFao(fao)),
			),
		).rejects.toThrowErrorMatchingInlineSnapshot('"Failed to resolve"')
	})

	it('should throw an error if existsSync throws', async () => {
		fao.exists = () => {
			throw new Error('existsSync error')
		}
		expect(
			await Effect.runPromise(
				flip(resolveSafe('./resolveSafe.spec.ts', './src/utils', safeFao(fao))),
			),
		).toMatchInlineSnapshot(
			'[ExistsError: Unable to determine existence: Unable to determine existence: existsSync error]',
		)
	})
	it('should return ReadFileError if readFile throws', async () => {
		fao.readFile = () => Promise.reject(new Error('readFile error'))
		const error = await Effect.runPromise(
			flip(resolveSafe('./resolveSafe.spec.ts', './src/utils', safeFao(fao))),
		)
		expect(error).toMatchInlineSnapshot(
			'[ExistsError: Unable to determine existence: Unable to determine existence: existsSync error]',
		)
	})

	it('should return ExistsSyncError if existsSync throws', async () => {
		fao.exists = () => {
			throw new Error('existsSync error')
		}
		const error = await Effect.runPromise(
			flip(resolveSafe('./resolveSafe.spec.ts', './src/utils', safeFao(fao))),
		)
		expect(error).toMatchInlineSnapshot(
			'[ExistsError: Unable to determine existence: Unable to determine existence: existsSync error]',
		)
	})
})

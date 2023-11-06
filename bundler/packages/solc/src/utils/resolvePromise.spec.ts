import type { FileAccessObject, Logger } from '../types.js'
import { resolveEffect } from './resolvePromise.js'
import { Effect } from 'effect'
import fs from 'fs'
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest'

const fao: FileAccessObject = {
	existsSync: (filePath: string) => fs.existsSync(filePath),
	readFile: (filePath: string, encoding: string) =>
		Promise.resolve(
			fs.readFileSync(filePath, { encoding: encoding as 'utf8' }),
		),
	readFileSync: (filePath: string) => fs.readFileSync(filePath, 'utf8'),
}

let logger: Logger = {
	error: vi.fn(),
	info: vi.fn(),
	warn: vi.fn(),
	log: vi.fn(),
}

describe('resolvePromise', () => {
	beforeEach(() => {
		logger = {
			error: vi.fn(),
			info: vi.fn(),
			warn: vi.fn(),
			log: vi.fn(),
		}
	})

	it('should resolve a file path in the base directory', async () => {
		const resolvedPath = await Effect.runPromise(
			resolveEffect('./resolvePromise.spec.ts', __dirname, fao, logger),
		)
		expect(resolvedPath.endsWith('src/utils/resolvePromise.spec.ts')).toBe(true)
	})

	it('should handle readFile throwing', async () => {
		fao.readFile = () => Promise.reject('readFile error')
		await expect(
			Effect.runPromise(
				resolveEffect('./resolvePromise.spec.tst', './src/utils', fao, logger),
			),
		).rejects.toThrowErrorMatchingInlineSnapshot('"readFile error"')
		expect((logger.error as Mock).mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "readFile error",
			  ],
			  [
			    "Error reading file",
			  ],
			  [
			    "readFile error",
			  ],
			  [
			    "There was an error resolving ./resolvePromise.spec.tst",
			  ],
			  [
			    "readFile error",
			  ],
			  [
			    "Error reading file",
			  ],
			  [
			    "readFile error",
			  ],
			  [
			    "There was an error resolving ./resolvePromise.spec.tst",
			  ],
			  [
			    "readFile error",
			  ],
			  [
			    "Error reading file",
			  ],
			  [
			    "readFile error",
			  ],
			  [
			    "There was an error resolving ./resolvePromise.spec.tst",
			  ],
			  [
			    "readFile error",
			  ],
			  [
			    "Error reading file",
			  ],
			  [
			    "readFile error",
			  ],
			  [
			    "There was an error resolving ./resolvePromise.spec.tst",
			  ],
			  [
			    [Error: Cannot find module './resolvePromise.spec.tst' from './src/utils'],
			  ],
			  [
			    "There was an error resolving ./resolvePromise.spec.tst",
			  ],
			]
		`)
	})

	it('should throw an error for non-existent file', async () => {
		fao.existsSync = () => false
		await expect(
			Effect.runPromise(
				resolveEffect('./resolvePromise.spec.tst', './src/utils', fao, logger),
			),
		).rejects.toThrowErrorMatchingInlineSnapshot(
			"\"Cannot find module './resolvePromise.spec.tst' from './src/utils'\"",
		)
		expect((logger.error as Mock).mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    [Error: Cannot find module './resolvePromise.spec.tst' from './src/utils'],
			  ],
			  [
			    "There was an error resolving ./resolvePromise.spec.tst",
			  ],
			]
		`)
	})

	it('should throw an error if existsSync throws', () => {
		fao.existsSync = () => {
			throw new Error('existsSync error')
		}
		expect(
			Effect.runPromise(
				resolveEffect('./resolvePromise.spec.ts', './src/utils', fao, logger),
			),
		).rejects.toThrowErrorMatchingInlineSnapshot('"existsSync error"')
		expect(
			(logger.error as Mock).mock.calls[0].slice(0, 2),
		).toMatchInlineSnapshot(`
      [
        [Error: existsSync error],
      ]
    `)
	})
})

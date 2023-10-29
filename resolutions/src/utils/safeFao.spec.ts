import type { FileAccessObject } from '../types.js'
import { ExistsSyncError, ReadFileError, safeFao } from './safeFao.js'
import { flip, runPromise, runSync } from 'effect/Effect'
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

describe('safeFao', () => {
	it('should have same properties as the original Fao', () => {
		expect(safeFao(fao)).toHaveProperty('existsSync')
		expect(safeFao(fao)).toHaveProperty('readFile')
		expect(safeFao(fao)).toHaveProperty('readFileSync')
	})

	describe('existsSync', () => {
		it('existsSync should true if a file exists', () => {
			const sf = safeFao(fao)
			expect(runSync(sf.existsSync(__filename))).toBe(true)
		})
		it('existsSync should false if a file does not exist', () => {
			const sf = safeFao(fao)
			expect(runSync(sf.existsSync('./nonexistent'))).toBe(false)
		})
		it('should return a ExistsSyncError if existsSync throws', () => {
			const expectedCause = 'existsSync error'
			const sf = safeFao({
				...fao,
				existsSync: () => {
					throw new Error(expectedCause)
				},
			})
			const err = runSync(flip(sf.existsSync('./nonexistent')))
			expect(err).toBeInstanceOf(ExistsSyncError)
			expect(err._tag).toBe('ExistsSyncError')
			expect(err.name).toBe('ExistsSyncError')
			expect((err.cause as Error)?.message).toBe(expectedCause)
		})
	})

	describe('readFile', () => {
		it('should read a file asynchronously if the file exists', async () => {
			const sf = safeFao(fao)
			const content = await runPromise(sf.readFile(__filename, 'utf8'))
			expect(content).toBe(fs.readFileSync(__filename, 'utf8'))
		})

		it('should return a ReadFileError if readFile throws', async () => {
			const expectedCause = 'readFile error'
			const sf = safeFao({
				...fao,
				readFile: () => {
					throw new Error(expectedCause)
				},
			})
			const err = await runPromise(flip(sf.readFile('./nonexistent', 'utf8')))
			expect(err).toBeInstanceOf(ReadFileError)
			expect(err._tag).toBe('ReadFileError')
			expect(err.name).toBe('ReadFileError')
			expect((err.cause as Error)?.message).toBe(expectedCause)
		})
	})

	describe('readFileSync', () => {
		it('should read a file synchronously if the file exists', () => {
			const sf = safeFao(fao)
			const content = runSync(sf.readFileSync(__filename, 'utf8'))
			expect(content).toBe(fs.readFileSync(__filename, 'utf8'))
		})

		it('should return a ReadFileError if readFileSync throws', () => {
			const expectedCause = 'readFileSync error'
			const sf = safeFao({
				...fao,
				readFileSync: () => {
					throw new Error(expectedCause)
				},
			})
			const err = runSync(flip(sf.readFileSync('./nonexistent', 'utf8')))
			expect(err).toBeInstanceOf(ReadFileError)
			expect(err._tag).toBe('ReadFileError')
			expect(err.name).toBe('ReadFileError')
			expect((err.cause as Error)?.message).toBe(expectedCause)
		})
	})
})

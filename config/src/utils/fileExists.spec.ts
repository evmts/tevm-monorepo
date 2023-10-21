import { fileExists } from './fileExists.js'
import { runPromise } from 'effect/Effect'
import { constants } from 'fs'
import { access } from 'fs/promises'
import { type Mock, afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('fs/promises')

describe('fileExists', () => {
	afterEach(() => {
		vi.clearAllMocks()
	})

	const accessMock = access as Mock
	it('should return true if the file exists', async () => {
		accessMock.mockResolvedValueOnce(undefined)
		const result = await runPromise(fileExists('path-to-existing-file.txt'))
		expect(result).toBe(true)
		expect(access).toHaveBeenCalledWith(
			'path-to-existing-file.txt',
			constants.F_OK,
		)
	})

	it('should return false if the file does not exist', async () => {
		const mockError = new Error('File does not exist')
		accessMock.mockRejectedValueOnce(mockError)
		const result = await runPromise(fileExists('path-to-non-existing-file.txt'))
		expect(result).toBe(false)
		expect(access).toHaveBeenCalledWith(
			'path-to-non-existing-file.txt',
			constants.F_OK,
		)
	})
})

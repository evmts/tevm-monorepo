import { describe, expect, it, beforeEach } from 'vitest'
import { getCurrentTestFile } from './getCurrentTestFile.js'

const testFile = 'getCurrentTestFile.spec.ts'
// @ts-expect-error - accessing vitest internals
const originalFilePath = globalThis.__vitest_worker__?.filepath

describe('getCurrentTestFile', () => {
	beforeEach(() => {
		// @ts-expect-error - resetting vitest internals
		globalThis.__vitest_worker__.filepath = originalFilePath
	})

	it('should return correct test file name from vitest worker', () => {
		expect(getCurrentTestFile()).toBe(testFile)
	})

	it('should handle different file extensions', () => {
		// @ts-expect-error - mocking vitest internals
		globalThis.__vitest_worker__.filepath = '/path/to/integration.test.js'
		expect(getCurrentTestFile()).toBe('integration.test.js')
	})

	it('should throw error when vitest worker filepath is null', () => {
		// @ts-expect-error - mocking vitest internals with null filepath
		globalThis.__vitest_worker__.filepath = null
		expect(() => getCurrentTestFile()).toThrow('Could not find test file name from vitest worker')
	})
})
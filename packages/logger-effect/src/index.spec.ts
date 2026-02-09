import { describe, expect, it } from 'vitest'
import * as LoggerEffect from './index.js'

describe('@tevm/logger-effect exports', () => {
	describe('LoggerService', () => {
		it('should export LoggerService', () => {
			expect(LoggerEffect.LoggerService).toBeDefined()
		})
	})

	describe('Layer implementations', () => {
		it('should export LoggerLive', () => {
			expect(LoggerEffect.LoggerLive).toBeDefined()
			expect(typeof LoggerEffect.LoggerLive).toBe('function')
		})

		it('should export LoggerSilent', () => {
			expect(LoggerEffect.LoggerSilent).toBeDefined()
		})

		it('should export LoggerTest', () => {
			expect(LoggerEffect.LoggerTest).toBeDefined()
			expect(typeof LoggerEffect.LoggerTest).toBe('function')
		})
	})

	describe('Utilities', () => {
		it('should export isTestLogger', () => {
			expect(LoggerEffect.isTestLogger).toBeDefined()
			expect(typeof LoggerEffect.isTestLogger).toBe('function')
		})
	})

	describe('Complete exports list', () => {
		it('should export all expected items', () => {
			const expectedExports = ['LoggerService', 'LoggerLive', 'LoggerSilent', 'LoggerTest', 'isTestLogger']

			expectedExports.forEach((exportName) => {
				expect(LoggerEffect).toHaveProperty(exportName)
			})
		})
	})
})

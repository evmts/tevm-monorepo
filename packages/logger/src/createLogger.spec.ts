import { describe, expect, it } from 'vitest'
import { createLogger } from './createLogger.js'

describe(createLogger.name, () => {
	it('should create a logger', () => {
		const logger = createLogger({
			name: 'testLogger',
			level: 'fatal',
		})
		expect(logger).toBeDefined()
		expect(logger.level).toBe('fatal')
	})
})

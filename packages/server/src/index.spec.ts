import { describe, expect, it } from 'vitest'
import * as indexExports from './index.js'

describe('index exports', () => {
	it('should export createHttpHandler', () => {
		expect(indexExports.createHttpHandler).toBeDefined()
	})

	it('should export createServer', () => {
		expect(indexExports.createServer).toBeDefined()
	})

	it('should export adapters', () => {
		expect(indexExports.createExpressMiddleware).toBeDefined()
		expect(indexExports.createNextApiHandler).toBeDefined()
	})

	it('should export errors', () => {
		expect(indexExports.InvalidJsonError).toBeDefined()
		expect(indexExports.ReadRequestBodyError).toBeDefined()
	})
})

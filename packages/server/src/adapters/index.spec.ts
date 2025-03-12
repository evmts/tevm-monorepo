import { describe, expect, it } from 'vitest'
import * as adapterExports from './index.js'

describe('adapters/index exports', () => {
	it('should export createExpressMiddleware', () => {
		expect(adapterExports.createExpressMiddleware).toBeDefined()
	})

	it('should export createNextApiHandler', () => {
		expect(adapterExports.createNextApiHandler).toBeDefined()
	})
})

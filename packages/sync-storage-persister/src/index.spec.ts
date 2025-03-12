import { describe, expect, it } from 'vitest'
import * as exports from './index.js'

describe('index exports', () => {
	it('should export the expected functions and types', () => {
		expect(exports).toHaveProperty('createSyncStoragePersister')
		expect(exports).toHaveProperty('noopPersister')
	})
})

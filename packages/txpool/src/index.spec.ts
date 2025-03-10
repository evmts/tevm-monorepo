import { describe, expect, it } from 'vitest'
import { TxPool } from './TxPool.js'
import * as index from './index.js'

describe('index', () => {
	it('should export TxPool', () => {
		expect(index.TxPool).toBe(TxPool)
	})
})

import { describe, expect, it } from 'vitest'
import * as index from './index.js'
import { TxPool } from './TxPool.js'

describe('index', () => {
	it('should export TxPool', () => {
		expect(index.TxPool).toBe(TxPool)
	})
})

import { hexToBytes } from 'ethereum-cryptography/utils'
import { describe, expect, it } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { hasStateRoot } from './hasStateRoot.js'

describe(hasStateRoot.name, () => {
	it('should return true if it has the state root', async () => {
		const baseState = createBaseState({
			loggingLevel: 'warn',
		})
		expect(await hasStateRoot(baseState)(hexToBytes(baseState.getCurrentStateRoot()))).toEqual(true)
	})
	it('should work even if uint8array object reference is different', async () => {
		const baseState = createBaseState({
			loggingLevel: 'warn',
		})
		expect(await hasStateRoot(baseState)(Uint8Array.from(hexToBytes(baseState.getCurrentStateRoot())))).toEqual(true)
	})
	it('should return false if it does not have the state root', async () => {
		const baseState = createBaseState({
			loggingLevel: 'warn',
		})
		expect(await hasStateRoot(baseState)(Uint8Array.from([1, 2, 3]))).toEqual(false)
	})
})

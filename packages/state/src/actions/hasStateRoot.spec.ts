import { describe, expect, it } from 'bun:test'
import { createBaseState } from '../createBaseState.js'
import { hasStateRoot } from './hasStateRoot.js'

describe(hasStateRoot.name, () => {
	it('should return true if it has the state root', async () => {
		const baseState = createBaseState()
		expect(await hasStateRoot(baseState)(baseState._currentStateRoot)).toEqual(true)
	})
	it('should return false if it does not have the state root', async () => {
		const baseState = createBaseState()
		expect(await hasStateRoot(baseState)(Uint8Array.from([1, 2, 3]))).toEqual(false)
	})
})

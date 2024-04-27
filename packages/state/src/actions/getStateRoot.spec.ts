import { describe, expect, it } from 'bun:test'
import { createBaseState } from '../createBaseState.js'
import { getStateRoot } from './getStateRoot.js'

describe(getStateRoot.name, () => {
	it('should return the current state root as bytes', async () => {
		const baseState = createBaseState()
		expect(await getStateRoot(baseState)()).toEqual(baseState._currentStateRoot)
	})
})

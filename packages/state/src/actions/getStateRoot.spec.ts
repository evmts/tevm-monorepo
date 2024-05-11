import { describe, expect, it } from 'bun:test'
import { hexToBytes } from 'viem'
import { createBaseState } from '../createBaseState.js'
import { getStateRoot } from './getStateRoot.js'

describe(getStateRoot.name, () => {
	it('should return the current state root as bytes', async () => {
		const baseState = createBaseState({
			loggingLevel: 'warn',
		})
		expect(await getStateRoot(baseState)()).toEqual(hexToBytes(baseState.getCurrentStateRoot()))
	})
})

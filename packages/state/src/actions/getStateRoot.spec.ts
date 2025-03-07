import { hexToBytes } from 'viem'
import { describe, expect, it } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { getStateRoot } from './getStateRoot.js'

describe(getStateRoot.name, () => {
	it('should return the current state root as bytes', async () => {
		const baseState = createBaseState({
			loggingLevel: 'warn',
		})
		expect(await getStateRoot(baseState)()).toMatchSnapshot()
	})
})

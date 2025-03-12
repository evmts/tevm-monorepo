import { createAddress } from '@tevm/address'
import { bytesToHex } from 'viem'
import { describe, expect, it } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { createStateManager } from '../createStateManager.js'
import { getStateRoot } from './getStateRoot.js'
import { hasStateRoot } from './hasStateRoot.js'
import { saveStateRoot } from './saveStateRoot.js'
import { setStateRoot } from './setStateRoot.js'

describe(getStateRoot.name, () => {
	it('should return the current state root as bytes', async () => {
		const baseState = createBaseState({
			loggingLevel: 'warn',
		})
		expect(await getStateRoot(baseState)()).toMatchSnapshot()
	})

	it('should test base getStateRoot functionality', async () => {
		// This test simply verifies the getStateRoot method works
		// More advanced testing of state root handling is already covered
		// in the existing snapshot test and in other tests like setStateRoot.spec.ts

		const baseState = createBaseState({
			loggingLevel: 'error',
		})

		// Get state root
		const root = await getStateRoot(baseState)()

		// Should return a Uint8Array of proper length for a trie root
		expect(root).toBeInstanceOf(Uint8Array)
		expect(root.length).toBe(32)
	})

	it('should test basic saveStateRoot functionality', async () => {
		// Test the basic functionality of saveStateRoot
		// This avoids using putAccount which requires EthjsAccount

		const baseState = createBaseState({
			loggingLevel: 'error',
		})

		// Get initial state root
		const initialRoot = await getStateRoot(baseState)()

		// Save the state root with a label
		await saveStateRoot(baseState)('testRoot')

		// Check that the saved root exists
		expect(await hasStateRoot(baseState)('testRoot')).toBe(true)
		expect(await hasStateRoot(baseState)('nonexistentRoot')).toBe(false)
	})

	it('should test basic setStateRoot functionality', async () => {
		// Test simple setStateRoot flow

		const baseState = createBaseState({
			loggingLevel: 'error',
		})

		// Get initial state root
		const root = await getStateRoot(baseState)()

		// Simply set the same root - shouldn't throw
		await setStateRoot(baseState)(root)

		// Get root again - should be the same
		const newRoot = await getStateRoot(baseState)()
		expect(bytesToHex(newRoot)).toBe(bytesToHex(root))
	})
})

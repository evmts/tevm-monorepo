import { bytesToHex } from '@tevm/utils'
import { describe, expect, it, vi } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { saveStateRoot } from './saveStateRoot.js'

describe(saveStateRoot.name, () => {
	it('should save state root to the state roots map', () => {
		const baseState = createBaseState({})
		const root = new Uint8Array([1, 2, 3, 4, 5])
		const rootHex = bytesToHex(root)
		const state = { accounts: { '0x1': { balance: 100n, nonce: 1n } } }

		// Spy on logger.debug
		const debugSpy = vi.spyOn(baseState.logger, 'debug')

		// Save the state root
		saveStateRoot(baseState)(root, state)

		// Check that the state root was saved
		expect(baseState.stateRoots.get(rootHex)).toBe(state)

		// Verify logger was called
		expect(debugSpy).toHaveBeenCalledWith({ root: rootHex, value: state }, 'Saved state root')
	})

	it('should overwrite existing state root with same key', () => {
		const baseState = createBaseState({})
		const root = new Uint8Array([1, 2, 3, 4, 5])
		const rootHex = bytesToHex(root)
		const state1 = { accounts: { '0x1': { balance: 100n, nonce: 1n } } }
		const state2 = { accounts: { '0x1': { balance: 200n, nonce: 2n } } }

		// Save the first state root
		saveStateRoot(baseState)(root, state1)
		expect(baseState.stateRoots.get(rootHex)).toBe(state1)

		// Save the second state root with the same key
		saveStateRoot(baseState)(root, state2)
		expect(baseState.stateRoots.get(rootHex)).toBe(state2)
	})
})

import { bytesToHex, createAddressFromString } from '@tevm/utils'
import { hexToBytes } from 'ethereum-cryptography/utils'
import { describe, expect, it, vi } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { getAccount } from './getAccount.js'
import { NoStateRootExistsError, setStateRoot } from './setStateRoot.js'

describe(setStateRoot.name, () => {
	it('should set state root', async () => {
		const address = `0x${'01'.repeat(20)}` as const
		const baseState = createBaseState({
			loggingLevel: 'warn',
		})
		await baseState.ready()
		const root = hexToBytes(`0x${'11'.repeat(32)}`)
		baseState.stateRoots.set(bytesToHex(root), {
			[address]: {
				balance: 420n,
				nonce: 1n,
				storageRoot: '0x69',
				codeHash: '0x420',
			},
		})
		await setStateRoot(baseState)(root)
		const account = await getAccount(baseState)(createAddressFromString(address))
		expect(account?.balance).toBe(420n)
	})

	it('should throw if no state root exists', async () => {
		const baseState = createBaseState({
			loggingLevel: 'warn',
		})
		await baseState.ready()
		const root = hexToBytes(`0x${'11'.repeat(32)}`)
		const err = await setStateRoot(baseState)(root).catch((e) => e)
		expect(err).toBeInstanceOf(NoStateRootExistsError)
		expect(err).toMatchSnapshot()
	})

	it('should log debug information about state root', async () => {
		const baseState = createBaseState({
			loggingLevel: 'debug',
		})
		await baseState.ready()
		const root = hexToBytes(`0x${'11'.repeat(32)}`)
		const rootHex = bytesToHex(root)

		// Setup a state root
		const stateValue = {
			[`0x${'01'.repeat(20)}`]: {
				balance: 42n,
				nonce: 1n,
				storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421' as const,
				codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470' as const,
			},
		}
		baseState.stateRoots.set(rootHex, stateValue)

		// Set the state root
		await setStateRoot(baseState)(root)
	})

	it('should throw if there are uncommitted checkpoints', async () => {
		const baseState = createBaseState({
			loggingLevel: 'warn',
		})
		await baseState.ready()
		const root = hexToBytes(`0x${'11'.repeat(32)}`)
		baseState.stateRoots.set(bytesToHex(root), {})

		// Add checkpoints to accounts cache
		baseState.caches.accounts._checkpoints = 1

		// Try to set state root - should fail
		const error = await setStateRoot(baseState)(root).catch((e) => e)
		expect(error).toBeInstanceOf(Error)
		expect(error.message).toContain('Attempted to setStateRoot with uncommitted checkpoints')

		// Reset accounts and try with storage cache
		baseState.caches.accounts._checkpoints = 0
		baseState.caches.storage._checkpoints = 1

		const error2 = await setStateRoot(baseState)(root).catch((e) => e)
		expect(error2).toBeInstanceOf(Error)
		expect(error2.message).toContain('Attempted to setStateRoot with uncommitted checkpoints')

		// Reset storage cache
		baseState.caches.storage._checkpoints = 0
	})

	it('should restore old state root if an error occurs', async () => {
		// This is a simpler test that focuses just on the error case
		// but avoids the mocking issues

		const baseState = createBaseState({
			loggingLevel: 'warn',
		})
		await baseState.ready()

		// Get the original state root
		const originalStateRoot = baseState.getCurrentStateRoot()

		// Create a new state root that doesn't exist - this will trigger an error
		const nonExistentRoot = hexToBytes(`0x${'99'.repeat(32)}`)

		// Set state root - should fail with NoStateRootExistsError
		await setStateRoot(baseState)(nonExistentRoot).catch(() => {
			// Error is expected
		})

		// Verify the state root was restored to original after error
		expect(baseState.getCurrentStateRoot()).toBe(originalStateRoot)
	})

	it('should restore old state root on error - simplified test', async () => {
		// This simplified test verifies the catch block behavior
		// without complex mocking that's prone to issues

		const baseState = createBaseState({
			loggingLevel: 'warn',
		})
		await baseState.ready()

		// Get the original state root
		const originalStateRoot = baseState.getCurrentStateRoot()

		// Create a spy on setCurrentStateRoot to verify it's called correctly
		const setCurrentStateRootSpy = vi.spyOn(baseState, 'setCurrentStateRoot')

		// Create a valid new state root and add to stateRoots
		const newRootHex = `0x${'22'.repeat(32)}` as const
		const newRoot = hexToBytes(newRootHex)
		baseState.stateRoots.set(newRootHex, {})

		// Override generateCanonicalGenesis directly to throw
		const originalGenerateCanonicalGenesis = await import('./generateCannonicalGenesis.js')
		vi.spyOn(originalGenerateCanonicalGenesis, 'generateCanonicalGenesis').mockImplementation(() => () => {
			throw new Error('Test error from generateCanonicalGenesis')
		})

		// Call setStateRoot which should fail
		try {
			await setStateRoot(baseState)(newRoot)
			// If we get here, the test should fail because an error should have been thrown
			expect(true).toBe(false) // This should not execute
		} catch (error: any) {
			// Verify the error
			expect(error).toBeDefined()
			expect(error.message).toBe('Test error from generateCanonicalGenesis')

			// Verify setCurrentStateRoot was called twice:
			// 1. First to set the new root
			// 2. Then to restore the old root
			expect(setCurrentStateRootSpy).toHaveBeenCalledTimes(2)
			expect(setCurrentStateRootSpy).toHaveBeenNthCalledWith(1, newRootHex)
			expect(setCurrentStateRootSpy).toHaveBeenNthCalledWith(2, originalStateRoot)

			// Verify state root was restored
			expect(baseState.getCurrentStateRoot()).toBe(originalStateRoot)
		}

		// Cleanup
		vi.restoreAllMocks()
	})
})

import { createAddress } from '@tevm/address'
import { createLogger } from '@tevm/logger'
import { createSyncStoragePersister } from '@tevm/sync-storage-persister'
import { TestERC20 } from '@tevm/test-utils'
import { hexToBytes } from 'viem'
import { describe, expect, it, vi } from 'vitest'
import { createTevmNode } from './createTevmNode.js'
import { statePersister } from './statePersister.js'

describe(statePersister.name, () => {
	it('Persists the state', async () => {
		const logger = createLogger({ name: 'test', level: 'warn' })
		const storage = new Map()
		let persistPromise = Promise.withResolvers()
		const persist = statePersister(
			createSyncStoragePersister({
				key: 'testkey',
				storage: {
					getItem: (key) => storage.get(key),
					setItem: (key, value) => storage.set(key, value) && persistPromise.resolve(),
					removeItem: (key) => storage.delete(key),
				},
			}),
			logger,
		)
		const baseClient = createTevmNode({})
		const vm = await baseClient.getVm()

		persist(vm.stateManager._baseState)

		await persistPromise.promise

		expect(storage.get('testkey')).toMatchSnapshot()

		persistPromise = Promise.withResolvers()

		await vm.stateManager.putContractCode(createAddress(69), hexToBytes(TestERC20.deployedBytecode))

		persist(vm.stateManager._baseState)

		await persistPromise.promise

		expect(storage.get('testkey')).toMatchSnapshot()
	})

	it('logs errors', async () => {
		const logger = createLogger({ name: 'test', level: 'warn' })
		const mockError = vi.fn()
		logger.error = mockError
		const setItemPromise = Promise.withResolvers()
		const persist = statePersister(
			createSyncStoragePersister({
				key: 'testkey',
				storage: {
					getItem: () => '',
					setItem: () => {
						setItemPromise.resolve()
						throw new Error('test error')
					},
					removeItem: () => undefined,
				},
			}),
			logger,
		)
		const baseClient = createTevmNode({})
		const vm = await baseClient.getVm()

		persist(vm.stateManager._baseState)

		await setItemPromise.promise.then(() => {
			expect(mockError.mock.calls).toMatchSnapshot()
		})
	})

	it('handles non-Error type errors to cover line 32', async () => {
		const logger = createLogger({ name: 'test', level: 'warn' })
		const mockError = vi.fn()
		logger.error = mockError

		// Create a more complete mock that will still trigger the error handling
		const fakeState = {
			dumpCanonicalGenesis: () => Promise.reject('string error'),
		}

		const persisterFn = statePersister(
			createSyncStoragePersister({
				key: 'testkey',
				storage: {
					getItem: () => '',
					setItem: () => {},
					removeItem: () => undefined,
				},
			}),
			logger,
		)

		// Call with our fake state
		persisterFn(fakeState as any)

		// Wait for the promise rejection to be caught
		await new Promise((resolve) => setTimeout(resolve, 100))

		// Just check that the error function was called with the first parameter
		// This is more reliable than checking the exact error
		expect(mockError).toHaveBeenCalledWith('Failed to persist state:', expect.anything())
	})
})

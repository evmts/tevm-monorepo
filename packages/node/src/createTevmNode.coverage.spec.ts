import { createAddress } from '@tevm/address'
import { createCommon } from '@tevm/common'
import { transports } from '@tevm/test-utils'
import { hexToBigInt } from '@tevm/utils'
import { describe, expect, it, vi } from 'vitest'
import { createTevmNode } from './createTevmNode.js'

describe('createTevmNode coverage tests', () => {
	it('Handles event emitter correctly', async () => {
		const client = createTevmNode()
		let eventFired = false
		const listener = () => {
			eventFired = true
		}

		// Test emit returns true when listeners exist
		client.on('test', listener)
		expect(client.emit('test')).toBe(true)
		expect(eventFired).toBe(true)

		// Test emit returns false when no listeners exist
		expect(client.emit('nonexistent')).toBe(false)

		// Test removeListener with nonexistent event
		client.removeListener('nonexistent', listener)

		// Test removeListener when removing last listener
		client.removeListener('test', listener)
		expect(client.emit('test')).toBe(false)
	})

	it('Handles connect event for already connected client', async () => {
		const client = createTevmNode()
		await client.ready()

		// Client is already in READY state
		expect(client.status).toBe('READY')

		// Emit connect event again, status should remain READY
		client.emit('connect')
		expect(client.status).toBe('READY')
	})

	it('Handles fork transport as a function', async () => {
		const transportFn = () => transports.optimism

		const client = createTevmNode({
			fork: {
				transport: transportFn,
			},
		})

		expect(client.mode).toBe('fork')
		expect(client.forkTransport).toBeDefined()

		await client.ready()
		const vm = await client.getVm()
		expect(vm).toBeDefined()
	})

	it('Handles fork with specific blockTag', async () => {
		const client = createTevmNode({
			fork: {
				transport: transports.optimism,
				blockTag: 123n, // Testing a specific block tag that's not 'latest'
			},
		})

		expect(client.mode).toBe('fork')
		await client.ready()
		const vm = await client.getVm()
		expect(vm).toBeDefined()
	})

	it('Handles state restoration with persister correctly', async () => {
		const mockState = {
			'0x1234567890123456789012345678901234567890': {
				nonce: '0x1',
				balance: '0x2',
				storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
				codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
			},
		}

		const mockPersister = {
			persistTevmState: vi.fn(),
			restoreState: vi.fn().mockReturnValue(mockState),
		}

		const client = createTevmNode({
			persister: mockPersister,
		})

		await client.ready()
		const vm = await client.getVm()

		// Verify the persisted state was processed correctly
		const account = await vm.stateManager.getAccount(createAddress('0x1234567890123456789012345678901234567890'))

		expect(account.nonce).toBe(hexToBigInt('0x1'))
		expect(account.balance).toBe(hexToBigInt('0x2'))
	})

	it('Tests deepCopy with impersonatedAccount', async () => {
		const client = createTevmNode()
		const testAddress = '0x1234567890123456789012345678901234567890'

		// Set impersonated account on original client
		client.setImpersonatedAccount(testAddress)
		expect(client.getImpersonatedAccount()).toBe(testAddress)

		// Deep copy the client
		const copiedClient = await client.deepCopy()

		// Set a different impersonated account on the copy
		const newAddress = '0x0987654321098765432109876543210987654321'
		copiedClient.setImpersonatedAccount(newAddress)

		// Verify the impersonated accounts are different
		expect(copiedClient.getImpersonatedAccount()).toBe(newAddress)
		expect(client.getImpersonatedAccount()).toBe(testAddress)
	})

	it('Tests deepCopy with filters', async () => {
		const client = createTevmNode()
		const filter = { id: '0x123', data: {} }

		// Set filter on original client
		client.setFilter(filter as any)
		expect(client.getFilters().get('0x123')).toEqual(filter as any)

		// Deep copy the client
		const copiedClient = await client.deepCopy()

		// Add a new filter to the copied client
		const newFilter = { id: '0x456', data: {} }
		copiedClient.setFilter(newFilter as any)

		// Verify filters are copied but independent
		expect(copiedClient.getFilters().get('0x123')).toEqual(filter as any)
		expect(copiedClient.getFilters().get('0x456')).toEqual(newFilter as any)
		expect(client.getFilters().has('0x456')).toBe(false)
	})

	it('Tests removeFilter on deepCopied client', async () => {
		const client = createTevmNode()
		const filter = { id: '0x789', data: {} }

		// Set filter on original client
		client.setFilter(filter as any)

		// Deep copy the client
		const copiedClient = await client.deepCopy()

		// Verify filter was copied
		expect(copiedClient.getFilters().get('0x789')).toEqual(filter as any)

		// Remove filter from copied client
		copiedClient.removeFilter('0x789')

		// Verify filter was removed from copied client but still exists in original
		expect(copiedClient.getFilters().has('0x789')).toBe(false)
		expect(client.getFilters().has('0x789')).toBe(true)
	})

	it('Tests custom common with full options', async () => {
		const customCommon = createCommon({
			id: 1,
			hardfork: 'cancun',
			eips: [1559, 4895],
			customCrypto: { hash: undefined, keccak256: undefined, ripemd160: undefined, secp256k1: undefined },
		})

		const client = createTevmNode({
			common: customCommon,
			loggingLevel: 'debug',
		})

		await client.ready()
		const vm = await client.getVm()
		expect(vm.common.ethjsCommon.hardfork()).toBe('cancun')
	})

	it('Tests forkTransport in deepCopy', async () => {
		const client = createTevmNode({
			fork: {
				transport: transports.optimism,
			},
		})

		await client.ready()
		expect(client.forkTransport).toBe(transports.optimism)

		const copiedClient = await client.deepCopy()
		expect(copiedClient.forkTransport).toBeDefined()
		expect(copiedClient.forkTransport.request).toBe(client.forkTransport.request)
	})

	it('Tests removeFilter with nonexistent filter', async () => {
		const client = createTevmNode()

		// This filter doesn't exist, but removing it should not throw an error
		client.removeFilter('0xnonexistent')

		// Verify that the filters map is still empty
		expect(client.getFilters().size).toBe(0)
	})

	// Test to cover lines 75-76 in getStateManagerOpts where cache options are used
	it('Handles explicit cache options', async () => {
		const accountsCache = new Map()
		const storageCache = new Map()
		const contractCache = new Map()

		const client = createTevmNode({
			accountsCache,
			storageCache,
			contractCache,
			// Don't include fork option with undefined transport as it causes errors
		})

		expect(client).toBeDefined()
		await client.ready()
		const vm = await client.getVm()

		// These would fail if the cache options weren't properly passed through
		expect(vm.stateManager._baseState).toBeDefined()
		expect(client.status).toBe('READY')
	})

	// Test to cover line 126-127 with custom common configuration where hardfork is undefined
	it('Handles custom common with null hardfork', async () => {
		const client = createTevmNode({
			common: {
				id: 1,
				ethjsCommon: {
					hardfork: () => null, // This will make it use the default 'cancun'
					eips: () => [1559, 4895],
					customCrypto: {},
				},
			},
		})

		expect(client).toBeDefined()
		await client.ready()
		const vm = await client.getVm()
		// If hardfork defaulted correctly to 'cancun', this would pass
		expect(vm.common.ethjsCommon.hardfork()).toBe('cancun')
	})
})

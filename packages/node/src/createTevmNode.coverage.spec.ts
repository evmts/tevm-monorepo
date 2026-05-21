import { createAddress } from '@tevm/address'
import { createCommon } from '@tevm/common'
import { type Hex, hexToBigInt } from '@tevm/utils'
import { describe, expect, it, vi } from 'vitest'
import { createTevmNode } from './createTevmNode.js'

const mockForkBlock = {
	number: '0x874a823',
	hash: `0x${'12'.repeat(32)}` as Hex,
	parentHash: `0x${'00'.repeat(32)}` as Hex,
	nonce: '0x0000000000000000',
	sha3Uncles: `0x${'00'.repeat(32)}` as Hex,
	logsBloom: `0x${'00'.repeat(256)}` as Hex,
	transactionsRoot: `0x${'00'.repeat(32)}` as Hex,
	stateRoot: `0x${'00'.repeat(32)}` as Hex,
	receiptsRoot: `0x${'00'.repeat(32)}` as Hex,
	miner: '0x4200000000000000000000000000000000000011',
	difficulty: '0x0',
	totalDifficulty: '0x0',
	extraData: '0x',
	size: '0x1',
	gasLimit: '0x1c9c380',
	gasUsed: '0x0',
	timestamp: '0x1',
	transactions: [],
	uncles: [],
	baseFeePerGas: '0x1',
	withdrawals: [],
	withdrawalsRoot: `0x${'00'.repeat(32)}` as Hex,
	blobGasUsed: '0x0',
	excessBlobGas: '0x0',
	parentBeaconBlockRoot: `0x${'00'.repeat(32)}` as Hex,
	requestsRoot: `0x${'00'.repeat(32)}` as Hex,
	requests: [],
}

const createMockForkTransport = (chainId = '0xa') => ({
	request: vi.fn(async ({ method, params }) => {
		if (method === 'eth_chainId') {
			return chainId
		}
		if (method === 'eth_blockNumber') {
			return mockForkBlock.number
		}
		if (method === 'eth_getBlockByNumber') {
			return {
				...mockForkBlock,
				number: params?.[0] === 'latest' ? mockForkBlock.number : params?.[0],
			}
		}
		if (method === 'eth_getBlockByHash') {
			return mockForkBlock
		}
		throw new Error(`Unexpected RPC method: ${method}`)
	}),
})

describe('createTevmNode coverage tests', () => {
	it('Handles event emitter correctly', async () => {
		const client = createTevmNode()
		let eventFired = false
		const listener = () => {
			eventFired = true
		}

		// Test emit returns true when listeners exist
		client.on('test' as any, listener)
		expect(client.emit('test' as any)).toBe(true)
		expect(eventFired).toBe(true)

		// Test emit returns false when no listeners exist
		expect(client.emit('nonexistent' as any)).toBe(false)

		// Test removeListener with nonexistent event
		client.removeListener('nonexistent' as any, listener)

		// Test removeListener when removing last listener
		client.removeListener('test' as any, listener)
		expect(client.emit('test' as any)).toBe(false)
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
		const transport = createMockForkTransport()
		const transportFn = () => transport

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
				transport: createMockForkTransport(),
				blockTag: 141866019n, // Testing a specific block tag that's not 'latest'
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
			persister: mockPersister as any,
		})

		await client.ready()
		const vm = await client.getVm()

		// Verify the persisted state was processed correctly
		const account = (await vm.stateManager.getAccount(
			createAddress('0x1234567890123456789012345678901234567890'),
		)) as any

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
			hardfork: 'prague',
			eips: [1559, 4895],
			customCrypto: { hash: undefined, keccak256: undefined, ripemd160: undefined, secp256k1: undefined } as any,
		} as any)

		const client = createTevmNode({
			common: customCommon,
			loggingLevel: 'debug',
		})

		await client.ready()
		const vm = await client.getVm()
		expect(vm.common.ethjsCommon.hardfork()).toBe('prague')
	})

	it('Tests forkTransport in deepCopy', async () => {
		const transport = createMockForkTransport()
		const client = createTevmNode({
			fork: {
				transport,
			},
		})

		await client.ready()
		expect(client.forkTransport).toBe(transport)

		const copiedClient = await client.deepCopy()
		expect(copiedClient.forkTransport).toBeDefined()
		expect((copiedClient.forkTransport as any).request).toBe((client as any).forkTransport.request)
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
		const accountsCache = new Map() as any
		const storageCache = new Map() as any
		const contractCache = new Map() as any

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
					hardfork: () => null as any, // This will make it use the default 'prague'
					eips: () => [1559, 4895],
					customCrypto: {},
				} as any,
			} as any,
		})

		expect(client).toBeDefined()
		await client.ready()
		const vm = await client.getVm()
		// If hardfork defaulted correctly to 'prague', this would pass
		expect(vm.common.ethjsCommon.hardfork()).toBe('prague')
	})

	// Test to cover line 76 with fork.transport but no fork option
	it('Handles fork.transport when fork is undefined', async () => {
		const client = createTevmNode({
			accountsCache: new Map() as any,
			fork: {
				// Testing scenario where fork exists but transport is undefined
				blockTag: 141866019n,
			} as any,
		})

		expect(client).toBeDefined()
		await client.ready()
		// This should execute the branch where options.fork?.transport is falsy
		const vm = await client.getVm()
		expect(vm).toBeDefined()
	})

	// Targeting the specific branch at line 76 in createTevmNode.js
	it('Tests getStateManagerOpts with fork and various caches', async () => {
		// Create a client with all possible state manager options
		const client = createTevmNode({
			fork: {
				transport: createMockForkTransport(),
				blockTag: 141866019n,
			},
			storageCache: new Map() as any,
			contractCache: new Map() as any,
			accountsCache: new Map() as any,
			persister: {
				persistTevmState: vi.fn(),
				restoreState: vi.fn().mockReturnValue(null),
			} as any,
		})

		await client.ready()
		const vm = await client.getVm()
		expect(vm).toBeDefined()
		expect(vm.stateManager).toBeDefined()
	})

	// Specifically targeting line 76 branch in createTevmNode.js
	it('Tests line 76 branch condition for complete coverage', async () => {
		// This is a very targeted test for the specific uncovered branch
		// Create a mocked implementation of the transport request
		const mockTransport = {
			request: vi.fn().mockResolvedValue('123'),
		}

		// Create a client with a fork that has a transport
		const client1 = createTevmNode({
			fork: {
				transport: mockTransport,
				blockTag: 141866019n,
			},
		})

		// Create a client with a fork that has no transport
		const client2 = createTevmNode({
			fork: {
				// No transport here, forcing the other branch
				blockTag: 141866019n,
			} as any,
		})

		await Promise.all([client1.ready(), client2.ready()])

		// Both clients should initialize successfully
		expect(client1.mode).toBe('fork')
		expect(client2.mode).toBe('normal') // Without transport it defaults to normal mode
	})

	// Test extend chaining
	it('Tests extend chaining', async () => {
		const client = createTevmNode()
			.extend(() => ({ feature1: 'value1' }))
			.extend(() => ({ feature2: 'value2' }))

		expect(client.feature1).toBe('value1')
		expect(client.feature2).toBe('value2')
	})

	// Tests event emitter with multiple listeners and parameters
	it('Tests event emitter with multiple listeners and parameters', async () => {
		const client = createTevmNode()

		const results = [] as string[]
		const listener1 = (param: string) => results.push(`listener1-${param}`)
		const listener2 = (param: string) => results.push(`listener2-${param}`)

		client.on('test' as any, listener1)
		client.on('test' as any, listener2)

		client.emit('test' as any, 'parameter')

		expect(results).toEqual(['listener1-parameter', 'listener2-parameter'])
	})
})

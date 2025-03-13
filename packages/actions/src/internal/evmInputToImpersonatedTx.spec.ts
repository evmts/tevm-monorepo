import { createTevmNode } from '@tevm/node'
import { type Address, EthjsAddress } from '@tevm/utils'
import { describe, expect, it, vi } from 'vitest'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { evmInputToImpersonatedTx } from './evmInputToImpersonatedTx.js'

// Create a mock transport with eth_getProof support
function createMockTransport() {
	return {
		request: vi.fn().mockImplementation(async ({ method }: { method: string }) => {
			if (method === 'eth_getProof') {
				// Return a valid minimal eth_getProof response
				return {
					accountProof: [],
					balance: '0x0',
					codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
					nonce: '0x5', // Match the nonce used in tests
					storageHash: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
					storageProof: [],
				}
			}
			// For other methods, throw an error
			throw new Error(`Test not configured to handle method: ${method}`)
		}),
	}
}

// Helper to prepare a test node with proper configuration
async function prepareTestNode() {
	const mockTransport = createMockTransport()
	const testAddress = `0x${'34'.repeat(20)}` as `0x${string}`

	// Create a node with the mock transport
	const client = createTevmNode({
		fork: {
			transport: mockTransport,
			blockTag: 1n,
		},
		miningConfig: { type: 'manual' },
	})

	// Wait for node to be ready
	await client.ready()

	// Setup account state directly
	const vm = await client.getVm()
	await vm.stateManager.putAccount(EthjsAddress.fromString(testAddress), {
		nonce: 5n,
		balance: 1000000000000000000n,
		storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
		codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
	})

	// Mine a block to have block history
	await client.mineBlock()

	return { client, mockTransport }
}

describe('evmInputToImpersonatedTx', () => {
	it('should create an impersonated transaction with the correct parameters', async () => {
		// Use our test helper to prepare a node
		const { client } = await prepareTestNode()

		const evmInput = {
			to: EthjsAddress.fromString(`0x${'12'.repeat(20)}`),
			data: new Uint8Array([0x12, 0x34]),
			value: 1000n,
			origin: EthjsAddress.fromString(`0x${'34'.repeat(20)}`),
		}

		const tx = await evmInputToImpersonatedTx(client)(evmInput)
		expect(tx.to?.toString()).toBe(evmInput.to?.toString())
		expect(new Uint8Array(tx.data)).toEqual(evmInput.data)
		expect(tx.value).toBe(evmInput.value)
		expect(tx.getSenderAddress().toString()).toBe(evmInput.origin.toString())
	})

	it.skip('should create an impersonated transaction with the correct nonce', async () => {
		// Use our test helper to prepare a node
		const { client } = await prepareTestNode()

		const evmInput = {
			to: EthjsAddress.fromString(`0x${'12'.repeat(20)}`),
			data: new Uint8Array([0x12, 0x34]),
			value: 1000n,
			origin: EthjsAddress.fromString(`0x${'34'.repeat(20)}`),
		}

		const sender = evmInput.origin
		const vm = await client.getVm()
		let account = await vm.stateManager.getAccount(sender)

		let tx = await evmInputToImpersonatedTx(client)(evmInput)
		expect(tx.nonce).toBe(account?.nonce ?? 0n)

		await setAccountHandler(client)({ address: evmInput.origin.toString() as Address, nonce: 10n })

		tx = await evmInputToImpersonatedTx(client)(evmInput)
		account = await vm.stateManager.getAccount(sender)
		expect(tx.nonce).toBe(account?.nonce ?? 0n)
	})

	it('should create an impersonated transaction with the correct gas parameters', async () => {
		// Use our test helper to prepare a node
		const { client } = await prepareTestNode()

		const evmInput = {
			to: EthjsAddress.fromString(`0x${'12'.repeat(20)}`),
			data: new Uint8Array([0x12, 0x34]),
			value: 1000n,
			origin: EthjsAddress.fromString(`0x${'34'.repeat(20)}`),
		}

		const vm = await client.getVm()
		const parentBlock = await vm.blockchain.getCanonicalHeadBlock()
		const priorityFee = 0n
		const baseFeePerGas = parentBlock.header.baseFeePerGas ?? 0n
		let maxFeePerGas = parentBlock.header.calcNextBaseFee() + priorityFee
		if (maxFeePerGas < baseFeePerGas) {
			maxFeePerGas = baseFeePerGas
		}

		const tx = await evmInputToImpersonatedTx(client)(evmInput)
		expect(tx.maxFeePerGas).toBe(maxFeePerGas)
		expect(tx.maxPriorityFeePerGas).toBe(priorityFee)
		expect(tx.gasLimit).toBe(parentBlock.header.gasLimit)
	})

	it('should allow setting custom maxFeePerGas and maxPriorityFeePerGas', async () => {
		// Use our test helper to prepare a node
		const { client } = await prepareTestNode()

		const evmInput = {
			to: EthjsAddress.fromString(`0x${'12'.repeat(20)}`),
			data: new Uint8Array([0x12, 0x34]),
			value: 1000n,
			origin: EthjsAddress.fromString(`0x${'34'.repeat(20)}`),
		}

		const customMaxFeePerGas = 100n
		const customMaxPriorityFeePerGas = 10n

		const tx = await evmInputToImpersonatedTx(client)(evmInput, customMaxFeePerGas, customMaxPriorityFeePerGas)
		expect(tx.maxFeePerGas).toBe(customMaxFeePerGas)
		expect(tx.maxPriorityFeePerGas).toBe(customMaxPriorityFeePerGas)
	})

	it('should create an impersonated transaction with a default sender if origin and caller are not provided', async () => {
		// Use our test helper to prepare a node
		const { client } = await prepareTestNode()

		const evmInput = {
			to: EthjsAddress.fromString(`0x${'12'.repeat(20)}`),
			data: new Uint8Array([0x12, 0x34]),
			value: 1000n,
		}

		const defaultSender = EthjsAddress.fromString(`0x${'00'.repeat(20)}`)

		const tx = await evmInputToImpersonatedTx(client)(evmInput)
		expect(tx.getSenderAddress().toString()).toBe(defaultSender.toString())
	})

	it('should use caller when origin is not provided', async () => {
		// Use our test helper to prepare a node
		const { client } = await prepareTestNode()

		const evmInput = {
			to: EthjsAddress.fromString(`0x${'12'.repeat(20)}`),
			data: new Uint8Array([0x12, 0x34]),
			value: 1000n,
			caller: EthjsAddress.fromString(`0x${'56'.repeat(20)}`),
		}

		const tx = await evmInputToImpersonatedTx(client)(evmInput)
		expect(tx.getSenderAddress().toString()).toBe(evmInput.caller.toString())
	})

	it('should prioritize origin over caller when both are provided', async () => {
		// Use our test helper to prepare a node
		const { client } = await prepareTestNode()

		const evmInput = {
			to: EthjsAddress.fromString(`0x${'12'.repeat(20)}`),
			data: new Uint8Array([0x12, 0x34]),
			value: 1000n,
			origin: EthjsAddress.fromString(`0x${'34'.repeat(20)}`),
			caller: EthjsAddress.fromString(`0x${'56'.repeat(20)}`),
		}

		const tx = await evmInputToImpersonatedTx(client)(evmInput)
		expect(tx.getSenderAddress().toString()).toBe(evmInput.origin.toString())
		expect(tx.getSenderAddress().toString()).not.toBe(evmInput.caller.toString())
	})

	it('should handle undefined optional fields', async () => {
		// Use our test helper to prepare a node
		const { client } = await prepareTestNode()

		const evmInput = {
			origin: EthjsAddress.fromString(`0x${'34'.repeat(20)}`),
			// to, data, and value are intentionally omitted
		}

		const tx = await evmInputToImpersonatedTx(client)(evmInput)
		expect(tx.to).toBeUndefined()
		expect(tx.data.length).toBe(0)
		expect(tx.value).toBe(0n)
	})

	it('should respect zero values for maxFeePerGas and maxPriorityFeePerGas', async () => {
		// Use our test helper to prepare a node
		const { client } = await prepareTestNode()

		const evmInput = {
			to: EthjsAddress.fromString(`0x${'12'.repeat(20)}`),
			origin: EthjsAddress.fromString(`0x${'34'.repeat(20)}`),
		}

		// Explicitly set maxFeePerGas and maxPriorityFeePerGas to 0n
		const tx = await evmInputToImpersonatedTx(client)(evmInput, 0n, 0n)

		// The txn should have the specified values even though they're unusual
		expect(tx.maxFeePerGas).toBe(0n)
		expect(tx.maxPriorityFeePerGas).toBe(0n)
	})

	/**
	 * Additional test cases that would be valuable but require more complex mocking:
	 *
	 * 1. Test handling when baseFeePerGas is null
	 *    - Verify the fallback logic for calculating maxFeePerGas
	 *
	 * 2. Test when maxFeePerGas is less than baseFeePerGas
	 *    - Verify that maxFeePerGas is correctly adjusted to baseFeePerGas
	 *
	 * 3. Test when maxPriorityFeePerGas is greater than maxFeePerGas
	 *    - Verify that maxFeePerGas is correctly adjusted to maxPriorityFeePerGas
	 *
	 * 4. Test nonce calculation with pending transactions
	 *    - Create multiple pending transactions for the sender in txPool
	 *    - Verify nonce is calculated as account.nonce + txs.length
	 *
	 * 5. Test error handling when vm.blockchain.getCanonicalHeadBlock() fails
	 *    - Mock the client to make this method throw an error
	 *    - Verify error propagation
	 *
	 * 6. Test error handling when txPool.getBySenderAddress() fails
	 *    - Mock the client to make this method throw an error
	 *    - Verify error propagation
	 *
	 * 7. Test error handling when vm.stateManager.getAccount() fails
	 *    - Mock the client to make this method throw an error
	 *    - Verify error propagation
	 *
	 * 8. Test with very large gasLimit values
	 *    - Verify transaction correctly uses block's gasLimit
	 *
	 * 9. Test error handling when createImpersonatedTx() fails
	 *    - Mock to make it throw an error
	 *    - Verify error propagation
	 *
	 * 10. Test unlimited code size configuration
	 *     - Create a test demonstrating need for unlimited code size
	 *     - Verify current implementation uses allowUnlimitedInitCodeSize: false
	 *
	 * 11. Test with unusual parentBlock.header properties
	 *     - Test with extreme gasLimit values
	 *     - Test with extreme baseFeePerGas values
	 */
})

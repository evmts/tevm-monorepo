import { createTevmNode } from '@tevm/node'
import { transports } from '@tevm/test-utils'
import { type Address, EthjsAddress } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { evmInputToImpersonatedTx } from './evmInputToImpersonatedTx.js'

describe('evmInputToImpersonatedTx', () => {
	it('should create an impersonated transaction with the correct parameters', async () => {
		const client = createTevmNode({
			fork: { transport: transports.optimism },
			miningConfig: { type: 'manual' },
		})

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

	it('should create an impersonated transaction with the correct nonce', async () => {
		const client = createTevmNode({
			fork: { transport: transports.optimism },
			miningConfig: { type: 'manual' },
		})

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
		const client = createTevmNode({
			fork: { transport: transports.optimism },
			miningConfig: { type: 'manual' },
		})

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
		const client = createTevmNode({
			fork: { transport: transports.optimism },
			miningConfig: { type: 'manual' },
		})

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
		const client = createTevmNode({
			fork: { transport: transports.optimism },
			miningConfig: { type: 'manual' },
		})

		const evmInput = {
			to: EthjsAddress.fromString(`0x${'12'.repeat(20)}`),
			data: new Uint8Array([0x12, 0x34]),
			value: 1000n,
		}

		const defaultSender = EthjsAddress.fromString(`0x${'00'.repeat(20)}`)

		const tx = await evmInputToImpersonatedTx(client)(evmInput)
		expect(tx.getSenderAddress().toString()).toBe(defaultSender.toString())
	})

	/**
	 * TODO: Add the following test cases for more robust coverage:
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
	 * 5. Test with caller property instead of origin
	 *    - Verify that sender is correctly set from caller when origin is undefined
	 * 
	 * 6. Test with undefined optional evmInput fields (to, data, value)
	 *    - Verify fields are correctly omitted in created transaction
	 * 
	 * 7. Test error handling when vm.blockchain.getCanonicalHeadBlock() fails
	 *    - Mock the client to make this method throw an error
	 *    - Verify error propagation
	 * 
	 * 8. Test error handling when txPool.getBySenderAddress() fails
	 *    - Mock the client to make this method throw an error
	 *    - Verify error propagation
	 * 
	 * 9. Test error handling when vm.stateManager.getAccount() fails
	 *    - Mock the client to make this method throw an error
	 *    - Verify error propagation
	 * 
	 * 10. Test with very large gasLimit values
	 *     - Verify transaction correctly uses block's gasLimit
	 * 
	 * 11. Test with both origin and caller set to different values
	 *     - Verify that origin takes precedence over caller
	 * 
	 * 12. Test error handling when createImpersonatedTx() fails
	 *     - Mock to make it throw an error
	 *     - Verify error propagation
	 * 
	 * 13. Test when maxFeePerGas and maxPriorityFeePerGas are provided as 0n
	 *     - Verify that zero values are respected and not replaced
	 * 
	 * 14. Test unlimited code size configuration
	 *     - Create a test demonstrating need for unlimited code size
	 *     - Verify current implementation uses allowUnlimitedInitCodeSize: false
	 * 
	 * 15. Test with unusual parentBlock.header properties
	 *     - Test with extreme gasLimit values
	 *     - Test with extreme baseFeePerGas values
	 */
})

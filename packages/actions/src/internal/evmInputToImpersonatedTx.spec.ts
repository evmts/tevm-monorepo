import { createBaseClient } from '@tevm/base-client'
import { transports } from '@tevm/test-utils'
import { type Address, EthjsAddress } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { evmInputToImpersonatedTx } from './evmInputToImpersonatedTx.js'

describe('evmInputToImpersonatedTx', () => {
	it('should create an impersonated transaction with the correct parameters', async () => {
		const client = createBaseClient({
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
		const client = createBaseClient({
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
		const client = createBaseClient({
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
		const client = createBaseClient({
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
		const client = createBaseClient({
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
})

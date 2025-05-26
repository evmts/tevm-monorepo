import { createChain } from '@tevm/blockchain'
import { optimism } from '@tevm/common'
import { createEvm } from '@tevm/evm'
import { createStateManager } from '@tevm/state'
import { LegacyTransaction, TransactionFactory } from '@tevm/tx'
import { EthjsAddress, hexToBytes, parseEther, createAddressFromString, createAccount, } from '@tevm/utils'
import { type Vm, createVm } from '@tevm/vm'
import { beforeEach, describe, expect, it } from 'vitest'
import { PREFUNDED_PRIVATE_KEYS } from '../../utils/dist/index.cjs'
import { TxPool } from './TxPool.js'

describe('TxPool.txGasPrice', () => {
	let txPool: TxPool
	let vm: Vm
	let senderAddress: EthjsAddress

	beforeEach(async () => {
		const common = optimism.copy()
		const blockchain = await createChain({ common })
		const stateManager = createStateManager({})
		senderAddress = createAddressFromString('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
		await stateManager.putAccount(
			senderAddress,
			createAccount({
				balance: parseEther('100'),
			}),
		)
		const evm = await createEvm({ common, stateManager, blockchain })
		vm = createVm({
			blockchain,
			common,
			evm,
			stateManager,
		})
		txPool = new TxPool({ vm })
	})

	it('should handle legacy transaction gas price correctly', async () => {
		// Create a legacy transaction
		const tx = new LegacyTransaction({
			nonce: 0,
			gasPrice: 1000000000n,
			gasLimit: 21000,
			to: '0x3535353535353535353535353535353535353535',
			value: 10000,
			data: '0x',
		})
		const signedTx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

		// Get gas price
		const gasPrice = (txPool as any).txGasPrice(signedTx)

		// For legacy transactions, maxFee and tip should both be the gas price
		expect(gasPrice.maxFee).toBe(1000000000n)
		expect(gasPrice.tip).toBe(1000000000n)
	})

	it('should handle EIP-2930 transaction gas price correctly', async () => {
		// Create an EIP-2930 transaction
		const tx = TransactionFactory({
			nonce: 0,
			gasPrice: 1500000000n,
			gasLimit: 21000,
			to: '0x3535353535353535353535353535353535353535',
			value: 10000,
			data: '0x',
			chainId: 1,
			accessList: [],
			type: 1,
		})
		const signedTx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

		// Get gas price
		const gasPrice = (txPool as any).txGasPrice(signedTx)

		// For EIP-2930 transactions, maxFee and tip should both be the gas price
		expect(gasPrice.maxFee).toBe(1500000000n)
		expect(gasPrice.tip).toBe(1500000000n)
	})

	it('should handle EIP-1559 transaction gas price correctly', async () => {
		// Create an EIP-1559 transaction
		const tx = TransactionFactory({
			nonce: 0,
			maxFeePerGas: 2000000000n,
			maxPriorityFeePerGas: 1000000000n,
			gasLimit: 21000,
			to: '0x3535353535353535353535353535353535353535',
			value: 10000,
			type: 2,
			data: '0x',
			chainId: 1,
		})
		const signedTx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

		// Get gas price
		const gasPrice = (txPool as any).txGasPrice(signedTx)

		// For EIP-1559 transactions, maxFee should be maxFeePerGas and tip should be maxPriorityFeePerGas
		expect(gasPrice.maxFee).toBe(2000000000n)
		expect(gasPrice.tip).toBe(1000000000n)
	})

	it('should handle impersonated transaction gas price correctly', async () => {
		// Create a mock impersonated transaction
		const impersonatedTx = {
			isImpersonated: true,
			maxFeePerGas: 3000000000n,
			maxPriorityFeePerGas: 1500000000n,
			nonce: 0n,
			gasLimit: 21000,
			to: '0x3535353535353535353535353535353535353535',
			value: 10000n,
			data: new Uint8Array(),
			getSenderAddress: () => senderAddress,
			hash: () => new Uint8Array(32),
			isSigned: () => true,
		}

		// Get gas price
		const gasPrice = (txPool as any).txGasPrice(impersonatedTx)

		// For impersonated transactions, we should use the provided values
		expect(gasPrice.maxFee).toBe(3000000000n)
		expect(gasPrice.tip).toBe(1500000000n)
	})

	it('should throw for unknown transaction types', async () => {
		// Create a mock transaction with unknown type
		const unknownTx = {
			type: 99, // Unknown type
			nonce: 0n,
			gasLimit: 21000,
			to: '0x3535353535353535353535353535353535353535',
			value: 10000n,
			data: new Uint8Array(),
			getSenderAddress: () => senderAddress,
			hash: () => new Uint8Array(32),
			isSigned: () => true,
		}

		// Should throw for unknown type
		expect(() => (txPool as any).txGasPrice(unknownTx)).toThrow('tx of type 99 unknown')
	})

	describe('normalizedGasPrice', () => {
		it('should return priority fee when baseFee is provided for EIP-1559 transaction', async () => {
			// Create an EIP-1559 transaction
			const tx = TransactionFactory({
				nonce: 0,
				maxFeePerGas: 2000000000n,
				maxPriorityFeePerGas: 1000000000n,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
				chainId: 1,
				type: 2,
			})
			const signedTx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

			// Get normalized gas price with baseFee
			const normalizedPrice = (txPool as any).normalizedGasPrice(signedTx, 500000000n)

			// Should return maxPriorityFeePerGas
			expect(normalizedPrice).toBe(1000000000n)
		})

		it('should return gasPrice minus baseFee for legacy transactions with baseFee', async () => {
			// Create a legacy transaction
			const tx = new LegacyTransaction({
				nonce: 0,
				gasPrice: 1500000000n,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			})
			const signedTx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

			// Get normalized gas price with baseFee
			const normalizedPrice = (txPool as any).normalizedGasPrice(signedTx, 500000000n)

			// Should return gasPrice - baseFee
			expect(normalizedPrice).toBe(1000000000n)
		})

		it('should return maxFeePerGas when no baseFee is provided for EIP-1559 transaction', async () => {
			// Create an EIP-1559 transaction
			const tx = TransactionFactory({
				nonce: 0,
				maxFeePerGas: 2000000000n,
				maxPriorityFeePerGas: 1000000000n,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
				chainId: 1,
				type: 2,
			})
			const signedTx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

			// Get normalized gas price without baseFee
			const normalizedPrice = (txPool as any).normalizedGasPrice(signedTx)

			// Should return maxFeePerGas
			expect(normalizedPrice).toBe(2000000000n)
		})

		it('should return gasPrice when no baseFee is provided for legacy transaction', async () => {
			// Create a legacy transaction
			const tx = new LegacyTransaction({
				nonce: 0,
				gasPrice: 1500000000n,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			})
			const signedTx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

			// Get normalized gas price without baseFee
			const normalizedPrice = (txPool as any).normalizedGasPrice(signedTx)

			// Should return gasPrice
			expect(normalizedPrice).toBe(1500000000n)
		})

		it('should handle zero baseFee correctly', async () => {
			// Create an EIP-1559 transaction
			const tx = TransactionFactory({
				nonce: 0,
				maxFeePerGas: 2000000000n,
				maxPriorityFeePerGas: 1000000000n,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
				chainId: 1,
				type: 2,
			})
			const signedTx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

			// Get normalized gas price with zero baseFee
			const normalizedPrice = (txPool as any).normalizedGasPrice(signedTx, 0n)

			// Should still return maxFeePerGas
			expect(normalizedPrice).toBe(2000000000n)
		})
	})
})

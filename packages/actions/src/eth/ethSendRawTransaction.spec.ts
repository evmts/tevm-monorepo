import { createAddress } from '@tevm/address'
import { tevmDefault } from '@tevm/common'
import { InvalidTransactionError } from '@tevm/errors'
import { createTevmNode } from '@tevm/node'
import { BlobEIP4844Transaction, TransactionFactory } from '@tevm/tx'
import { PREFUNDED_PRIVATE_KEYS, PREFUNDED_PUBLIC_KEYS, bytesToHex, hexToBytes, parseEther } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { getAccountHandler } from '../GetAccount/getAccountHandler.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { BlobGasLimitExceededError, ethSendRawTransactionHandler } from './ethSendRawTransactionHandler.js'

describe('ethSendRawTransactionHandler', () => {
	it('should handle a valid signed transaction', async () => {
		const client = createTevmNode()
		const handler = ethSendRawTransactionHandler(client)

		const to = createAddress(`0x${'42'.repeat(20)}`)
		const value = parseEther('1')

		// Create and sign a transaction
		const tx = TransactionFactory.fromTxData(
			{
				nonce: '0x00',
				maxFeePerGas: '0x09184e72a000',
				maxPriorityFeePerGas: '0x09184e72a000',
				gasLimit: '0x2710',
				to,
				value,
				data: '0x',
				type: 2,
			},
			{ common: tevmDefault.vmConfig },
		)

		const signedTx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
		const serializedTx = signedTx.serialize()

		const result = await handler({ data: bytesToHex(serializedTx) })

		expect(result).toBe(bytesToHex(signedTx.hash()))

		const txPool = await client.getTxPool()
		expect(await txPool.getBySenderAddress(createAddress(PREFUNDED_PUBLIC_KEYS[0]))).toHaveLength(1)

		await mineHandler(client)()
		const accountState = await getAccountHandler(client)({ address: to.toString() })
		expect(accountState.balance).toBe(value)
	})

	it.todo('should handle a legacy transaction', async () => {
		const client = createTevmNode()
		const handler = ethSendRawTransactionHandler(client)

		const tx = TransactionFactory.fromTxData(
			{
				nonce: '0x00',
				gasPrice: '0x09184e72a000',
				gasLimit: '0x2710',
				to: createAddress(`0x${'42'.repeat(20)}`),
				value: parseEther('1'),
				data: '0x',
				type: 0,
			},
			{ common: tevmDefault.vmConfig },
		)

		const signedTx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
		const serializedTx = signedTx.serialize()

		const result = await handler({ data: bytesToHex(serializedTx) })
		expect(result).toBe(bytesToHex(signedTx.hash()))
	})

	it('should handle an unsigned transaction with impersonation', async () => {
		const client = createTevmNode()
		const handler = ethSendRawTransactionHandler(client)

		const impersonatedAddress = createAddress(`0x${'42'.repeat(20)}`)
		await setAccountHandler(client)({
			address: impersonatedAddress.toString(),
			balance: parseEther('1000'),
		})
		await client.setImpersonatedAccount(impersonatedAddress.toString())

		const tx = TransactionFactory.fromTxData(
			{
				nonce: '0x00',
				maxFeePerGas: '0x09184e72a000',
				maxPriorityFeePerGas: '0x09184e72a000',
				gasLimit: '0x2710',
				to: createAddress(`0x${'43'.repeat(20)}`),
				value: parseEther('1'),
				data: '0x',
				type: 2,
			},
			{ common: tevmDefault.vmConfig },
		)

		const serializedTx = tx.serialize()

		const result = await handler({ data: bytesToHex(serializedTx) })
		expect(result).toBeTruthy()
	})

	it('should throw an error for an invalid transaction', async () => {
		const client = createTevmNode()
		const handler = ethSendRawTransactionHandler(client)

		await expect(handler({ data: '0xdeadbeef' })).rejects.toThrow(InvalidTransactionError)
	})

	it('should throw an error for an unsupported transaction type', async () => {
		const client = createTevmNode()
		const handler = ethSendRawTransactionHandler(client)

		const invalidTx = new Uint8Array([0xf8, ...new Uint8Array(20)]) // 0xf8 is an invalid tx type
		await expect(handler({ data: bytesToHex(invalidTx) })).rejects.toThrow('Invalid transaction type')
	})

	it.todo('should handle a blob transaction and throw BlobGasLimitExceededError', async () => {
		const client = createTevmNode()
		const handler = ethSendRawTransactionHandler(client)

		// Create mock KZG commitments (32 bytes each, starting with 0x01)
		const mockKZGCommitment1 = new Uint8Array([0x01, ...new Uint8Array(31).fill(1)])
		const mockKZGCommitment2 = new Uint8Array([0x01, ...new Uint8Array(31).fill(2)])

		const blobTx = BlobEIP4844Transaction.fromTxData(
			{
				nonce: '0x00',
				maxFeePerGas: '0x09184e72a000',
				maxPriorityFeePerGas: '0x09184e72a000',
				gasLimit: '0x2710',
				to: createAddress(`0x${'42'.repeat(20)}`),
				value: parseEther('1'),
				data: '0x',
				maxFeePerBlobGas: '0x09184e72a000',
				blobVersionedHashes: [mockKZGCommitment1, mockKZGCommitment2],
				blobs: [new Uint8Array(131072).fill(1), new Uint8Array(131072).fill(2)], // Add actual blob data
				kzgCommitments: [mockKZGCommitment1, mockKZGCommitment2],
				kzgProofs: [new Uint8Array(48).fill(1), new Uint8Array(48).fill(2)],
			},
			{ common: tevmDefault.vmConfig },
		)

		const signedTx = blobTx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
		const serializedTx = signedTx.serializeNetworkWrapper() // Use network wrapper serialization

		await expect(handler({ data: bytesToHex(serializedTx) })).rejects.toThrow(BlobGasLimitExceededError)
	})
})

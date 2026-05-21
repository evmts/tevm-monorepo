import { createEOACodeEIP7702Tx, TransactionFactory } from '@evmts/zevm/tx'
import { createAddress } from '@tevm/address'
import { tevmDefault } from '@tevm/common'
import { BlobGasLimitExceededError, InvalidTransactionError } from '@tevm/errors'
import { createTevmNode } from '@tevm/node'
import { bytesToHex, hexToBytes, PREFUNDED_PRIVATE_KEYS, PREFUNDED_PUBLIC_KEYS, parseEther } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { mineHandler } from '../Mine/mineHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { ethGetTransactionReceiptHandler } from './ethGetTransactionReceipt.js'
import { ethSendRawTransactionHandler } from './ethSendRawTransactionHandler.js'

describe('ethSendRawTransactionHandler', () => {
	it('should handle a valid signed transaction', async () => {
		const client = createTevmNode()
		const handler = ethSendRawTransactionHandler(client)

		const to = createAddress(`0x${'42'.repeat(20)}`)
		const value = parseEther('1')

		// Create and sign a transaction
		const tx = TransactionFactory(
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
			{ common: tevmDefault.ethjsCommon },
		)

		const signedTx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
		const serializedTx = signedTx.serialize()

		const result = await handler({ data: bytesToHex(serializedTx) })

		expect(result).toBe(bytesToHex(signedTx.hash()))

		const txPool = await client.getTxPool()
		expect(await txPool.getBySenderAddress(createAddress(PREFUNDED_PUBLIC_KEYS[0]))).toHaveLength(1)

		await mineHandler(client)()
		// @ts-expect-error: Monorepo type conflict: TevmNode from source (/src) conflicts with the matcher's type from compiled output (/dist).
		await expect(to.toString()).toHaveState(client, { balance: value })
	})

	it.todo('should handle a legacy transaction', async () => {
		const client = createTevmNode()
		const handler = ethSendRawTransactionHandler(client)

		const tx = TransactionFactory(
			{
				nonce: '0x00',
				gasPrice: '0x09184e72a000',
				gasLimit: '0x2710',
				to: createAddress(`0x${'42'.repeat(20)}`),
				value: parseEther('1'),
				data: '0x',
				type: 0,
			},
			{ common: tevmDefault.ethjsCommon },
		)

		const signedTx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
		const serializedTx = signedTx.serialize()

		const result = await handler({ data: bytesToHex(serializedTx) })
		expect(result).toBe(bytesToHex(signedTx.hash()))
	})

	it('should handle an unsigned transaction with impersonation', async () => {
		const client = createTevmNode({ common: tevmDefault })
		const handler = ethSendRawTransactionHandler(client)

		const impersonatedAddress = createAddress(`0x${'42'.repeat(20)}`)
		await setAccountHandler(client)({
			address: impersonatedAddress.toString(),
			balance: parseEther('1000'),
		})
		await client.setImpersonatedAccount(impersonatedAddress.toString())

		const tx = TransactionFactory(
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
			{ common: tevmDefault.ethjsCommon },
		)

		const serializedTx = tx.serialize()

		const result = await handler({ data: bytesToHex(serializedTx) })
		expect(result).toBeTruthy()
	})

	it('should preserve EIP-7702 raw transactions in the txpool and receipts', async () => {
		const client = createTevmNode({ common: tevmDefault, miningConfig: { type: 'manual' } })
		const handler = ethSendRawTransactionHandler(client)
		const chainId = tevmDefault.ethjsCommon.chainId()

		const tx = createEOACodeEIP7702Tx(
			{
				nonce: 0,
				maxFeePerGas: 2000000000n,
				maxPriorityFeePerGas: 1000000000n,
				gasLimit: 100000n,
				to: createAddress(`0x${'42'.repeat(20)}`),
				value: 0n,
				data: '0x',
				chainId,
				accessList: [],
				authorizationList: [
					{
						chainId: `0x${chainId.toString(16)}`,
						address: `0x${'42'.repeat(20)}`,
						nonce: '0x0',
						yParity: '0x0',
						r: `0x${'01'.repeat(32)}`,
						s: `0x${'02'.repeat(32)}`,
					},
				],
			},
			{ common: tevmDefault.ethjsCommon },
		)
		const signedTx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
		const txHash = bytesToHex(signedTx.hash())

		const result = await handler({ data: bytesToHex(signedTx.serialize()) })

		expect(result).toBe(txHash)
		const txPool = await client.getTxPool()
		const [pooledTx] = txPool.getByHash([hexToBytes(txHash)])
		expect(pooledTx?.type).toBe(4)
		expect((pooledTx as any).authorizationList).toHaveLength(1)

		await mineHandler(client)()
		const receipt = await ethGetTransactionReceiptHandler(client)({ hash: txHash })
		expect(receipt?.transactionHash).toBe(txHash)
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
		await expect(handler({ data: bytesToHex(invalidTx) })).rejects.toThrow('Invalid transaction')
	})

	it.todo('should handle a blob transaction and throw BlobGasLimitExceededError', async () => {
		const client = createTevmNode()
		const handler = ethSendRawTransactionHandler(client)

		// Create mock KZG commitments (32 bytes each, starting with 0x01)
		const mockKZGCommitment1 = new Uint8Array([0x01, ...new Uint8Array(31).fill(1)])
		const mockKZGCommitment2 = new Uint8Array([0x01, ...new Uint8Array(31).fill(2)])

		const blobTx = TransactionFactory(
			{
				nonce: '0x00',
				maxFeePerGas: '0x09184e72a000',
				maxPriorityFeePerGas: '0x09184e72a000',
				gasLimit: '0x2710',
				to: createAddress(`0x${'42'.repeat(20)}`),
				value: parseEther('1'),
				data: '0x',
				type: 3, // EIP-4844 blob transaction
				maxFeePerBlobGas: '0x09184e72a000',
				blobVersionedHashes: [mockKZGCommitment1, mockKZGCommitment2],
				blobs: [new Uint8Array(131072).fill(1), new Uint8Array(131072).fill(2)], // Add actual blob data
				kzgCommitments: [mockKZGCommitment1, mockKZGCommitment2],
				kzgProofs: [new Uint8Array(48).fill(1), new Uint8Array(48).fill(2)],
			},
			{ common: tevmDefault.ethjsCommon },
		)

		const signedTx = blobTx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
		const serializedTx = signedTx.serialize() // Serialize the transaction

		await expect(handler({ data: bytesToHex(serializedTx) })).rejects.toThrow(BlobGasLimitExceededError)
	})
})

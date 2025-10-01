import { Block } from '@tevm/block'
import { createChain } from '@tevm/blockchain'
import { optimism } from '@tevm/common'
import { createEvm } from '@tevm/evm'
import { createStateManager } from '@tevm/state'
import {
	FeeMarketEIP1559Transaction,
	type ImpersonatedTx,
	LegacyTransaction,
	TransactionFactory,
	type TypedTransaction,
} from '@tevm/tx'
import {
	bytesToHex,
	createAccount,
	createAddressFromString,
	EthjsAddress,
	hexToBytes,
	PREFUNDED_ACCOUNTS,
	parseEther,
} from '@tevm/utils'
import { createVm, type Vm } from '@tevm/vm'
import { assert, beforeEach, describe, expect, it, vi } from 'vitest'
import { bytesToUnprefixedHex, PREFUNDED_PRIVATE_KEYS } from '../../utils/dist/index.cjs'
import { TxPool } from './TxPool.js'

describe(TxPool.name, () => {
	let txPool: TxPool
	let vm: Vm
	let senderAddress: EthjsAddress

	beforeEach(async () => {
		const blockchain = await createChain({ common: optimism })
		const stateManager = createStateManager({})
		senderAddress = createAddressFromString('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
		await stateManager.putAccount(
			senderAddress,
			createAccount({
				balance: parseEther('100'),
			}),
		)
		const evm = await createEvm({ common: optimism, stateManager, blockchain })
		vm = createVm({
			blockchain,
			common: optimism,
			evm,
			stateManager,
		})
		txPool = new TxPool({ vm })
	})

	it('should initialize transaction pool', async () => {
		expect(txPool).toBeDefined()
		expect(txPool.pool).toBeInstanceOf(Map)
		expect(txPool.txsInPool).toEqual(0)
		expect(txPool.txsByHash).toBeInstanceOf(Map)
		expect(txPool.txsByNonce).toBeInstanceOf(Map)
		expect(txPool.txsInNonceOrder).toBeInstanceOf(Map)
		expect(txPool.running).toBe(true)
	})

	it('should add and get transaction', async () => {
		// create, sign and add transaction
		const transaction = new LegacyTransaction({
			nonce: 0,
			gasPrice: 1000000000,
			gasLimit: 21000,
			to: '0x3535353535353535353535353535353535353535',
			value: 10000,
			data: '0x',
		})
		const signedTx = transaction.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
		const txHash = bytesToHex(signedTx.hash())
		const result = await txPool.add(signedTx)

		expect(result).toEqual({
			error: null,
			hash: txHash,
		})

		const poolTx = txPool.getByHash(txHash)
		assert(poolTx, 'poolTx should be defined')
		expect(bytesToHex(poolTx.hash())).toEqual(txHash)

		expect(await txPool.getPendingTransactions()).toHaveLength(1)
	})

	it('should error on tx with nonce too low', async () => {
		console.log('nonce too low test')
		const transaction = new FeeMarketEIP1559Transaction({
			nonce: 0,
			gasPrice: null,
			gasLimit: 21000,
			to: '0x3535353535353535353535353535353535353535',
			value: 10000,
			data: '0x',
			maxFeePerGas: 8n,
		})
		const signedTx = transaction.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

		await vm.stateManager.putAccount(
			createAddressFromString(PREFUNDED_ACCOUNTS[0].address),
			createAccount({ nonce: 25, balance: 100000000000000000000n }),
		)

		const result = await txPool.add(signedTx)

		expect(result).toEqual({
			error:
				'0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 tries to send a tx with nonce 0, but account has nonce 25 (tx nonce too low)',
			hash: bytesToHex(signedTx.hash()),
		})

		expect(await txPool.getPendingTransactions()).toHaveLength(0)
	})

	it('should error on tx with gas limit > block gas limit', async () => {
		// get the last block to access the gas limit
		const latest = await vm.blockchain.getCanonicalHeadBlock()
		const blockGasLimit = latest.header.gasLimit

		// create, sign transaction with gas limit > block gas limit
		const transaction = new LegacyTransaction({
			nonce: 0,
			gasPrice: 1000000000,
			gasLimit: blockGasLimit + 1n, // too high
			to: '0x3535353535353535353535353535353535353535',
			value: 10000,
			data: '0x',
		})
		const signedTx = transaction.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
		const result = await txPool.add(signedTx)

		// check result
		expect(result).toEqual({
			error: `Tx gaslimit of ${blockGasLimit + 1n} exceeds block gas limit of ${blockGasLimit} (exceeds last block gas limit)`,
			hash: bytesToHex(signedTx.hash()),
		})

		// check pool size
		expect(await txPool.getPendingTransactions()).toHaveLength(0)
	})

	it('should error on tx with insufficient balance', async () => {
		// create a vm with new account that has very little balance
		const blockchain = await createChain({ common: optimism })
		const stateManager = createStateManager({})
		const poorSenderPrivateKey = hexToBytes('0x1234567890123456789012345678901234567890123456789012345678901234')
		const poorSenderAddress = createAddressFromString('0x2e988a386a799f506693793c6a5af6b54dfaabfb')
		await stateManager.putAccount(
			poorSenderAddress,
			createAccount({
				balance: 1000n, // very little balance
			}),
		)
		const evm = await createEvm({ common: optimism, stateManager, blockchain })
		const newVm = createVm({
			blockchain,
			common: optimism,
			evm,
			stateManager,
		})
		const newTxPool = new TxPool({ vm: newVm })

		// create, sign transaction that costs more than available balance
		const transaction = new LegacyTransaction({
			nonce: 0,
			gasPrice: 1000000000,
			gasLimit: 21000,
			to: '0x3535353535353535353535353535353535353535',
			value: 10000,
			data: '0x',
		})

		// create account that has the key matching our poorSenderAddress
		const signedTx = transaction.sign(poorSenderPrivateKey)

		// verify that the sender is in fact our poor account
		expect(signedTx.getSenderAddress().toString()).toEqual(poorSenderAddress.toString())

		const result = await newTxPool.add(signedTx)

		// check result
		expect(result).toEqual({
			error: `${poorSenderAddress} does not have enough balance to cover transaction costs, need 21000000010000, but have 1000 (insufficient balance)`,
			hash: bytesToHex(signedTx.hash()),
		})

		// check pool size
		expect(await newTxPool.getPendingTransactions()).toHaveLength(0)
	})

	it('should add multiple transactions with sequential nonces', async () => {
		// create, sign and add first tx with nonce 0
		const tx1 = new LegacyTransaction({
			nonce: 0,
			gasPrice: 1000000000,
			gasLimit: 21000,
			to: '0x3535353535353535353535353535353535353535',
			value: 10000,
			data: '0x',
		})
		const signedTx1 = tx1.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
		await txPool.add(signedTx1)

		// create, sign and add second tx with nonce 1
		const tx2 = new LegacyTransaction({
			nonce: 1, // sequential nonce
			gasPrice: 1000000000,
			gasLimit: 21000,
			to: '0x3535353535353535353535353535353535353535',
			value: 10000,
			data: '0x',
		})
		const signedTx2 = tx2.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
		await txPool.add(signedTx2)

		// check pool size
		const pendingTxs = await txPool.getPendingTransactions()
		expect(pendingTxs).toHaveLength(2)

		// verify the transactions are ordered by nonce
		expect(pendingTxs[0]?.hash()).toEqual(signedTx1.hash())
		expect(pendingTxs[1]?.hash()).toEqual(signedTx2.hash())
	})

	it('should handle transaction replacement with higher gas price', async () => {
		// create, sign and add first tx with nonce 0
		const tx1 = new LegacyTransaction({
			nonce: 0,
			gasPrice: 1000000000, // 1 Gwei
			gasLimit: 21000,
			to: '0x3535353535353535353535353535353535353535',
			value: 10000,
			data: '0x',
		})
		const signedTx1 = tx1.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
		await txPool.add(signedTx1)

		// create replacement tx with same nonce but higher gas price
		const tx2 = new LegacyTransaction({
			nonce: 0, // same nonce
			gasPrice: 2000000000, // 2 Gwei - higher gas price
			gasLimit: 21000,
			to: '0x3535353535353535353535353535353535353535',
			value: 10000,
			data: '0x',
		})
		const signedTx2 = tx2.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
		await txPool.add(signedTx2)

		// check pool size - should still be 1 tx
		const pendingTxs = await txPool.getPendingTransactions()
		expect(pendingTxs).toHaveLength(1)

		// verify the transaction was replaced
		expect(pendingTxs[0]?.hash()).toEqual(signedTx2.hash())
	})

	it('should reject transaction replacement with lower gas price', async () => {
		// create, sign and add first tx with nonce 0
		const tx1 = new LegacyTransaction({
			nonce: 0,
			gasPrice: 2000000000, // 2 Gwei
			gasLimit: 21000,
			to: '0x3535353535353535353535353535353535353535',
			value: 10000,
			data: '0x',
		})
		const signedTx1 = tx1.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
		await txPool.add(signedTx1)

		// create replacement tx with same nonce but lower gas price
		const tx2 = new LegacyTransaction({
			nonce: 0, // same nonce
			gasPrice: 1000000000, // 1 Gwei - lower gas price
			gasLimit: 21000,
			to: '0x3535353535353535353535353535353535353535',
			value: 10000,
			data: '0x',
		})
		const signedTx2 = tx2.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
		const result = await txPool.add(signedTx2)

		// check result
		expect(result).toEqual({
			error: 'replacement gas too low, got tip 1000000000, min: 2200000000, got fee 1000000000, min: 2200000000',
			hash: bytesToHex(signedTx2.hash()),
		})

		// check pool size - should still be 1 tx
		const pendingTxs = await txPool.getPendingTransactions()
		expect(pendingTxs).toHaveLength(1)

		// verify the original transaction is still in the pool
		expect(pendingTxs[0]?.hash()).toEqual(signedTx1.hash())
	})

	it('should handle EIP-1559 transactions', async () => {
		// create, sign and add an EIP-1559 tx
		const tx = TransactionFactory({
			nonce: 0,
			maxFeePerGas: 2000000000, // 2 Gwei
			maxPriorityFeePerGas: 1000000000, // 1 Gwei
			gasLimit: 21000,
			type: 2,
			to: '0x3535353535353535353535353535353535353535',
			value: 10000,
			data: '0x',
			chainId: 1,
		})
		const signedTx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
		await txPool.add(signedTx)

		// check pool size
		const pendingTxs = await txPool.getPendingTransactions()
		expect(pendingTxs).toHaveLength(1)

		// verify the transaction is in the pool
		expect(pendingTxs[0]?.hash()).toEqual(signedTx.hash())
	})

	it('should handle transaction removal when a block is added', async () => {
		// create, sign and add transaction
		const transaction = new LegacyTransaction({
			nonce: 0,
			gasPrice: 1000000000,
			gasLimit: 21000,
			to: '0x3535353535353535353535353535353535353535',
			value: 10000,
			data: '0x',
		})
		const signedTx = transaction.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
		await txPool.add(signedTx)

		// create a new block with our transaction in it
		const latest = await vm.blockchain.getCanonicalHeadBlock()
		const newBlock = Block.fromBlockData(
			{
				header: {
					parentHash: latest.hash(),
					number: latest.header.number + 1n,
					timestamp: Math.floor(Date.now() / 1000),
					gasLimit: latest.header.gasLimit,
				},
				transactions: [signedTx],
			},
			{ common: optimism },
		)

		// listen for pool changes
		const txRemovedSpy = vi.fn()
		txPool.on('txremoved', txRemovedSpy)

		// add the block to the chain
		await txPool.onBlockAdded(newBlock)

		// check the transaction was removed from the pool
		expect(txRemovedSpy).toHaveBeenCalledWith(bytesToHex(signedTx.hash()))
		expect(await txPool.getPendingTransactions()).toHaveLength(0)

		// check getByHash returns null for the removed tx
		expect(txPool.getByHash(bytesToHex(signedTx.hash()))).toBeNull()
	})

	it('should handle Access List EIP-2930 transactions', async () => {
		// create, sign and add an EIP-2930 tx
		const tx = TransactionFactory({
			nonce: 0,
			gasPrice: 1000000000,
			gasLimit: 21000,
			to: '0x3535353535353535353535353535353535353535',
			value: 10000,
			data: '0x',
			type: 1,
			chainId: 1,
			accessList: [
				{
					address: '0x3535353535353535353535353535353535353535',
					storageKeys: ['0x0000000000000000000000000000000000000000000000000000000000000000'],
				},
			],
		})
		const signedTx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
		await txPool.add(signedTx)

		// check pool size
		const pendingTxs = await txPool.getPendingTransactions()
		expect(pendingTxs).toHaveLength(1)

		// verify the transaction is in the pool
		expect(pendingTxs[0]?.hash()).toEqual(signedTx.hash())
	})

	// TODO: this is not implemented, should it be?
	it.todo('should handle transaction nonce gaps properly', async () => {
		// create, sign and add tx with nonce 0
		const tx1 = new LegacyTransaction({
			nonce: 0,
			gasPrice: 1000000000,
			gasLimit: 21000,
			to: '0x3535353535353535353535353535353535353535',
			value: 10000,
			data: '0x',
		})
		const signedTx1 = tx1.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
		await txPool.add(signedTx1)

		// create, sign and add tx with nonce 2 (gap)
		const tx2 = new LegacyTransaction({
			nonce: 2, // gap in nonce sequence
			gasPrice: 1000000000,
			gasLimit: 21000,
			to: '0x3535353535353535353535353535353535353535',
			value: 10000,
			data: '0x',
		})
		const signedTx2 = tx2.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
		await txPool.add(signedTx2)

		// check pool size
		const pendingTxs = await txPool.getPendingTransactions()
		expect(pendingTxs).toHaveLength(1) // only nonce 0 tx should be pending

		// add the missing nonce 1 tx
		const tx3 = new LegacyTransaction({
			nonce: 1, // filling the gap
			gasPrice: 1000000000,
			gasLimit: 21000,
			to: '0x3535353535353535353535353535353535353535',
			value: 10000,
			data: '0x',
		})
		const signedTx3 = tx3.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
		await txPool.add(signedTx3)

		// now all three should be pending
		const pendingTxsAfter = await txPool.getPendingTransactions()
		expect(pendingTxsAfter).toHaveLength(3)

		// verify the transactions are ordered by nonce
		expect(pendingTxsAfter[0]?.hash()).toEqual(signedTx1.hash())
		expect(pendingTxsAfter[1]?.hash()).toEqual(signedTx3.hash())
		expect(pendingTxsAfter[2]?.hash()).toEqual(signedTx2.hash())
	})

	it('should handle transaction event emitters', async () => {
		// listen for pool changes
		const txAddedSpy = vi.fn()
		const txRemovedSpy = vi.fn()
		txPool.on('txadded', txAddedSpy)
		txPool.on('txremoved', txRemovedSpy)

		// create, sign and add transaction
		const transaction = new LegacyTransaction({
			nonce: 0,
			gasPrice: 1000000000,
			gasLimit: 21000,
			to: '0x3535353535353535353535353535353535353535',
			value: 10000,
			data: '0x',
		})
		const signedTx = transaction.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
		const txHash = bytesToHex(signedTx.hash())
		await txPool.add(signedTx)

		// check txadded event was emitted
		expect(txAddedSpy).toHaveBeenCalledWith(txHash)

		// create a new block with our transaction in it
		const latest = await vm.blockchain.getCanonicalHeadBlock()
		const newBlock = Block.fromBlockData(
			{
				header: {
					parentHash: latest.hash(),
					number: latest.header.number + 1n,
					timestamp: Math.floor(Date.now() / 1000),
					gasLimit: latest.header.gasLimit,
				},
				transactions: [signedTx],
			},
			{ common: optimism },
		)

		// add the block to the chain
		await txPool.onBlockAdded(newBlock)

		// check txremoved event was emitted
		expect(txRemovedSpy).toHaveBeenCalledWith(txHash)
	})

	it('should handle manual transaction removal', async () => {
		// create, sign and add transaction
		const transaction = new LegacyTransaction({
			nonce: 0,
			gasPrice: 1000000000,
			gasLimit: 21000,
			to: '0x3535353535353535353535353535353535353535',
			value: 10000,
			data: '0x',
		})
		const signedTx = transaction.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
		const txHash = bytesToHex(signedTx.hash())
		await txPool.add(signedTx)

		// check tx is in pool
		expect(txPool.getByHash(txHash)).not.toBeNull()

		// listen for pool changes
		const txRemovedSpy = vi.fn()
		txPool.on('txremoved', txRemovedSpy)

		// remove the transaction
		txPool.removeByHash(txHash)

		// check txremoved event was emitted
		expect(txRemovedSpy).toHaveBeenCalledWith(txHash)

		// check tx is no longer in pool
		expect(txPool.getByHash(txHash)).toBeNull()
		expect(await txPool.getPendingTransactions()).toHaveLength(0)
	})

	it('should error gracefully when removing a transaction that does not exist', async () => {
		// attempt to remove non-existent tx
		const fakeTxHash = '0x1234567890123456789012345678901234567890123456789012345678901234'
		expect(() => txPool.removeByHash(fakeTxHash)).not.toThrow()
	})

	it('should clear all transactions', async () => {
		// create, sign and add multiple transactions
		for (let i = 0; i < 3; i++) {
			const tx = new LegacyTransaction({
				nonce: i,
				gasPrice: 1000000000,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			})
			const signedTx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
			await txPool.add(signedTx)
		}

		// verify transactions are in pool
		expect(await txPool.getPendingTransactions()).toHaveLength(3)

		// clear the pool
		await txPool.clear()

		// verify pool is empty
		expect(await txPool.getPendingTransactions()).toHaveLength(0)
	})

	it('should track transaction status correctly', async () => {
		// create, sign and add transaction
		const transaction = new LegacyTransaction({
			nonce: 0,
			gasPrice: 1000000000,
			gasLimit: 21000,
			to: '0x3535353535353535353535353535353535353535',
			value: 10000,
			data: '0x',
		})
		const signedTx = transaction.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
		const txHash = bytesToHex(signedTx.hash())
		await txPool.add(signedTx)

		// check status is pending
		const status = await txPool.getTransactionStatus(txHash)
		expect(status).toBe('pending')

		// create a new block with our transaction in it
		const latest = await vm.blockchain.getCanonicalHeadBlock()
		const newBlock = Block.fromBlockData(
			{
				header: {
					parentHash: latest.hash(),
					number: latest.header.number + 1n,
					timestamp: Math.floor(Date.now() / 1000),
					gasLimit: latest.header.gasLimit,
				},
				transactions: [signedTx],
			},
			{ common: optimism },
		)

		// add the block to the chain
		await txPool.onBlockAdded(newBlock)

		// check status is now mined
		const newStatus = await txPool.getTransactionStatus(txHash)
		expect(newStatus).toBe('mined')

		// check status of non-existent tx
		const fakeTxHash = '0x1234567890123456789012345678901234567890123456789012345678901234'
		const fakeStatus = await txPool.getTransactionStatus(fakeTxHash)
		expect(fakeStatus).toBe('unknown')
	})

	// Test scenario: Transaction is in the mempool, then gets mined, then
	// chain reorg occurs where the transaction is no longer included
	it('should handle chain reorganizations correctly', async () => {
		// create, sign and add transaction
		const transaction = new LegacyTransaction({
			nonce: 0,
			gasPrice: 1000000000,
			gasLimit: 21000,
			to: '0x3535353535353535353535353535353535353535',
			value: 10000,
			data: '0x',
		})
		const signedTx = transaction.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
		await txPool.add(signedTx)

		// create a new block with our transaction in it
		const latest = await vm.blockchain.getCanonicalHeadBlock()
		const blockWithTx = Block.fromBlockData(
			{
				header: {
					parentHash: latest.hash(),
					number: latest.header.number + 1n,
					timestamp: Math.floor(Date.now() / 1000),
					gasLimit: latest.header.gasLimit,
				},
				transactions: [signedTx],
			},
			{ common: optimism },
		)

		// add the block to the chain
		await vm.blockchain.putBlock(blockWithTx)
		await txPool.onBlockAdded(blockWithTx)

		// check tx is no longer in the pool
		expect(await txPool.getPendingTransactions()).toHaveLength(0)

		// simulate chain reorg by creating a new block that doesn't include the tx
		const newBlock = Block.fromBlockData(
			{
				header: {
					parentHash: latest.hash(),
					number: latest.header.number + 1n,
					timestamp: Math.floor(Date.now() / 1000) + 1, // Higher timestamp to ensure it's preferred
					gasLimit: latest.header.gasLimit,
				},
			},
			{ common: optimism },
		)

		// Put this "better" block in the chain to trigger a reorg
		await vm.blockchain.putBlock(newBlock)

		// Notify txpool about the reorg
		await txPool.onChainReorganization([blockWithTx], [newBlock])

		// The tx should be back in the pool
		const pendingTxs = await txPool.getPendingTransactions()
		expect(pendingTxs).toHaveLength(1)
		expect(pendingTxs[0]?.hash()).toEqual(signedTx.hash())
	})

	it('should return null when trying to getByHash a transaction that is not handled', async () => {
		// create and add transaction
		const transaction = new LegacyTransaction({
			nonce: 0,
			gasPrice: 1000000000,
			gasLimit: 21000,
			to: '0x3535353535353535353535353535353535353535',
			value: 10000,
			data: '0x',
		})
		const signedTx = transaction.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
		const txHash = bytesToUnprefixedHex(signedTx.hash())
		await txPool.add(signedTx)

		// create a new block with our transaction in it
		const latest = await vm.blockchain.getCanonicalHeadBlock()
		const newBlock = Block.fromBlockData(
			{
				header: {
					parentHash: latest.hash(),
					number: latest.header.number + 1n,
					timestamp: Math.floor(Date.now() / 1000),
					gasLimit: latest.header.gasLimit,
				},
				transactions: [signedTx],
			},
			{ common: optimism },
		)

		// add the block to the chain without notifying the txpool
		await vm.blockchain.putBlock(newBlock)

		// Manually mark the tx as not handled in txpool
		// @ts-expect-error - accessing private fields
		txPool.handled.set(txHash.toLowerCase(), undefined)

		// Try to get the tx
		const tx = txPool.getByHash(txHash)

		// This should be null since the tx is no longer in the pool
		expect(tx).toBeNull()
	})

	// Test for handling max transactions per sender limit
	// TODO: this won't error because `add` calls `validate` with `isLocalTransaction: true`, which skips the max per sender limit
	it.todo('should enforce maxPerSender limit', async () => {
		// Set a custom max per sender
		const maxPerSender = 3
		const customTxPool = new TxPool({ vm, maxPerSender })

		// Add maxPerSender transactions
		for (let i = 0; i < maxPerSender; i++) {
			const tx = new LegacyTransaction({
				nonce: i,
				gasPrice: 1000000000,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			})
			const signedTx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
			await customTxPool.add(signedTx)
		}

		// Add one more than the limit
		const extraTx = new LegacyTransaction({
			nonce: maxPerSender,
			gasPrice: 1000000000,
			gasLimit: 21000,
			to: '0x3535353535353535353535353535353535353535',
			value: 10000,
			data: '0x',
		})
		const signedExtraTx = extraTx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
		const result = await customTxPool.add(signedExtraTx)

		// Should have error about exceeding max per sender
		expect(result.error).toContain('Sender has too many transactions')
		expect(result.hash).toEqual(bytesToHex(signedExtraTx.hash()))

		// Check pool size is still at the limit
		expect(await customTxPool.getPendingTransactions()).toHaveLength(maxPerSender)
	})

	// Test for handling max transaction limit for the pool
	// TODO: same here
	it.todo('should enforce max pool size limit', async () => {
		// Create a pool with a small max size
		const maxSize = 3
		const customTxPool = new TxPool({ vm, maxSize })

		// Create multiple accounts and add one tx from each
		// to avoid hitting sender limits
		for (let i = 0; i < maxSize; i++) {
			// Create a new sender address and add funds
			const privateKey = hexToBytes(`0x${(i + 2).toString().padStart(2, '0')}${'00'.repeat(31)}`) // Generate different keys
			const senderAccount = createAccount({
				balance: parseEther('100'),
			})
			const wallet = new LegacyTransaction({
				nonce: 0,
				gasPrice: 0,
				gasLimit: 0,
				to: '0x0000000000000000000000000000000000000000',
			}).sign(privateKey)
			const address = wallet.getSenderAddress()
			await vm.stateManager.putAccount(address, senderAccount)

			// Add a tx from this sender
			const tx = new LegacyTransaction({
				nonce: 0,
				gasPrice: 1000000000,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			})
			const signedTx = tx.sign(privateKey)
			await customTxPool.add(signedTx)
		}

		// Check pool is at max size
		expect(await customTxPool.getPendingTransactions()).toHaveLength(maxSize)

		// Try to add one more transaction from yet another account
		const extraPrivateKey = hexToBytes(`0x${(maxSize + 2).toString().padStart(2, '0')}${'00'.repeat(31)}`)
		const extraSenderAccount = createAccount({
			balance: parseEther('100'),
		})
		const extraWallet = new LegacyTransaction({
			nonce: 0,
			gasPrice: 0,
			gasLimit: 0,
			to: '0x0000000000000000000000000000000000000000',
		}).sign(extraPrivateKey)
		const extraAddress = extraWallet.getSenderAddress()
		await vm.stateManager.putAccount(extraAddress, extraSenderAccount)

		const extraTx = new LegacyTransaction({
			nonce: 0,
			gasPrice: 1000000000,
			gasLimit: 21000,
			to: '0x3535353535353535353535353535353535353535',
			value: 10000,
			data: '0x',
		})
		const signedExtraTx = extraTx.sign(extraPrivateKey)
		const result = await customTxPool.add(signedExtraTx)

		// Should have error about pool being full
		expect(result.error).toContain('Transaction pool is full')
		expect(result.hash).toEqual(bytesToHex(signedExtraTx.hash()))

		// Check pool size remains at max
		expect(await customTxPool.getPendingTransactions()).toHaveLength(maxSize)
	})

	// Test for transaction replacement with higher fee when pool is full
	it('should allow transaction replacement with higher fee when pool is full', async () => {
		// Create a pool with a small max size
		const maxSize = 3
		const customTxPool = new TxPool({ vm, maxSize })

		// Create multiple accounts and add one tx from each
		const privateKeys = []
		for (let i = 0; i < maxSize; i++) {
			// Create a new sender address and add funds
			const privateKey = hexToBytes(`0x${(i + 2).toString().padStart(2, '0')}${'00'.repeat(31)}`)
			privateKeys.push(privateKey)
			const senderAccount = createAccount({
				balance: parseEther('100'),
			})
			const wallet = new LegacyTransaction({
				nonce: 0,
				gasPrice: 0,
				gasLimit: 0,
				to: '0x0000000000000000000000000000000000000000',
			}).sign(privateKey)
			const address = wallet.getSenderAddress()
			await vm.stateManager.putAccount(address, senderAccount)

			// Add a tx from this sender
			const tx = new LegacyTransaction({
				nonce: 0,
				gasPrice: 1000000000, // 1 Gwei
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			})
			const signedTx = tx.sign(privateKey)
			await customTxPool.add(signedTx)
		}

		// Check pool is at max size
		expect(await customTxPool.getPendingTransactions()).toHaveLength(maxSize)

		// Create replacement tx with higher gas price for the first tx
		const replacementTx = new LegacyTransaction({
			nonce: 0,
			gasPrice: 2000000000, // 2 Gwei - higher
			gasLimit: 21000,
			to: '0x3535353535353535353535353535353535353535',
			value: 10000,
			data: '0x',
		})
		const signedReplacementTx = replacementTx.sign(privateKeys[0] as any)
		const result = await customTxPool.add(signedReplacementTx)

		// Should succeed
		expect(result.error).toBeNull()
		expect(result.hash).toEqual(bytesToHex(signedReplacementTx.hash()))

		// Check pool size remains at max
		const pendingTxs = await customTxPool.getPendingTransactions()
		expect(pendingTxs).toHaveLength(maxSize)

		// Verify the replacement tx is in the pool
		const replacementHash = bytesToHex(signedReplacementTx.hash())
		const poolTx = customTxPool.getByHash(replacementHash) as TypedTransaction | ImpersonatedTx | undefined
		assert(poolTx, 'poolTx should be defined')
		expect(bytesToHex(poolTx.hash())).toEqual(replacementHash)
	})

	// Test logStats method
	it('should log pool statistics', async () => {
		// Initialize pool with some transactions
		for (let i = 0; i < 3; i++) {
			const tx = new LegacyTransaction({
				nonce: i,
				gasPrice: 1000000000,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			})
			const signedTx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
			await txPool.add(signedTx)
		}

		const originalConsoleLog = console.log
		const mockLog = vi.fn()
		console.log = mockLog

		// Call logStats
		txPool.logStats()

		// Restore console.log
		console.log = originalConsoleLog

		// Verify log was called
		expect(mockLog).toHaveBeenCalled()
		// Check that some pool stats were logged
		const logCalls = mockLog.mock.calls.flat()
		const logStr = logCalls.join(' ')
		expect(logStr).toContain('TxPool Stats')
		expect(logStr).toContain('Pending: 3')
	})
})

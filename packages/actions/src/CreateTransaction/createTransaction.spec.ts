import { createAddress } from '@tevm/address'
import { type TevmNode, createTevmNode } from '@tevm/node'
import { TestERC20 } from '@tevm/test-utils'
import { type Address, type Hex, bytesToHex, encodeFunctionData } from '@tevm/utils'
import { assert, beforeEach, describe, expect, it } from 'vitest'
import type { CallParams } from '../Call/CallParams.js'
import { callHandlerOpts } from '../Call/callHandlerOpts.js'
import { executeCall } from '../Call/executeCall.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { createTransaction } from './createTransaction.js'

const contract = TestERC20.withAddress(createAddress(420420420420420).toString())

describe(createTransaction.name, async () => {
	let client: TevmNode
	beforeEach(async () => {
		client = createTevmNode()
		await setAccountHandler(client)({
			address: contract.address,
			deployedBytecode: contract.deployedBytecode,
		})
	})

	const runTransaction = async (_params?: CallParams) => {
		const params: CallParams = {
			data: encodeFunctionData(contract.read.balanceOf(createAddress(25).toString())),
			to: contract.address,
			gas: 16784800n,
			createTransaction: 'on-success',
			..._params,
		}

		const vm = await client.getVm().then((vm) => vm.deepCopy())
		const { data: evmInput, errors: callHandlerOptsErrors } = await callHandlerOpts(client, params)

		assert(!callHandlerOptsErrors, 'callHandlerOptsErrors should be undefined')
		assert(evmInput, 'evmInput should be defined')

		const executeCallResult = await executeCall({ ...client, getVm: async () => vm }, evmInput, params)
		assert(!('errors' in executeCallResult), 'executeCallResult.errors should be undefined')

		return {
			throwOnFail: false,
			evmInput,
			evmOutput: executeCallResult.runTxResult,
			maxPriorityFeePerGas: params.maxPriorityFeePerGas,
			maxFeePerGas: params.maxFeePerGas,
		}
	}

	it('should create a transaction and add it to the tx pool', async () => {
		const options = await runTransaction()
		const txRes = await createTransaction(client)(options)

		assert(!('errors' in txRes), 'txRes.errors should be undefined')
		expect(txRes.txHash).toBeDefined()

		assert(options.evmInput.origin, 'options.evmInput.origin should be defined')
		const txPool = await client.getTxPool()
		const txs = await txPool.getBySenderAddress(options.evmInput.origin)
		expect(txs.length).toBe(1)
		expect(`0x${txs[0]?.hash}`).toBe(txRes.txHash)
	})

	it('should create multiple transactions from the same account and add them to the tx pool', async () => {
		const options = await runTransaction()
		const TX_COUNT = 10
		const txResponses: { txHash: string }[] = []
		for (let i = 0; i < TX_COUNT; i++) {
			const txRes = await createTransaction(client)(options)
			assert(!('errors' in txRes), 'txRes.errors should be undefined')
			assert(txRes.txHash, 'txRes.txHash should be defined')
			txResponses.push(txRes)
		}

		assert(options.evmInput.origin, 'options.evmInput.origin should be defined')
		const txPool = await client.getTxPool()
		const poolTransactions = await txPool.getBySenderAddress(options.evmInput.origin)
		expect(poolTransactions.length).toBe(TX_COUNT)
		txResponses.forEach((txResponse, i) => {
			expect(`0x${poolTransactions[i]?.hash}`).toBe(txResponse.txHash)
		})
	})

	it('should emit a newPendingTransaction event on the client', async () => {
		const options = await runTransaction()

		// Wait for the event to be emitted and get the transaction hash
		const emittedTxHash = await new Promise<Hex>((resolve, reject) => {
			const timeout = setTimeout(() => reject(new Error('Timeout: newPendingTransaction event was not emitted')), 1000)
			const onNewPendingTransaction = (tx: { hash: () => Uint8Array }) => {
				clearTimeout(timeout)
				client.removeListener('newPendingTransaction', onNewPendingTransaction)
				resolve(bytesToHex(tx.hash()))
			}

			client.on('newPendingTransaction', onNewPendingTransaction)

			// Execute this outside the Promise constructor
			createTransaction(client)(options)
				.then((txRes) => {
					if ('errors' in txRes) {
						clearTimeout(timeout)
						client.removeListener('newPendingTransaction', onNewPendingTransaction)
						reject(new Error(`Transaction failed: ${txRes.errors}`))
					}
				})
				.catch((err) => {
					clearTimeout(timeout)
					client.removeListener('newPendingTransaction', onNewPendingTransaction)
					reject(err)
				})
		})

		// Verify the transaction was added to the pool
		assert(options.evmInput.origin, 'options.evmInput.origin should be defined')
		const txPool = await client.getTxPool()
		const txs = await txPool.getBySenderAddress(options.evmInput.origin)
		expect(txs.length).toBe(1)
		expect(`0x${txs[0]?.hash}`).toBe(emittedTxHash)
	})

	it('should work with no ether if skipBalance is true', async () => {
		const from = `0x${'1'.repeat(40)}` as Address
		await setAccountHandler(client)({
			address: from,
			balance: 0n,
			nonce: 0n,
		})

		const options = await runTransaction({ from, skipBalance: true })
		const txRes = await createTransaction(client)(options)

		assert(!('errors' in txRes), 'txRes.errors should be undefined')
		expect(txRes.txHash).toBeDefined()

		assert(options.evmInput.origin, 'options.evmInput.origin should be defined')
		const txPool = await client.getTxPool()
		const txs = await txPool.getBySenderAddress(options.evmInput.origin)
		expect(txs.length).toBe(1)
		expect(`0x${txs[0]?.hash}`).toBe(txRes.txHash)
	})

	it('should throw error if the sender has no balance and skipBalance is false', async () => {
		const from = `0x${'1'.repeat(40)}` as Address
		await setAccountHandler(client)({
			address: from,
			balance: 0n,
			nonce: 0n,
		})

		const options = await runTransaction({ from })
		const txRes = await createTransaction(client)(options)

		assert('errors' in txRes, 'txRes.errors should be defined')
		expect(txRes.errors[0]?.message).toEqual(
			'Insufficientbalance: Account 0x1111111111111111111111111111111111111111 attempted to create a transaction with zero eth. Consider adding eth to account or using a different from or origin address',
		)
	})
})

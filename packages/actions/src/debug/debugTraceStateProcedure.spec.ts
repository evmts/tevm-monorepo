import { SimpleContract } from '@tevm/contract'
import { type TevmNode, createTevmNode } from '@tevm/node'
import { type Address, PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { assert, beforeAll, describe, expect, it } from 'vitest'
import { contractHandler } from '../Contract/contractHandler.js'
import { deployHandler } from '../Deploy/deployHandler.js'
import { debugTraceStateJsonRpcProcedure } from './debugTraceStateProcedure.js'

describe('debugTraceStateJsonRpcProcedure', () => {
	let client: TevmNode
	let contractAddress: Address
	beforeAll(async () => {
		client = createTevmNode()

		// Mine a transaction to update the storage and state roots
		const { createdAddress } = await deployHandler(client)({ addToBlockchain: true, ...SimpleContract.deploy(1n) })
		assert(createdAddress, 'Contract deployment failed')
		contractAddress = createdAddress
		const contract = SimpleContract.withAddress(createdAddress)

		// Add a transaction to the mempool
		await contractHandler(client)({
			addToMempool: true,
			blockTag: 'pending',
			...contract.write.set(42n),
		})
	})

	it('should trace the entire state if no filters are provided', async () => {
		const procedure = debugTraceStateJsonRpcProcedure(client)

		const res = await procedure({
			jsonrpc: '2.0',
			method: 'debug_traceState',
			params: [{}],
			id: 1,
		})

		// timestamp and stateRoot in blockchain.blocksByNumber will change
		res.result?.blockchain.blocksByNumber.forEach((block) => {
			if (!block) return
			const { header, ..._block } = block
			const { timestamp, stateRoot, ..._header } = header
			expect(_block).toMatchSnapshot()
			expect(_header).toMatchSnapshot()
		})

		// added timestamp in tx pool will change
		res.result?.pool.pool.forEach((txArray) => {
			txArray.forEach((tx) => {
				const { added, ..._tx } = tx
				expect(_tx).toMatchSnapshot()
			})
		})

		// some timestamps will change and there are some non-deterministic addresses
		const stateRoots = [...(res.result?.stateManager.stateRoots.entries() ?? [])]
		expect(stateRoots[0]?.[1][PREFUNDED_ACCOUNTS[0].address]).toMatchSnapshot()
		expect(stateRoots[1]?.[1][PREFUNDED_ACCOUNTS[0].address]).toMatchSnapshot()
		expect(stateRoots[1]?.[1][contractAddress]).toMatchSnapshot()

		expect(res.result?.evm).toMatchSnapshot()
		expect(res.result?.node).toMatchSnapshot()
	})

	it('should trace state related to specific global filters', async () => {
		const procedure = debugTraceStateJsonRpcProcedure(client)

		expect(
			await procedure({
				jsonrpc: '2.0',
				method: 'debug_traceState',
				params: [
					{
						filters: ['evm.common.eips', 'node'],
					},
				],
				id: 1,
			}),
		).toMatchSnapshot()
	})
})

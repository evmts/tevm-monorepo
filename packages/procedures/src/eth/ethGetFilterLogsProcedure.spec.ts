import { createAddress, createContractAddress } from '@tevm/address'
import { type TevmNode, createTevmNode } from '@tevm/node'
import { SimpleContract } from '@tevm/contract'
import { PREFUNDED_ACCOUNTS, encodeDeployData, encodeFunctionData, isHex, numberToHex } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { callProcedure } from '../call/callProcedure.js'
import { mineProcedure } from '../mine/mineProcedure.js'
import { ethGetFilterLogsProcedure } from './ethGetFilterLogsProcedure.js'
import { ethNewFilterJsonRpcProcedure } from './ethNewFilterProcedure.js'

describe(ethGetFilterLogsProcedure.name, () => {
	let client: TevmNode

	const INITIAL_BALANCE = 20n
	const contract = SimpleContract.withAddress(
		createContractAddress(createAddress(PREFUNDED_ACCOUNTS[0].address), 0n).toString(),
	)

	const doMine = () => {
		return mineProcedure(client)({
			jsonrpc: '2.0',
			params: [numberToHex(1n), numberToHex(1n)],
			method: 'tevm_mine',
		})
	}

	beforeEach(async () => {
		client = createTevmNode()

		expect(
			(
				await callProcedure(client)({
					method: 'tevm_call',
					jsonrpc: '2.0',
					params: [
						{
							data: encodeDeployData(contract.deploy(INITIAL_BALANCE)),
							createTransaction: true,
						},
					],
				})
			).error,
		).toBeUndefined()

		expect((await doMine()).error).toBeUndefined()
	})

	it('should return logs', async () => {
		const { result: filterId } = await ethNewFilterJsonRpcProcedure(client)({
			jsonrpc: '2.0',
			method: 'eth_newFilter',
			params: [{}],
		})
		if (!filterId) throw new Error('Expected filter')

		expect(
			(
				await callProcedure(client)({
					method: 'tevm_call',
					jsonrpc: '2.0',
					params: [
						{
							to: contract.address,
							data: encodeFunctionData(contract.write.set(69n)),
							createTransaction: true,
						},
					],
				})
			).error,
		).toBeUndefined()
		expect((await doMine()).error).toBeUndefined()

		const { result, error } = await ethGetFilterLogsProcedure(client)({
			jsonrpc: '2.0',
			method: 'eth_getFilterLogs',
			params: [filterId],
		})

		expect(error).toBeUndefined()

		expect(result).toHaveLength(1)
		const { blockHash, ...deterministicResult } = result?.[0] ?? {}
		expect(isHex(blockHash)).toBe(true)
		expect(blockHash).toHaveLength(66)
		expect(deterministicResult).toMatchInlineSnapshot(`
			{
			  "address": "0x5fbdb2315678afecb367f032d93f642f64180aa3",
			  "blockNumber": "0x2",
			  "data": "0x0000000000000000000000000000000000000000000000000000000000000045",
			  "logIndex": "0x0",
			  "removed": false,
			  "topics": [
			    "0x012c78e2b84325878b1bd9d250d772cfe5bda7722d795f45036fa5e1e6e303fc",
			  ],
			  "transactionHash": "0x26de6f137bcebaa05e276447f69158f66910b461e47afca6fe67360833698708",
			  "transactionIndex": "0x0",
			}
		`)
	})
})

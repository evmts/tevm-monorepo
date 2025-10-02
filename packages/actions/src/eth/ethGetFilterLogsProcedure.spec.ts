import { createAddress, createContractAddress } from '@tevm/address'
import { SimpleContract } from '@tevm/contract'
import { createTevmNode, type TevmNode } from '@tevm/node'
import {
	encodeDeployData,
	encodeFunctionData,
	isHex,
	keccak256,
	numberToHex,
	PREFUNDED_ACCOUNTS,
	stringToHex,
} from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { callProcedure } from '../Call/callProcedure.js'
import { mineProcedure } from '../Mine/mineProcedure.js'
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

	it("should return logs with OR'ed topics", async () => {
		const topic1 = keccak256(stringToHex('ValueSet(uint256)'))
		const topic2 = keccak256(stringToHex('NonExistentEvent(uint256)'))

		const { result: filterId } = await ethNewFilterJsonRpcProcedure(client)({
			jsonrpc: '2.0',
			method: 'eth_newFilter',
			params: [
				{
					address: contract.address,
					topics: [[topic1, topic2]],
				},
			],
		})
		if (!filterId) throw new Error('Expected filter')

		// Set value to 69n
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

		// Set value to 420n
		expect(
			(
				await callProcedure(client)({
					method: 'tevm_call',
					jsonrpc: '2.0',
					params: [
						{
							to: contract.address,
							data: encodeFunctionData(contract.write.set(420n)),
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
		expect(result).toHaveLength(2)

		result?.forEach((log, index) => {
			const { blockHash, ...deterministicResult } = log
			expect(isHex(blockHash)).toBe(true)
			expect(blockHash).toHaveLength(66)
			expect(deterministicResult.topics[0]).toBe(topic1)
			expect(deterministicResult.data).toBe(
				index === 0
					? '0x0000000000000000000000000000000000000000000000000000000000000045' // 69n
					: '0x00000000000000000000000000000000000000000000000000000000000001a4', // 420n
			)
		})
	})
})

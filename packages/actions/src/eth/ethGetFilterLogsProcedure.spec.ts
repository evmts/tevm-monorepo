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
			  "blockNumber": "0x3",
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

	it('should return error when filter not found', async () => {
		const { error, result } = await ethGetFilterLogsProcedure(client)({
			jsonrpc: '2.0',
			method: 'eth_getFilterLogs',
			id: 1,
			params: ['0xnonexistentfilter'],
		})

		expect(result).toBeUndefined()
		expect(error).toEqual({
			code: -32602,
			message: 'Filter not found',
		})
	})

	it('should handle request with ID field', async () => {
		const { result: filterId } = await ethNewFilterJsonRpcProcedure(client)({
			jsonrpc: '2.0',
			method: 'eth_newFilter',
			params: [{}],
		})
		if (!filterId) throw new Error('Expected filter')

		const response = await ethGetFilterLogsProcedure(client)({
			jsonrpc: '2.0',
			method: 'eth_getFilterLogs',
			id: 42,
			params: [filterId],
		})

		expect(response.id).toBe(42)
		expect(response.method).toBe('eth_getFilterLogs')
		expect(response.jsonrpc).toBe('2.0')
	})

	it('should handle request without ID field', async () => {
		const { result: filterId } = await ethNewFilterJsonRpcProcedure(client)({
			jsonrpc: '2.0',
			method: 'eth_newFilter',
			params: [{}],
		})
		if (!filterId) throw new Error('Expected filter')

		const response = await ethGetFilterLogsProcedure(client)({
			jsonrpc: '2.0',
			method: 'eth_getFilterLogs',
			params: [filterId],
		})

		expect(response.id).toBeUndefined()
		expect(response.method).toBe('eth_getFilterLogs')
		expect(response.jsonrpc).toBe('2.0')
	})

	it('should return empty array when no logs match filter criteria', async () => {
		// Create filter for a non-existent contract address
		const { result: filterId } = await ethNewFilterJsonRpcProcedure(client)({
			jsonrpc: '2.0',
			method: 'eth_newFilter',
			params: [
				{
					address: '0x0000000000000000000000000000000000000999',
					fromBlock: 'latest',
					toBlock: 'latest',
				},
			],
		})
		if (!filterId) throw new Error('Expected filter')

		const { result, error } = await ethGetFilterLogsProcedure(client)({
			jsonrpc: '2.0',
			method: 'eth_getFilterLogs',
			params: [filterId],
		})

		expect(error).toBeUndefined()
		expect(result).toEqual([])
	})

	it('should filter logs by specific topic', async () => {
		const topic1 = keccak256(stringToHex('ValueSet(uint256)'))

		const { result: filterId } = await ethNewFilterJsonRpcProcedure(client)({
			jsonrpc: '2.0',
			method: 'eth_newFilter',
			params: [
				{
					address: contract.address,
					topics: [topic1],
				},
			],
		})
		if (!filterId) throw new Error('Expected filter')

		// Emit an event
		expect(
			(
				await callProcedure(client)({
					method: 'tevm_call',
					jsonrpc: '2.0',
					params: [
						{
							to: contract.address,
							data: encodeFunctionData(contract.write.set(100n)),
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
		expect(result?.[0]?.topics[0]).toBe(topic1)
	})

	it('should include all log fields in response', async () => {
		const { result: filterId } = await ethNewFilterJsonRpcProcedure(client)({
			jsonrpc: '2.0',
			method: 'eth_newFilter',
			params: [{ address: contract.address }],
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
							data: encodeFunctionData(contract.write.set(999n)),
							createTransaction: true,
						},
					],
				})
			).error,
		).toBeUndefined()
		expect((await doMine()).error).toBeUndefined()

		const { result } = await ethGetFilterLogsProcedure(client)({
			jsonrpc: '2.0',
			method: 'eth_getFilterLogs',
			params: [filterId],
		})

		expect(result).toHaveLength(1)
		const log = result?.[0]
		expect(log).toHaveProperty('address')
		expect(log).toHaveProperty('topics')
		expect(log).toHaveProperty('data')
		expect(log).toHaveProperty('blockNumber')
		expect(log).toHaveProperty('transactionHash')
		expect(log).toHaveProperty('transactionIndex')
		expect(log).toHaveProperty('blockHash')
		expect(log).toHaveProperty('logIndex')
		expect(log).toHaveProperty('removed')
		expect(isHex(log?.address ?? '')).toBe(true)
		expect(isHex(log?.data ?? '')).toBe(true)
		expect(isHex(log?.blockNumber ?? '')).toBe(true)
		expect(isHex(log?.transactionHash ?? '')).toBe(true)
	})
})

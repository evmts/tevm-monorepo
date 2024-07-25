import { beforeEach, describe, expect, it } from 'vitest'
import { ethGetFilterLogsProcedure } from './ethGetFilterLogsProcedure.js'
import { createBaseClient, type BaseClient } from '@tevm/base-client'
import { callProcedure } from '../call/callProcedure.js'
import { encodeDeployData, encodeFunctionData, numberToHex, PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { SimpleContract } from '@tevm/contract'
import { createAddress, createContractAddress } from '@tevm/address'
import { mineProcedure } from '../mine/mineProcedure.js'
import { ethNewFilterJsonRpcProcedure } from './ethNewFilterProcedure.js'

describe(ethGetFilterLogsProcedure.name, () => {
	let client: BaseClient

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
		client = createBaseClient()

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
		expect(result).toMatchInlineSnapshot()
	})
})

import { AdvancedContract } from '@tevm/contract'
import { createTevmNode, type TevmNode } from '@tevm/node'
import { type Address, encodeFunctionData, PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { assert, beforeEach, describe, expect, it } from 'vitest'
import { deployHandler } from '../Deploy/deployHandler.js'
import { traceCallHandler } from './traceCallHandler.js'

describe('traceCallHandler', async () => {
	let client: TevmNode
	let contractAddress: Address

	beforeEach(async () => {
		client = createTevmNode()

		const { createdAddress } = await deployHandler(client)({
			...AdvancedContract.deploy(1n, false, 'test', PREFUNDED_ACCOUNTS[0].address),
			addToBlockchain: true,
		})
		assert(createdAddress, 'createdAddress is undefined')
		contractAddress = createdAddress
	})

	it('should execute a contract call with default tracer', async () => {
		expect(
			await traceCallHandler(client)({
				data: encodeFunctionData(AdvancedContract.write.setNumber(2n)),
				to: contractAddress,
				from: PREFUNDED_ACCOUNTS[0].address,
				gas: 16784800n,
			}),
		).toMatchSnapshot()
	})

	it('should execute a contract call with callTracer', async () => {
		expect(
			await traceCallHandler(client)({
				tracer: 'callTracer',
				data: encodeFunctionData(AdvancedContract.write.callMathHelper(2n)),
				to: contractAddress,
				from: PREFUNDED_ACCOUNTS[0].address,
				gas: 16784800n,
			}),
		).toMatchSnapshot()
	})

	it('should execute a contract call with prestateTracer and diffMode false', async () => {
		expect(
			await traceCallHandler(client)({
				tracer: 'prestateTracer',
				tracerConfig: {
					diffMode: false,
				},
				data: encodeFunctionData(AdvancedContract.write.setNumber(2n)),
				to: contractAddress,
				from: PREFUNDED_ACCOUNTS[0].address,
				gas: 16784800n,
			}),
		).toMatchSnapshot()
	})

	it('should execute a contract call with prestateTracer and diffMode true', async () => {
		expect(
			await traceCallHandler(client)({
				tracer: 'prestateTracer',
				tracerConfig: {
					diffMode: true,
				},
				data: encodeFunctionData(AdvancedContract.write.setNumber(2n)),
				to: contractAddress,
				from: PREFUNDED_ACCOUNTS[0].address,
				gas: 16784800n,
			}),
		).toMatchSnapshot()
	})

	it('should execute a contract call with 4byteTracer', async () => {
		expect(
			await traceCallHandler(client)({
				tracer: '4byteTracer',
				data: encodeFunctionData(AdvancedContract.write.setAllValues(2n, true, 'test', PREFUNDED_ACCOUNTS[0].address)),
				to: contractAddress,
				from: PREFUNDED_ACCOUNTS[0].address,
				gas: 16784800n,
			}),
		).toMatchSnapshot()
	})
})

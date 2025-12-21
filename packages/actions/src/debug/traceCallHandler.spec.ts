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

	it('should execute a contract call with flatCallTracer', async () => {
		const result = await traceCallHandler(client)({
			tracer: 'flatCallTracer',
			data: encodeFunctionData(AdvancedContract.write.callMathHelper(2n)),
			to: contractAddress,
			from: PREFUNDED_ACCOUNTS[0].address,
			gas: 16784800n,
		})
		// flatCallTracer returns a flat array of traces
		expect(Array.isArray(result)).toBe(true)
		expect(result.length).toBeGreaterThan(0)
		// First element should have traceAddress []
		expect(result[0]).toHaveProperty('traceAddress')
		expect(result[0].traceAddress).toEqual([])
		expect(result[0]).toHaveProperty('type')
		expect(result[0]).toHaveProperty('action')
		expect(result[0]).toHaveProperty('result')
	})

	it('should execute a contract call with muxTracer combining callTracer and 4byteTracer', async () => {
		const result = await traceCallHandler(client)({
			tracer: 'muxTracer',
			tracerConfig: {
				callTracer: {},
				'4byteTracer': {},
			},
			data: encodeFunctionData(AdvancedContract.write.callMathHelper(2n)),
			to: contractAddress,
			from: PREFUNDED_ACCOUNTS[0].address,
			gas: 16784800n,
		})

		// muxTracer should return an object with results for each enabled tracer
		expect(result).toHaveProperty('callTracer')
		expect(result).toHaveProperty('4byteTracer')

		// Validate callTracer result structure
		expect(result.callTracer).toHaveProperty('type')
		expect(result.callTracer).toHaveProperty('from')
		expect(result.callTracer).toHaveProperty('to')
		expect(result.callTracer).toHaveProperty('input')
		expect(result.callTracer).toHaveProperty('output')
		expect(result.callTracer).toHaveProperty('gas')
		expect(result.callTracer).toHaveProperty('gasUsed')

		// Validate 4byteTracer result structure (should be an object with selector-size keys)
		expect(typeof result['4byteTracer']).toBe('object')
	})

	it('should execute a contract call with muxTracer combining flatCallTracer and default', async () => {
		const result = await traceCallHandler(client)({
			tracer: 'muxTracer',
			tracerConfig: {
				flatCallTracer: {},
				default: {},
			},
			data: encodeFunctionData(AdvancedContract.write.setNumber(2n)),
			to: contractAddress,
			from: PREFUNDED_ACCOUNTS[0].address,
			gas: 16784800n,
		})

		// muxTracer should return an object with results for each enabled tracer
		expect(result).toHaveProperty('flatCallTracer')
		expect(result).toHaveProperty('default')

		// Validate flatCallTracer result is an array
		expect(Array.isArray(result.flatCallTracer)).toBe(true)

		// Validate default tracer result structure (structLogs)
		expect(result.default).toHaveProperty('gas')
		expect(result.default).toHaveProperty('failed')
		expect(result.default).toHaveProperty('returnValue')
		expect(result.default).toHaveProperty('structLogs')
		expect(Array.isArray(result.default.structLogs)).toBe(true)
	})

	it('should execute muxTracer with all tracers enabled', async () => {
		const result = await traceCallHandler(client)({
			tracer: 'muxTracer',
			tracerConfig: {
				callTracer: {},
				'4byteTracer': {},
				flatCallTracer: {},
				default: {},
			},
			data: encodeFunctionData(AdvancedContract.write.callMathHelper(2n)),
			to: contractAddress,
			from: PREFUNDED_ACCOUNTS[0].address,
			gas: 16784800n,
		})

		// All tracers should be present in the result
		expect(result).toHaveProperty('callTracer')
		expect(result).toHaveProperty('4byteTracer')
		expect(result).toHaveProperty('flatCallTracer')
		expect(result).toHaveProperty('default')
	})
})

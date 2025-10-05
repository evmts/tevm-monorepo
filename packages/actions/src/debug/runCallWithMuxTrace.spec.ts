import { createTevmNode, type TevmNode } from '@tevm/node'
import { encodeFunctionData, parseEther } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { dealHandler } from '../anvil/index.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { runCallWithMuxTrace } from '../internal/runCallWithMuxTrace.js'

const SENDER_ADDRESS = `0x${'1'.repeat(40)}` as const
const RECEIVER_ADDRESS = `0x${'2'.repeat(40)}` as const
const ERC20_ADDRESS = `0x${'3'.repeat(40)}` as const

// Minimal ERC20 ABI for testing
const ERC20_ABI = [
	{
		constant: true,
		inputs: [{ name: '_owner', type: 'address' }],
		name: 'balanceOf',
		outputs: [{ name: 'balance', type: 'uint256' }],
		type: 'function',
	},
	{
		constant: false,
		inputs: [
			{ name: '_to', type: 'address' },
			{ name: '_value', type: 'uint256' },
		],
		name: 'transfer',
		outputs: [{ name: 'success', type: 'bool' }],
		type: 'function',
	},
] as const

const ERC20_BYTECODE =
	'0x608060405234801561001057600080fd5b50600436106100575760003560e01c806318160ddd1461005c57806370a082311461007657806395d89b41146100a6578063a9059cbb146100c4578063dd62ed3e146100f0575b600080fd5b610064610120565b60408051918252519081900360200190f35b6100646004803603602081101561008c57600080fd5b50356001600160a01b0316610126565b6100ae610141565b6040805160208082528351818301528351919283929083019185019080838360005b838110156100e85781810151838201526020016100d0565b505050509050019250505060405180910390f35b6100646004803603602081101561011057600080fd5b50356001600160a01b0316610141565b60005481565b6001600160a01b031660009081526001602052604090205490565b60408051808201909152600481526020016020820152905600a165627a7a72305820c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a4700029'

describe('runCallWithMuxTrace', () => {
	let client: TevmNode

	beforeEach(async () => {
		client = createTevmNode({
			loggingLevel: 'warn',
		})

		// Set up test accounts
		await setAccountHandler(client)({
			address: SENDER_ADDRESS,
			balance: parseEther('100'),
		})

		await setAccountHandler(client)({
			address: ERC20_ADDRESS,
			code: ERC20_BYTECODE,
		})

		// Give sender some ERC20 tokens
		await dealHandler(client)({
			address: ERC20_ADDRESS,
			account: SENDER_ADDRESS,
			value: 1000n,
		})
	})

	describe('with prestate tracer only', () => {
		it('should return prestate trace result', async () => {
			const callParams = {
				to: ERC20_ADDRESS,
				data: encodeFunctionData({
					abi: ERC20_ABI,
					functionName: 'balanceOf',
					args: [SENDER_ADDRESS],
				}),
			}

			const muxConfig = {
				prestate: { diffMode: false },
			}

			const result = await runCallWithMuxTrace(client, callParams, muxConfig)

			expect(result).toBeDefined()
			expect(result.trace).toBeDefined()
			expect(result.trace.prestate).toBeDefined()
			expect(result.trace.call).toBeUndefined()
			expect(typeof result.trace.prestate).toBe('object')
			
			// Should contain account states
			expect(result.trace.prestate[ERC20_ADDRESS]).toBeDefined()
			expect(result.trace.prestate[ERC20_ADDRESS].code).toBeDefined()
		})

		it('should return prestate trace in diff mode', async () => {
			const callParams = {
				to: ERC20_ADDRESS,
				data: encodeFunctionData({
					abi: ERC20_ABI,
					functionName: 'transfer',
					args: [RECEIVER_ADDRESS, 100n],
				}),
				origin: SENDER_ADDRESS,
				caller: SENDER_ADDRESS,
			}

			const muxConfig = {
				prestate: { diffMode: true },
			}

			const result = await runCallWithMuxTrace(client, callParams, muxConfig)

			expect(result).toBeDefined()
			expect(result.trace).toBeDefined()
			expect(result.trace.prestate).toBeDefined()
			expect(result.trace.prestate.pre).toBeDefined()
			expect(result.trace.prestate.post).toBeDefined()
			expect(result.trace.call).toBeUndefined()
		})
	})

	describe('with call tracer only', () => {
		it('should return call trace result', async () => {
			const callParams = {
				to: ERC20_ADDRESS,
				data: encodeFunctionData({
					abi: ERC20_ABI,
					functionName: 'balanceOf',
					args: [SENDER_ADDRESS],
				}),
			}

			const muxConfig = {
				call: {},
			}

			const result = await runCallWithMuxTrace(client, callParams, muxConfig)

			expect(result).toBeDefined()
			expect(result.trace).toBeDefined()
			expect(result.trace.call).toBeDefined()
			expect(result.trace.prestate).toBeUndefined()
			
			// Should contain call trace structure
			expect(result.trace.call.type).toBeDefined()
			expect(result.trace.call.from).toBeDefined()
			expect(result.trace.call.to).toBe(ERC20_ADDRESS)
			expect(result.trace.call.gas).toBeDefined()
			expect(result.trace.call.gasUsed).toBeDefined()
		})
	})

	describe('with multiple tracers', () => {
		it('should return both prestate and call traces', async () => {
			const callParams = {
				to: ERC20_ADDRESS,
				data: encodeFunctionData({
					abi: ERC20_ABI,
					functionName: 'transfer',
					args: [RECEIVER_ADDRESS, 100n],
				}),
				origin: SENDER_ADDRESS,
				caller: SENDER_ADDRESS,
			}

			const muxConfig = {
				prestate: { diffMode: false },
				call: {},
			}

			const result = await runCallWithMuxTrace(client, callParams, muxConfig)

			expect(result).toBeDefined()
			expect(result.trace).toBeDefined()
			
			// Should contain both traces
			expect(result.trace.prestate).toBeDefined()
			expect(result.trace.call).toBeDefined()
			
			// Prestate should contain account states
			expect(typeof result.trace.prestate).toBe('object')
			expect(result.trace.prestate[ERC20_ADDRESS]).toBeDefined()
			
			// Call trace should contain call structure
			expect(result.trace.call.type).toBeDefined()
			expect(result.trace.call.from).toBe(SENDER_ADDRESS)
			expect(result.trace.call.to).toBe(ERC20_ADDRESS)
		})

		it('should return both prestate (diff mode) and call traces', async () => {
			const callParams = {
				to: ERC20_ADDRESS,
				data: encodeFunctionData({
					abi: ERC20_ABI,
					functionName: 'transfer',
					args: [RECEIVER_ADDRESS, 100n],
				}),
				origin: SENDER_ADDRESS,
				caller: SENDER_ADDRESS,
			}

			const muxConfig = {
				prestate: { diffMode: true },
				call: {},
			}

			const result = await runCallWithMuxTrace(client, callParams, muxConfig)

			expect(result).toBeDefined()
			expect(result.trace).toBeDefined()
			
			// Should contain both traces
			expect(result.trace.prestate).toBeDefined()
			expect(result.trace.call).toBeDefined()
			
			// Prestate should be in diff format
			expect(result.trace.prestate.pre).toBeDefined()
			expect(result.trace.prestate.post).toBeDefined()
			
			// Call trace should contain call structure
			expect(result.trace.call.type).toBeDefined()
			expect(result.trace.call.from).toBe(SENDER_ADDRESS)
			expect(result.trace.call.to).toBe(ERC20_ADDRESS)
		})
	})

	describe('error cases', () => {
		it('should throw error when no tracers configured', async () => {
			const callParams = {
				to: ERC20_ADDRESS,
				data: '0x',
			}

			const muxConfig = {}

			await expect(runCallWithMuxTrace(client, callParams, muxConfig)).rejects.toThrow(
				'MuxTracer requires at least one tracer to be configured'
			)
		})

		it('should handle failed calls gracefully', async () => {
			const callParams = {
				to: ERC20_ADDRESS,
				data: '0x12345678', // Invalid function selector
			}

			const muxConfig = {
				prestate: { diffMode: false },
				call: {},
			}

			const result = await runCallWithMuxTrace(client, callParams, muxConfig)

			expect(result).toBeDefined()
			expect(result.trace).toBeDefined()
			expect(result.trace.prestate).toBeDefined()
			expect(result.trace.call).toBeDefined()
			
			// Call should indicate failure
			expect(result.trace.call.output).toBeDefined()
		})
	})
})
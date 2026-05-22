import { createTevmNode, PREFUNDED_ACCOUNTS } from 'tevm'
import { callHandler } from 'tevm/actions'
import { ERC20, SimpleContract } from 'tevm/contract'
import { decodeFunctionResult, encodeDeployData, encodeFunctionData } from 'viem'
import { describe, expect, it } from 'vitest'

describe('Call API Documentation Examples', () => {
	describe('Basic Usage', () => {
		it('should execute a basic call', async () => {
			const node = createTevmNode()

			const result = await callHandler(node)({
				from: PREFUNDED_ACCOUNTS[0].address,
				to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH on mainnet
				data: '0x', // Empty call
			})

			expect(result).toBeDefined()
			expect(result.rawData).toBeDefined()
			expect(result.executionGasUsed).toBeDefined()
		})
	})

	describe('Contract Call Example', () => {
		it('should call a contract function', async () => {
			const node = createTevmNode()

			// Example ERC20 ABI for 'balanceOf'
			const abi = [
				{
					name: 'balanceOf',
					type: 'function',
					inputs: [{ name: 'account', type: 'address' }],
					outputs: [{ name: 'balance', type: 'uint256' }],
					stateMutability: 'view',
				},
			] as const

			const result = await callHandler(node)({
				to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH
				from: PREFUNDED_ACCOUNTS[0].address,
				deployedBytecode: ERC20.deployedBytecode,
				data: encodeFunctionData({
					abi,
					functionName: 'balanceOf',
					args: [PREFUNDED_ACCOUNTS[0].address],
				}),
			})

			expect(result).toBeDefined()
			const balance = decodeFunctionResult({
				abi,
				functionName: 'balanceOf',
				data: result.rawData,
			})
			expect(balance).toBeDefined()
		})
	})

	describe('Contract Deployment', () => {
		it('should deploy a contract', async () => {
			const node = createTevmNode()

			const result = await callHandler(node)({
				from: PREFUNDED_ACCOUNTS[0].address,
				data: encodeDeployData(SimpleContract.deploy(2n)),
				addToBlockchain: true,
			})

			expect(result).toBeDefined()
			expect(result.createdAddress).toBeDefined()
		})
	})

	describe('State Override', () => {
		it('should execute call with state override', async () => {
			const node = createTevmNode()

			const result = await callHandler(node)({
				from: PREFUNDED_ACCOUNTS[0].address,
				to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH
				data: '0x',
				stateOverrideSet: {
					[PREFUNDED_ACCOUNTS[0].address]: {
						balance: 4096n, // 0x1000 as bigint
						nonce: 2n,
						state: {},
					},
				},
			})

			expect(result).toBeDefined()
		})
	})

	describe('Debug Trace', () => {
		it('should create debug trace', async () => {
			const node = createTevmNode()

			const result = await callHandler(node)({
				from: PREFUNDED_ACCOUNTS[0].address,
				to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH
				data: '0x',
				createTrace: true,
			})

			expect(result).toBeDefined()
			expect(result.trace).toBeDefined()
		})
	})
})

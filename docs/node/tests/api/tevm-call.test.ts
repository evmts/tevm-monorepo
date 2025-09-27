import { createTevmNode, PREFUNDED_ACCOUNTS } from 'tevm'
import { callHandler } from 'tevm/actions'
import { decodeFunctionResult, encodeFunctionData } from 'viem'
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

			// Simple contract bytecode (returns 42)
			const bytecode =
				'0x6080604052348015600f57600080fd5b50602a60808190526040516100929190810190830190829052565b604051601f19601f830116810160405280815292829060208401853c80601f830112156100c057600080fd5b505b50505050610047806100d36000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80632096525514602d575b600080fd5b60336047565b604051603e91906059565b60405180910390f35b602a81565b6000819050919050565b6053816040565b82525050565b6000602082019050606c6000830184604c565b9291505056fea2646970667358221220f1c69e125f1a9f0c5e22a6fb4f9cb134c5b43496922c563e13731844a6e4d12d64736f6c63430008130033'

			const result = await callHandler(node)({
				from: PREFUNDED_ACCOUNTS[0].address,
				data: bytecode,
				createTransaction: true,
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
						code: '0x',
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

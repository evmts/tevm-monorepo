import { optimism } from '@tevm/common'
import { ERC20, SimpleContract } from '@tevm/contract'
import { transports } from '@tevm/test-utils'
import { EthjsAddress, hexToBytes } from '@tevm/utils'
import { encodeDeployData, testActions } from 'viem'
import { describe, expect, it } from 'vitest'
import { createMemoryClient } from '../createMemoryClient.js'
import { DaiContract } from './DaiContract.sol.js'

const contractAddress = '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1'

const addbytecode =
	'0x608060405234801561000f575f80fd5b5060043610610029575f3560e01c8063771602f71461002d575b5f80fd5b610047600480360381019061004291906100a9565b61005d565b60405161005491906100f6565b60405180910390f35b5f818361006a919061013c565b905092915050565b5f80fd5b5f819050919050565b61008881610076565b8114610092575f80fd5b50565b5f813590506100a38161007f565b92915050565b5f80604083850312156100bf576100be610072565b5b5f6100cc85828601610095565b92505060206100dd85828601610095565b9150509250929050565b6100f081610076565b82525050565b5f6020820190506101095f8301846100e7565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f61014682610076565b915061015183610076565b92508282019050808211156101695761016861010f565b5b9291505056fea2646970667358221220a172295fd4b803cacd1fb3a2580b716655e5776929c3df7de2fca459a6e7140164736f6c63430008160033'

const addabi = [
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'a',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'b',
				type: 'uint256',
			},
		],
		name: 'add',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'pure',
		type: 'function',
	},
] as const

describe('Tevm should create a local vm in JavaScript', () => {
	describe('client.script', () => {
		it('should execute scripts based on their bytecode and return the result', async () => {
			const tevm = createMemoryClient()
			const res = await tevm.tevmContract(
				ERC20.withCode(encodeDeployData(ERC20.deploy('name', 'symbol'))).read.balanceOf(
					'0x00000000000000000000000000000000000000ff',
				),
			)
			expect(res.data).toBe(0n)
			expect(res.executionGasUsed).toBe(2851n)
			expect(res.logs).toEqual([])
			expect('errors' in res).toBe(false)
			expect(res.rawData).toBe('0x0000000000000000000000000000000000000000000000000000000000000000')
			expect(res.data).toBe(0n)
			// TODO test the other properties
		})

		it('should work for add contract', async () => {
			const tevm = createMemoryClient()
			const res = await tevm.tevmContract({
				deployedBytecode: addbytecode,
				to: `0x${'45'.repeat(20)}`,
				abi: addabi,
				functionName: 'add',
				args: [1n, 2n],
			})
			expect(res.data).toBe(3n)
			expect(res.executionGasUsed).toBe(927n)
			expect(res.logs).toEqual([])
		})

		it('should support event handlers to monitor EVM execution', async () => {
			const tevm = createMemoryClient()

			// Track execution events
			const steps: Array<{ opcode: string; stackSize: number }> = []
			const contracts: Array<{ address: string }> = []
			const messages: Array<{ type: string; depth?: number; gasUsed?: bigint }> = []

			// Execute contract call with event handlers
			const result = await tevm.tevmContract({
				deployedBytecode: addbytecode,
				to: `0x${'45'.repeat(20)}`,
				abi: addabi,
				functionName: 'add',
				args: [1n, 2n],
				// Track EVM steps
				onStep: (step, next) => {
					steps.push({
						opcode: step.opcode.name,
						stackSize: step.stack.length,
					})
					next?.()
				},
				// Track new contracts
				onNewContract: (contract, next) => {
					contracts.push({
						address: contract.address.toString(),
					})
					next?.()
				},
				// Track messages
				onBeforeMessage: (message, next) => {
					messages.push({
						type: 'before',
						depth: message.depth,
					})
					next?.()
				},
				onAfterMessage: (result, next) => {
					messages.push({
						type: 'after',
						gasUsed: result.execResult.executionGasUsed,
					})
					next?.()
				},
			})

			// Verify the call executed correctly
			expect(result.data).toBe(3n)
			expect(result.executionGasUsed).toBe(927n)

			// Verify events were captured
			expect(steps.length).toBeGreaterThan(10)
			expect(messages.length).toBeGreaterThan(0)

			// Verify we have both before and after message events
			const beforeMessages = messages.filter((m) => m.type === 'before')
			const afterMessages = messages.filter((m) => m.type === 'after')
			expect(beforeMessages.length).toBeGreaterThan(0)
			expect(afterMessages.length).toBeGreaterThan(0)
			expect(messages).toMatchSnapshot()
		})
	})

	describe('client.tevmCall', () => {
		it('should execute a call on the vm', async () => {
			const tevm = createMemoryClient().extend(testActions({ mode: 'anvil' }))
			const balance = 0x11111111n
			const address1 = '0x1f420000000000000000000000000000000000ff'
			const address2 = '0x2f420000000000000000000000000000000000ff'
			await tevm.tevmSetAccount({
				address: address1,
				balance,
			})
			expect(
				(
					await tevm.tevmGetAccount({
						address: address1,
					})
				).balance,
			).toBe(balance)
			const transferAmount = 0x420n
			// TODO test other input options
			await tevm.tevmCall({
				caller: address1,
				data: '0x0',
				to: address2,
				value: transferAmount,
				origin: address1,
				createTransaction: true,
			})
			await tevm.mine({ blocks: 1 })
			expect(
				(await (await tevm.transport.tevm.getVm()).stateManager.getAccount(new EthjsAddress(hexToBytes(address2))))
					?.balance,
			).toBe(transferAmount)
			expect(
				(await (await tevm.transport.tevm.getVm()).stateManager.getAccount(new EthjsAddress(hexToBytes(address1))))
					?.balance,
			).toBe(286183069n)
			// TODO test other return properties
		})

		it('should support event handlers to monitor EVM execution', async () => {
			const tevm = createMemoryClient()

			// Track execution events
			const steps: Array<{ opcode: string; stackSize: number }> = []
			const messages: Array<{ type: string; depth?: number; gasUsed?: bigint }> = []

			// Deploy and call add contract with event handlers
			const result = await tevm.tevmContract({
				deployedBytecode: addbytecode,
				to: `0x${'45'.repeat(20)}`,
				abi: addabi,
				functionName: 'add',
				args: [1n, 2n],
				// Track EVM steps
				onStep: (step, next) => {
					steps.push({
						opcode: step.opcode.name,
						stackSize: step.stack.length,
					})
					next?.()
				},
				// Track messages
				onBeforeMessage: (message, next) => {
					messages.push({
						type: 'before',
						depth: message.depth,
					})
					next?.()
				},
				onAfterMessage: (result, next) => {
					messages.push({
						type: 'after',
						gasUsed: result.execResult.executionGasUsed,
					})
					next?.()
				},
			})

			// Verify the call executed correctly
			expect(result.data).toBe(3n)
			expect(result.executionGasUsed).toBe(927n)

			// Verify events were captured
			expect(steps.length).toBeGreaterThan(10)
			expect(messages.length).toBeGreaterThan(0)

			// Verify we have both before and after message events
			const beforeMessages = messages.filter((m) => m.type === 'before')
			const afterMessages = messages.filter((m) => m.type === 'after')
			expect(beforeMessages.length).toBeGreaterThan(0)
			expect(afterMessages.length).toBeGreaterThan(0)
		})
	})

	describe('client.contract', () => {
		it('should fork a network and then execute a contract call', async () => {
			const tevm = createMemoryClient({
				fork: { transport: transports.optimism, blockTag: 'latest' },
				common: optimism,
			})
			const res = await tevm.tevmContract({
				to: contractAddress,
				...DaiContract.read.balanceOf('0xf0d4c12a5768d806021f80a262b4d39d26c58b8d', {
					contractAddress,
				}),
			})
			// TODO: we can not do that when we can use fixed block tags without proof out of window
			expect(res.amountSpent).toBeGreaterThan(0n)
			expect(res.l1BaseFee).toBeGreaterThan(0n)
			expect(res.l1Fee).toBeGreaterThan(0n)
			expect(res.l1BlobFee).toBeGreaterThan(0n)
			expect(res.l1GasUsed).toBeGreaterThan(0n)
			res.amountSpent = 0n
			res.l1BaseFee = 0n
			res.l1Fee = 0n
			res.l1BlobFee = 0n
			res.l1GasUsed = 0n
			expect(res).toMatchSnapshot()
		})
	})

	describe('client.account', () => {
		it('should insert a new account with eth into the state', async () => {
			const tevm = createMemoryClient()
			const balance = 0x11111111n
			const account = await tevm.tevmSetAccount({
				address: '0xff420000000000000000000000000000000000ff',
				balance,
			})
			expect(account).not.toHaveProperty('errors')
		})
		it('should insert a new contract with bytecode', async () => {
			const tevm = createMemoryClient()
			const code = await tevm.tevmSetAccount({
				deployedBytecode: DaiContract.deployedBytecode,
				address: '0xff420000000000000000000000000000000000ff',
			})
			expect(code.errors).toBe(undefined as any)
		})
	})

	describe('tevmDeploy with events', () => {
		it('should track EVM events during contract deployment', async () => {
			const tevm = createMemoryClient()

			// Track execution events
			const steps: Array<{ opcode: string; stackSize: number }> = []
			const contracts: Array<{ address: string }> = []
			const messages: Array<{ type: string; depth?: number; gasUsed?: bigint }> = []

			// Deploy a contract with event handlers
			const result = await tevm.tevmDeploy({
				bytecode: SimpleContract.bytecode,
				abi: SimpleContract.abi,
				args: [42n], // Constructor argument
				// Track EVM steps
				onStep: (step, next) => {
					steps.push({
						opcode: step.opcode.name,
						stackSize: step.stack.length,
					})
					next?.()
				},
				// Track new contracts
				onNewContract: (contract, next) => {
					contracts.push({
						address: contract.address.toString(),
					})
					next?.()
				},
				// Track messages
				onBeforeMessage: (message, next) => {
					messages.push({
						type: 'before',
						depth: message.depth,
					})
					next?.()
				},
				onAfterMessage: (result, next) => {
					messages.push({
						type: 'after',
						gasUsed: result.execResult.executionGasUsed,
					})
					next?.()
				},
			})

			// Verify the deployment succeeded
			expect(result.createdAddress).toBeDefined()

			// Mine a block to include the deployment transaction
			await tevm.mine({ blocks: 1 })

			// Verify events were captured
			expect(steps.length).toBeGreaterThan(10)
			expect(messages.length).toBeGreaterThan(0)
			expect(contracts.length).toBeGreaterThan(0)

			// Verify we have both before and after message events
			const beforeMessages = messages.filter((m) => m.type === 'before')
			const afterMessages = messages.filter((m) => m.type === 'after')
			expect(beforeMessages.length).toBeGreaterThan(0)
			expect(afterMessages.length).toBeGreaterThan(0)
		})
	})
})

import { createAddress, createContractAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { SimpleContract, TestERC20 } from '@tevm/test-utils'
import { encodeDeployData, encodeFunctionData, PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { callHandler } from './callHandler.js'

const ERC20_ADDRESS = `0x${'3'.repeat(40)}` as const
const ERC20_BYTECODE = TestERC20.deployedBytecode
const ERC20_ABI = TestERC20.abi

describe('callHandler event handlers', () => {
	it('should properly handle onStep events', async () => {
		const client = createTevmNode()
		await client.ready()

		// Set up a test contract
		await setAccountHandler(client)({
			address: ERC20_ADDRESS,
			deployedBytecode: ERC20_BYTECODE,
		})

		// Create a steps tracker to verify execution
		const steps: Array<{ pc: number; opcode: string; stackSize: number }> = []

		// Execute call with onStep handler
		const result = await callHandler(client)({
			data: encodeFunctionData({
				abi: ERC20_ABI,
				functionName: 'balanceOf',
				args: [ERC20_ADDRESS],
			}),
			to: ERC20_ADDRESS,
			onStep: (step, next) => {
				// Track step information
				steps.push({
					pc: step.pc,
					opcode: step.opcode.name,
					stackSize: step.stack.length,
				})
				// Must call next to continue execution
				next?.()
			},
		})

		// Verify the call executed correctly
		expect(result.executionGasUsed).toBe(2851n)
		expect(result.errors).toBeUndefined()

		// Verify steps were tracked
		expect(steps.length).toBeGreaterThan(10) // Should have multiple steps
		expect(steps[0]).toMatchObject({
			pc: expect.any(Number),
			opcode: expect.any(String),
			stackSize: expect.any(Number),
		})
		expect(steps).toMatchSnapshot()
	})

	it('should properly handle multiple event handlers', async () => {
		const client = createTevmNode()
		await client.ready()

		// Deploy a contract that will create a new contract and emit logs
		const from = createAddress(PREFUNDED_ACCOUNTS[0].address)
		const contractAddress = createContractAddress(from, 0n)

		// Track events
		const steps: string[] = []
		const messages: Array<{ type: string; value: string; depth: number }> = []
		const contracts: string[] = []
		const results: Array<{ type: string; gasUsed: string }> = []

		// Deploy contract with event handlers
		const deployResult = await callHandler(client)({
			createTransaction: true,
			from: PREFUNDED_ACCOUNTS[0].address,
			data: encodeDeployData(SimpleContract.deploy(2n)),
			onStep: (step, next) => {
				steps.push(step.opcode.name)
				next?.()
			},
			onNewContract: (data, next) => {
				contracts.push(data.address.toString().toLowerCase())
				next?.()
			},
			onBeforeMessage: (message, next) => {
				messages.push({
					type: 'before',
					value: message.value.toString(),
					depth: message.depth,
				})
				next?.()
			},
			onAfterMessage: (result, next) => {
				results.push({
					type: 'after',
					gasUsed: result.execResult.executionGasUsed.toString(),
				})
				next?.()
			},
		})

		// Verify the deployment was successful
		expect(deployResult.createdAddress?.toLowerCase()).toBe(contractAddress.toString().toLowerCase())

		// Verify events were captured
		expect(steps.length).toBeGreaterThan(10)
		expect(contracts.length).toBe(1)
		expect(contracts[0]).toBe(contractAddress.toString().toLowerCase())
		expect(messages.length).toBeGreaterThan(0)
		expect(results.length).toBeGreaterThan(0)
	})

	// We're not really testing the executeCall implementation itself directly,
	// so let's use a simpler test approach that just verifies event handlers are passed along
	it('should properly handle and pass along event handlers', async () => {
		const client = createTevmNode()
		await client.ready()

		// Set up a simple contract for testing
		await setAccountHandler(client)({
			address: ERC20_ADDRESS,
			deployedBytecode: ERC20_BYTECODE,
		})

		// Create tracking variables to ensure callbacks were invoked
		let stepCalled = 0

		// Execute a call with an event handler
		await callHandler(client)({
			to: ERC20_ADDRESS,
			data: encodeFunctionData({
				abi: ERC20_ABI,
				functionName: 'balanceOf',
				args: [ERC20_ADDRESS],
			}),
			onStep: (_step, next) => {
				stepCalled++
				next?.()
			},
		})

		// Verify event handler was called
		expect(stepCalled).toBeGreaterThan(0)
	})

	it('should continue execution if next is not called in handler', async () => {
		// This test verifies that the VM doesn't hang if next() isn't called
		const client = createTevmNode()
		await client.ready()

		// Set up a test contract
		await setAccountHandler(client)({
			address: ERC20_ADDRESS,
			deployedBytecode: ERC20_BYTECODE,
		})

		// Execute call with onStep handler that doesn't call next
		const result = await callHandler(client)({
			data: encodeFunctionData({
				abi: ERC20_ABI,
				functionName: 'balanceOf',
				args: [ERC20_ADDRESS],
			}),
			to: ERC20_ADDRESS,
			// Intentionally omit calling next to ensure execution still completes
			onStep: (_step) => {
				// Do nothing, but don't call next
			},
		})

		// Verify the call executed correctly despite not calling next
		// This works because the VM has a default callback that continues execution
		expect(result.executionGasUsed).toBe(2851n)
		expect(result.errors).toBeUndefined()
	})
})

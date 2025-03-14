import { createTevmNode } from '@tevm/node'
import { TestERC20 } from '@tevm/test-utils'
import { EthjsAddress, encodeFunctionData, hexToBytes } from '@tevm/utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { createMemoryClient } from '../test/memoryClient.js'
import { runCallWithTrace } from './runCallWithTrace.js'

const ERC20_ADDRESS = `0x${'1'.repeat(40)}` as const
const ERC20_BYTECODE = TestERC20.deployedBytecode
const ERC20_ABI = TestERC20.abi

describe('runCallWithTrace', () => {
	let client: ReturnType<typeof createTevmNode>
	let memoryEnv: Awaited<ReturnType<typeof createMemoryClient>>

	beforeEach(async () => {
		// Create both a basic client and a memory client with predeployed contracts
		client = createTevmNode()
		await client.ready()

		// Initialize memory client with predeployed contracts
		memoryEnv = await createMemoryClient()
	})

	it('should execute a contract call with tracing', async () => {
		// Use the predeployed ERC20 from memory client
		const memoryClient = memoryEnv.client
		const erc20Address = memoryEnv.contracts.erc20.address
		const erc20Abi = memoryEnv.contracts.erc20.abi
		const aliceAddress = memoryEnv.addresses.alice

		// Call the contract with trace
		const vm = await memoryClient.getVm().then((vm) => vm.deepCopy())
		const head = await vm.blockchain.getCanonicalHeadBlock()
		await vm.stateManager.setStateRoot(head.header.stateRoot)

		const params = {
			data: hexToBytes(
				encodeFunctionData({
					abi: erc20Abi,
					functionName: 'balanceOf',
					args: [aliceAddress],
				}),
			),
			gasLimit: 16784800n,
			to: EthjsAddress.fromString(erc20Address),
			block: await vm.blockchain.getCanonicalHeadBlock(),
			origin: EthjsAddress.zero(),
			caller: EthjsAddress.zero(),
		}

		const result = await runCallWithTrace(vm, memoryClient.logger, params)

		expect(result).toHaveProperty('trace')
		expect(result.trace).toMatchObject({
			gas: expect.any(BigInt),
			returnValue: expect.any(String),
			failed: expect.any(Boolean),
			structLogs: expect.any(Array),
		})

		expect(result.execResult.returnValue).toMatchSnapshot()
		expect(result.createdAddress).toMatchSnapshot()
		expect(result.trace.gas).toMatchSnapshot()
		expect(result.trace.returnValue).toMatchSnapshot()
		expect(result.trace.structLogs).toMatchSnapshot()
	})

	it('should support lazy tracing mode', async () => {
		// For the basic testing of lazy mode, we can use the standard client
		await setAccountHandler(client)({
			address: ERC20_ADDRESS,
			deployedBytecode: ERC20_BYTECODE,
		})

		const vm = await client.getVm().then((vm) => vm.deepCopy())
		const head = await vm.blockchain.getCanonicalHeadBlock()
		await vm.stateManager.setStateRoot(head.header.stateRoot)

		const params = {
			data: hexToBytes(
				encodeFunctionData({
					abi: ERC20_ABI,
					functionName: 'balanceOf',
					args: [ERC20_ADDRESS],
				}),
			),
			gasLimit: 16784800n,
			to: EthjsAddress.fromString(ERC20_ADDRESS),
			block: await vm.blockchain.getCanonicalHeadBlock(),
			origin: EthjsAddress.zero(),
			caller: EthjsAddress.zero(),
		}

		// Use lazyRun=true option
		const lazyResult = await runCallWithTrace(vm, client.logger, params, true)

		// When in lazy mode, only trace property should be present
		expect(lazyResult).toHaveProperty('trace')
		expect(lazyResult.trace).toMatchObject({
			gas: 0n, // Should be 0 since execution hasn't happened yet
			returnValue: '0x0',
			failed: false,
			structLogs: [],
		})

		// Should not have other execution result properties
		expect(lazyResult.execResult).toBeUndefined()
		expect(lazyResult.createdAddress).toBeUndefined()
	})

	it('should trace contract calls that throw exceptions', async () => {
		// Deploy a contract that will throw an exception
		const INVALID_CONTRACT_ADDRESS = `0x${'2'.repeat(40)}` as const

		// This is a simple contract with a function that always reverts
		const INVALID_CONTRACT_BYTECODE =
			'0x6080604052348015600f57600080fd5b5060878061001e6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063d10e73ab14602d575b600080fd5b60336035565b005b600080fdfe' as const

		// Use a fresh client to avoid interfering with other tests
		const localClient = createTevmNode()
		await localClient.ready()

		await setAccountHandler(localClient)({
			address: INVALID_CONTRACT_ADDRESS,
			deployedBytecode: INVALID_CONTRACT_BYTECODE,
		})

		const vm = await localClient.getVm().then((vm) => vm.deepCopy())
		const head = await vm.blockchain.getCanonicalHeadBlock()
		await vm.stateManager.setStateRoot(head.header.stateRoot)

		const params = {
			data: hexToBytes('0xd10e73ab'), // Function selector for a function that always reverts
			gasLimit: 16784800n,
			to: EthjsAddress.fromString(INVALID_CONTRACT_ADDRESS),
			block: await vm.blockchain.getCanonicalHeadBlock(),
			origin: EthjsAddress.zero(),
			caller: EthjsAddress.zero(),
		}

		const result = await runCallWithTrace(vm, localClient.logger, params)

		// Check for execution error
		expect(result.execResult.exceptionError).toBeDefined()

		// Check for structs logs
		expect(result.trace.structLogs.length).toBeGreaterThan(0)
	})

	it('should trace contract creation', async () => {
		// Use a fresh standalone client
		const localClient = createTevmNode()
		await localClient.ready()

		const vm = await localClient.getVm().then((vm) => vm.deepCopy())
		const head = await vm.blockchain.getCanonicalHeadBlock()
		await vm.stateManager.setStateRoot(head.header.stateRoot)

		// Contract creation call (no 'to' field)
		const params = {
			data: hexToBytes(ERC20_BYTECODE),
			gasLimit: 16784800n,
			// No 'to' field for contract creation
			value: 0n,
			block: await vm.blockchain.getCanonicalHeadBlock(),
			origin: EthjsAddress.zero(),
			caller: EthjsAddress.zero(),
		}

		const result = await runCallWithTrace(vm, localClient.logger, params)

		// Should have created a contract address
		expect(result.createdAddress).toBeDefined()

		// Should have structLogs for contract creation
		expect(result.trace.structLogs.length).toBeGreaterThan(0)

		// First opcode should typically be a contract creation opcode
		expect(result.trace.structLogs[0]?.op).toBeDefined()
	})

	it('should handle dynamic gas costs in opcodes correctly', async () => {
		// Use a fresh client with the ERC20 contract
		await setAccountHandler(client)({
			address: ERC20_ADDRESS,
			deployedBytecode: ERC20_BYTECODE,
		})

		// Spy on vm.evm.events.on
		const evmEventsSpy = {
			on: vi.fn().mockImplementation((event, callback) => {
				if (event === 'step') {
					// Mock a step with dynamic fee
					const mockStep = {
						pc: 10,
						opcode: {
							name: 'SSTORE', // SSTORE has dynamic fees
							fee: 5000,
							dynamicFee: 15000n,
						},
						gasLeft: 100000n,
						depth: 1,
						stack: [1n, 2n, 3n],
					}
					callback(mockStep, () => {})
				}
				if (event === 'afterMessage') {
					// Mock afterMessage with no error
					callback({ execResult: {} }, () => {})
				}
			}),
		}

		// Create a mock VM with the spied events
		const mockVm = {
			evm: {
				events: evmEventsSpy,
				runCall: vi.fn().mockResolvedValue({
					execResult: {
						executionGasUsed: 25000n,
						returnValue: new Uint8Array([1, 2, 3]),
						exceptionError: undefined,
					},
				}),
			},
		}

		const params = {
			data: hexToBytes('0x12345678'),
			gasLimit: 100000n,
			to: EthjsAddress.fromString(ERC20_ADDRESS),
		}

		const result = await runCallWithTrace(mockVm as any, client.logger, params)

		// Should include both base fee and dynamic fee in gasCost
		expect(result.trace.structLogs[0]?.gasCost).toBe(5000n + 15000n)
	})

	it('should handle errors in afterMessage events', async () => {
		// Spy on vm.evm.events.on
		const evmEventsSpy = {
			on: vi.fn().mockImplementation((event, callback) => {
				if (event === 'step') {
					// First push a normal step
					const mockStep1 = {
						pc: 10,
						opcode: { name: 'PUSH1', fee: 3 },
						gasLeft: 99997n,
						depth: 1,
						stack: [1n],
					}
					callback(mockStep1, () => {})

					// Then push a step that will be marked as error
					const mockStep2 = {
						pc: 12,
						opcode: { name: 'REVERT', fee: 0 },
						gasLeft: 99994n,
						depth: 1,
						stack: [0n, 0n],
					}
					callback(mockStep2, () => {})
				}
				if (event === 'afterMessage') {
					// Mock afterMessage with an error
					callback(
						{
							execResult: {
								exceptionError: { error: 'REVERT', message: 'Reverted' },
							},
						},
						() => {},
					)
				}
			}),
		}

		// Create a mock VM with the spied events
		const mockVm = {
			evm: {
				events: evmEventsSpy,
				runCall: vi.fn().mockResolvedValue({
					execResult: {
						executionGasUsed: 10000n,
						returnValue: new Uint8Array([]),
						exceptionError: { error: 'REVERT', message: 'Reverted' },
					},
				}),
			},
		}

		const params = {
			data: hexToBytes('0x12345678'),
			gasLimit: 100000n,
			to: EthjsAddress.fromString(ERC20_ADDRESS),
		}

		const result = await runCallWithTrace(mockVm as any, client.logger, params)

		// The failed flag should be true
		expect(result.trace.failed).toBe(true)

		// The last opcode in the trace should have the error property set
		const lastLog = result.trace.structLogs[result.trace.structLogs.length - 1]
		expect(lastLog?.error).toEqual({ error: 'REVERT', message: 'Reverted' })
	})
})

import { createTevmNode } from '@tevm/node'
import { TestERC20 } from '@tevm/test-utils'
import { EthjsAddress, encodeFunctionData, hexToBytes } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { getAccountHandler } from '../GetAccount/getAccountHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { runCallWithTrace } from './runCallWithTrace.js'

const ERC20_ADDRESS = `0x${'1'.repeat(40)}` as const
const ERC20_BYTECODE = TestERC20.deployedBytecode
const ERC20_ABI = TestERC20.abi

describe('runCallWithTrace', () => {
	let client: ReturnType<typeof createTevmNode>

	beforeEach(async () => {
		client = createTevmNode()
		await client.ready()
	})

	it('should execute a contract call with tracing', async () => {
		expect(
			(
				await setAccountHandler(client)({
					address: ERC20_ADDRESS,
					deployedBytecode: ERC20_BYTECODE,
				})
			).errors,
		).toBeUndefined()

		expect(
			await getAccountHandler(client)({
				address: ERC20_ADDRESS,
			}),
		).toMatchObject({
			address: ERC20_ADDRESS,
			deployedBytecode: ERC20_BYTECODE,
		})

		// Call the contract with trace
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

		const result = await runCallWithTrace(vm, client.logger, params)
		expect(result.trace).toMatchSnapshot()
	})

	it('should support lazy tracing mode', async () => {
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

		const lazyResult = await runCallWithTrace(vm, client.logger, params, true)

		expect(lazyResult.trace).toMatchObject({
			gas: 0n,
			returnValue: '0x0',
			failed: false,
			structLogs: [],
		})

		expect(lazyResult.execResult).toBeUndefined()
		expect(lazyResult.createdAddress).toBeUndefined()
	})

	it('should trace contract creation', async () => {
		const vm = await client.getVm().then((vm) => vm.deepCopy())
		const head = await vm.blockchain.getCanonicalHeadBlock()
		await vm.stateManager.setStateRoot(head.header.stateRoot)

		const params = {
			data: hexToBytes(ERC20_BYTECODE),
			gasLimit: 16784800n,
			value: 0n,
			block: await vm.blockchain.getCanonicalHeadBlock(),
			origin: EthjsAddress.zero(),
			caller: EthjsAddress.zero(),
		}

		const result = await runCallWithTrace(vm, client.logger, params)
		expect(result.createdAddress).toBeDefined()
	})
})

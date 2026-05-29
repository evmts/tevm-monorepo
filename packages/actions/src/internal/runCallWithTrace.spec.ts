import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { TestERC20 } from '@tevm/test-utils'
import { encodeFunctionData, hexToBytes } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
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

		// @ts-expect-error: Monorepo type conflict: TevmNode from source (/src) conflicts with the matcher's type from compiled output (/dist).
		await expect(ERC20_ADDRESS).toHaveState(client, {
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
			to: createAddress(ERC20_ADDRESS),
			block: await vm.blockchain.getCanonicalHeadBlock(),
			origin: createAddress(0),
			caller: createAddress(0),
		}

		const result = await runCallWithTrace(vm, client.logger, params)
		expect(result.trace).toMatchSnapshot()
	})

	it('should report per-step gasCost as the full opcode cost (not double-counting the base fee) and 1-based depth', async () => {
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
			to: createAddress(ERC20_ADDRESS),
			block: await vm.blockchain.getCanonicalHeadBlock(),
			origin: createAddress(0),
			caller: createAddress(0),
		}

		const result = await runCallWithTrace(vm, client.logger, params)

		// PUSH1 costs exactly 3 gas. The bug double-counted the base fee, reporting 6n.
		const firstPush = result.trace.structLogs[0]
		expect(firstPush?.op).toBe('PUSH1')
		expect(firstPush?.gasCost).toBe(3n)

		// gasCost for each step must equal the gas actually consumed (the drop in remaining gas to the next step).
		for (let i = 0; i < result.trace.structLogs.length - 1; i++) {
			const current = result.trace.structLogs[i]
			const next = result.trace.structLogs[i + 1]
			// Only compare consecutive steps at the same depth (no call/return frame change in between).
			if (current && next && current.depth === next.depth) {
				expect(current.gasCost).toBe(current.gas - next.gas)
			}
		}

		// geth uses 1-based depth: the top-level frame must be depth 1, never 0.
		for (const log of result.trace.structLogs) {
			expect(log.depth).toBeGreaterThanOrEqual(1)
		}
		expect(result.trace.structLogs[0]?.depth).toBe(1)
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
			to: createAddress(ERC20_ADDRESS),
			block: await vm.blockchain.getCanonicalHeadBlock(),
			origin: createAddress(0),
			caller: createAddress(0),
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
			origin: createAddress(0),
			caller: createAddress(0),
		}

		const result = await runCallWithTrace(vm, client.logger, params)
		expect(result.createdAddress).toBeDefined()
	})
})

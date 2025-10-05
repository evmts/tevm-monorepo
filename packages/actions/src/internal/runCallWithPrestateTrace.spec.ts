import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { TestERC20 } from '@tevm/test-utils'
import { encodeFunctionData, hexToBytes, parseEther } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { dealHandler } from '../anvil/index.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { runCallWithPrestateTrace } from './runCallWithPrestateTrace.js'

const ERC20_ADDRESS = `0x${'1'.repeat(40)}` as const
const CALLER_ADDRESS = `0x${'2'.repeat(40)}` as const
const RECIPIENT_ADDRESS = `0x${'3'.repeat(40)}` as const
const ERC20_BYTECODE = TestERC20.deployedBytecode
const ERC20_ABI = TestERC20.abi

// This doesn't test contract creation, multiple accounts changed, as these are relevant to the access list and not this tracer.
describe('runCallWithPrestateTrace', () => {
	let client: ReturnType<typeof createTevmNode>

	beforeEach(async () => {
		client = createTevmNode()
		await client.ready()

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

		expect(
			(
				await dealHandler(client)({
					erc20: ERC20_ADDRESS,
					account: CALLER_ADDRESS,
					amount: 100n,
				})
			).errors,
		).toBeUndefined()

		expect(
			(
				await dealHandler(client)({
					account: CALLER_ADDRESS,
					amount: parseEther('1'),
				})
			).errors,
		).toBeUndefined()
	})

	it('should trace a contract call with prestate tracer in normal mode', async () => {
		const vm = await client.getVm().then((vm) => vm.deepCopy())
		const head = await vm.blockchain.getCanonicalHeadBlock()
		await vm.stateManager.setStateRoot(head.header.stateRoot)

		// Call transfer function which modifies storage
		const params = {
			data: hexToBytes(
				encodeFunctionData({
					abi: ERC20_ABI,
					functionName: 'transfer',
					args: [RECIPIENT_ADDRESS, 100n],
				}),
			),
			gasLimit: 1000000n,
			to: createAddress(ERC20_ADDRESS),
			block: head,
			origin: createAddress(CALLER_ADDRESS),
			caller: createAddress(CALLER_ADDRESS),
		}

		const result = await runCallWithPrestateTrace(client, params, false)
		expect(result.trace).toMatchSnapshot()
	})

	it('should trace a contract call with prestate tracer in diff mode', async () => {
		const vm = await client.getVm().then((vm) => vm.deepCopy())
		const head = await vm.blockchain.getCanonicalHeadBlock()
		await vm.stateManager.setStateRoot(head.header.stateRoot)

		// Call transfer function which modifies storage
		const params = {
			data: hexToBytes(
				encodeFunctionData({
					abi: ERC20_ABI,
					functionName: 'transfer',
					args: [RECIPIENT_ADDRESS, 100n],
				}),
			),
			gasLimit: 1000000n,
			to: createAddress(ERC20_ADDRESS),
			block: head,
			origin: createAddress(CALLER_ADDRESS),
			caller: createAddress(CALLER_ADDRESS),
		}

		const result = await runCallWithPrestateTrace(client, params, true)
		expect(result.trace).toMatchSnapshot()
	})
})

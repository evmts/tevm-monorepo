import { describe, expect, it } from 'bun:test'
import { createBaseClient } from '@tevm/base-client'
import { TestERC20 } from '@tevm/test-utils'
import { encodeFunctionData, hexToBytes } from '@tevm/utils'
import { EthjsAddress } from '@tevm/utils'
import { runCallWithTrace } from './runCallWithTrace.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { getAccountHandler } from '../GetAccount/getAccountHandler.js'

const ERC20_ADDRESS = `0x${'1'.repeat(40)}` as const
const ERC20_BYTECODE = TestERC20.deployedBytecode
const ERC20_ABI = TestERC20.abi

describe('runCallWithTrace', () => {
	it('should execute a contract call with tracing', async () => {
		const client = createBaseClient()

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
})

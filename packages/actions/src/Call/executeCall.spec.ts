import { createBaseClient } from '@tevm/base-client'
import { EvmRevertError, InvalidGasPriceError, RevertError } from '@tevm/errors'
import { TestERC20 } from '@tevm/test-utils'
import { EthjsAddress, encodeFunctionData, hexToBytes } from '@tevm/utils'
import { parseEther } from 'viem'
import { describe, expect, it } from 'vitest'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { executeCall } from './executeCall.js'

const ERC20_ADDRESS = `0x${'3'.repeat(40)}` as const
const ERC20_BYTECODE = TestERC20.deployedBytecode
const ERC20_ABI = TestERC20.abi

describe('executeCall', () => {
	it('should execute a contract call successfully', async () => {
		const client = createBaseClient()
		expect(
			(
				await setAccountHandler(client)({
					address: ERC20_ADDRESS,
					deployedBytecode: ERC20_BYTECODE,
				})
			).errors,
		).toBeUndefined()

		const evmInput = {
			data: hexToBytes(
				encodeFunctionData({
					abi: ERC20_ABI,
					functionName: 'balanceOf',
					args: [ERC20_ADDRESS],
				}),
			),
			gasLimit: 16784800n,
			to: EthjsAddress.fromString(ERC20_ADDRESS),
			origin: EthjsAddress.zero(),
			caller: EthjsAddress.zero(),
			block: await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock()),
		}

		const result = await executeCall(client, evmInput, { createAccessList: true, createTrace: true })
		if ('errors' in result) {
			throw result.errors
		}
		expect(result.runTxResult).toBeDefined()
		expect(result.runTxResult.execResult.executionGasUsed).toBe(2851n)
		expect(result.trace).toBeDefined()
		expect(result.accessList).toBeDefined()
		expect(result.trace).toMatchSnapshot()
		expect(result.accessList).toMatchSnapshot()
	})

	it('should handle contract call errors', async () => {
		const client = createBaseClient()
		const vm = await client.getVm()
		const caller = `0x${'23'.repeat(20)}` as const
		expect(
			(
				await setAccountHandler(client)({
					address: ERC20_ADDRESS,
					deployedBytecode: ERC20_BYTECODE,
				})
			).errors,
		).toBeUndefined()
		expect(
			(
				await setAccountHandler(client)({
					address: caller,
					balance: parseEther('100'),
				})
			).errors,
		).toBeUndefined()
		const notCaller = `0x${'32'.repeat(20)}` as const
		const evmInput = {
			data: hexToBytes(
				encodeFunctionData({
					abi: ERC20_ABI,
					functionName: 'transferFrom',
					args: [notCaller, caller, 90n],
				}),
			),
			to: EthjsAddress.fromString(ERC20_ADDRESS),
			origin: EthjsAddress.fromString(caller),
			from: EthjsAddress.fromString(caller),
			gasLimit: 16784800n,
			block: await vm.blockchain.getCanonicalHeadBlock(),
		}
		const result = await executeCall(client, evmInput, { createAccessList: true, createTrace: true })
		if (!('errors' in result)) {
			throw 'should have errors'
		}
		expect(result.errors).toBeDefined()
		expect(result.errors[0].message).toBe(
			'revert\n\nDocs: https://tevm.sh/reference/tevm/errors/classes/reverterror/\nDetails: {"error":"revert","errorType":"EvmError"}\nVersion: 1.1.0.next-73',
		)
		expect(result.errors[0]).toBeInstanceOf(EvmRevertError)
		expect(result.errors[0]).toBeInstanceOf(RevertError)
		expect(result.errors[0].code).toBe(-32000)
		expect(result.errors[0].name).toBe('EvmRevertError')
	})

	it('should handle gas price too low error', async () => {
		const client = createBaseClient()
		const to = `0x${'33'.repeat(20)}` as const

		const evmInput = {
			data: hexToBytes(
				encodeFunctionData({
					abi: ERC20_ABI,
					functionName: 'balanceOf',
					args: [to],
				}),
			),
			to: EthjsAddress.fromString(to),
			origin: EthjsAddress.zero(),
			caller: EthjsAddress.zero(),
			gasLimit: 16784800n,
			block: await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock()),
		}

		const result = await executeCall(client, evmInput, { createAccessList: true, maxFeePerGas: 1n })
		if (!('errors' in result)) {
			throw 'should have errors'
		}
		expect(result.errors).toBeDefined()
		expect(result.errors[0]).toBeInstanceOf(InvalidGasPriceError)
		expect(result.errors[0].name).toBe('InvalidGasPrice')
		expect(result.errors[0].code).toBe(-32012)
		expect(result.errors[0].message).toMatchSnapshot()
	})
})

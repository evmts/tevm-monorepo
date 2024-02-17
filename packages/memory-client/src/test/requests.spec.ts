import { createMemoryClient } from '../createMemoryClient.js'
import { DaiContract } from './DaiContract.sol.js'
import { Address, bigIntToHex } from '@ethereumjs/util'
import type {
	ContractJsonRpcRequest,
	ScriptJsonRpcRequest,
} from '@tevm/procedures-types'
import {
	decodeFunctionResult,
	encodeFunctionData,
	hexToBigInt,
	hexToBytes,
	keccak256,
	toHex,
} from '@tevm/utils'
import { describe, expect, it } from 'bun:test'

const contractAddress = '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1'

const forkConfig = {
	url: 'https://mainnet.optimism.io',
	blockTag: 111791332n,
}

describe('Tevm.request', async () => {
	const tevm = await createMemoryClient()

	it('should execute a script request', async () => {
		const req = {
			params: [
				{
					data: encodeFunctionData(
						DaiContract.read.balanceOf(contractAddress, {
							contractAddress,
						}),
					),
					deployedBytecode: DaiContract.deployedBytecode,
				},
			],
			jsonrpc: '2.0',
			method: 'tevm_script',
			id: 1,
		} as const satisfies ScriptJsonRpcRequest
		const res = await tevm.request(req)
		if ('error' in res) {
			throw new Error(res.error.message)
		}
		expect(
			decodeFunctionResult({
				abi: DaiContract.abi,
				data: res.result.rawData,
				functionName: 'balanceOf',
			}) satisfies bigint,
		).toBe(0n)
		expect(res.result.executionGasUsed).toBe(bigIntToHex(2447n) as any)
		expect(res.result.logs).toEqual([])
		expect(res.method).toBe(req.method)
		expect(res.id).toBe(req.id)
		expect(res.jsonrpc).toBe(req.jsonrpc)
	})

	it('should throw an error if attempting a tevm_contractCall request', async () => {
		const tevm = await createMemoryClient()
		const req = {
			params: [
				{
					data: encodeFunctionData(
						DaiContract.read.balanceOf(contractAddress, {
							contractAddress,
						}),
					),
					to: contractAddress,
				},
			],
			jsonrpc: '2.0',
			method: 'tevm_NotARequest' as any,
			id: 1,
		} as const satisfies ContractJsonRpcRequest
		const res = await tevm.request(req)
		expect(res.error.code).toMatchSnapshot()
		expect(res.error.message).toMatchSnapshot()
	})

	it('should execute a contractCall request via using tevm_call', async () => {
		const tevm = await createMemoryClient({
			fork: forkConfig,
		})
		const req = {
			params: [
				{
					data: encodeFunctionData(
						DaiContract.read.balanceOf(
							'0xf0d4c12a5768d806021f80a262b4d39d26c58b8d',
							{
								contractAddress,
							},
						),
					),
					to: contractAddress,
					blockTag:
						'0xf5a353db0403849f5d9fe0bb78df4920556fc5729111540a13303cb538f0fc10',
				},
			],
			jsonrpc: '2.0',
			method: 'tevm_call',
			id: 1,
		} as const satisfies ContractJsonRpcRequest
		const res = await tevm.request(req)
		if ('error' in res) {
			throw new Error(res.error.message)
		}
		expect(
			decodeFunctionResult({
				data: res.result.rawData,
				abi: DaiContract.abi,
				functionName: 'balanceOf',
			}) satisfies bigint,
		).toBe(1n)
		expect(hexToBigInt(res.result.executionGasUsed)).toBe(2447n)
		expect(res.result.logs).toEqual([])
		expect(res.method).toBe(req.method)
		expect(res.id).toBe(req.id)
		expect(res.jsonrpc).toBe(req.jsonrpc)
	})

	it('should execute a call request', async () => {
		const tevm = await createMemoryClient()
		const balance = 0x11111111n
		const address1 = '0x1f420000000000000000000000000000000000ff'
		const address2 = '0x2f420000000000000000000000000000000000ff'
		await tevm.setAccount({
			address: address1,
			balance,
		})
		const transferAmount = 0x420n
		const res = await tevm.request({
			params: [
				{
					caller: address1,
					data: '0x0',
					to: address2,
					value: toHex(transferAmount),
					origin: address1,
					createTransaction: true,
				},
			],
			jsonrpc: '2.0',
			method: 'tevm_call',
			id: 1,
		})
		expect(res.jsonrpc).toBe('2.0')
		expect(res.id).toBe(1)
		expect(res.method).toBe('tevm_call')
		if ('error' in res) throw new Error(res.error.message)
		expect(res.result.errors).toBeUndefined()
		expect(res.result.rawData).toEqual('0x')
		expect(
			(await tevm.vm.stateManager.getAccount(new Address(hexToBytes(address2))))
				?.balance,
		).toBe(transferAmount)
		expect(
			(await tevm.vm.stateManager.getAccount(new Address(hexToBytes(address1))))
				?.balance,
		).toBe(balance - transferAmount)
	})

	it('Should execute a putAccount request', async () => {
		const tevm = await createMemoryClient()
		const balance = 0x11111111n
		const res = await tevm.request({
			jsonrpc: '2.0',
			method: 'tevm_setAccount',
			id: 1,
			params: [
				{
					address: '0xff420000000000000000000000000000000000ff',
					balance: toHex(balance),
					deployedBytecode: DaiContract.deployedBytecode,
				},
			],
		})
		expect(res).not.toHaveProperty('error')
		const account = await tevm.vm.stateManager.getAccount(
			Address.fromString('0xff420000000000000000000000000000000000ff'),
		)
		expect(account?.balance).toEqual(balance)
		expect(account?.codeHash).toEqual(
			hexToBytes(keccak256(DaiContract.deployedBytecode)),
		)
	})
})

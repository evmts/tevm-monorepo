import { createTevm } from '../createTevm.js'
import { DaiContract } from './DaiContract.sol.js'
import { Address } from '@ethereumjs/util'
import type { ContractJsonRpcRequest, ScriptJsonRpcRequest } from '@tevm/api'
import { describe, expect, it } from 'bun:test'
import { hexToBytes } from 'viem'

const contractAddress = '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1'

const forkConfig = {
	url: 'https://mainnet.optimism.io',
	blockTag: 111791332n,
}

describe('Tevm.request', async () => {
	const tevm = await createTevm()

	it('should execute a script request', async () => {
		const req = {
			params: DaiContract.script.balanceOf(
				'0x00000000000000000000000000000000000000ff',
			),
			jsonrpc: '2.0',
			method: 'tevm_script',
			id: 1,
		} as const satisfies ScriptJsonRpcRequest
		const res = await tevm.request(req)
		if ('error' in res) {
			throw new Error(res.error.message)
		}
		expect(res.result.data satisfies bigint).toBe(0n)
		expect(res.result.executionGasUsed satisfies BigInt).toBe(2447n)
		expect(res.result.logs).toEqual([])
		expect(res.method).toBe(req.method)
		expect(res.id).toBe(req.id)
		expect(res.jsonrpc).toBe(req.jsonrpc)
	})

	it.only('should execute a contractCall request', async () => {
		const tevm = await createTevm({
			fork: forkConfig,
		})
		const req = {
			params: {
				to: contractAddress,
				...DaiContract.read.balanceOf(
					'0xf0d4c12a5768d806021f80a262b4d39d26c58b8d',
					{
						contractAddress,
					},
				),
			},
			jsonrpc: '2.0',
			method: 'tevm_contract',
			id: 1,
		} as const satisfies ContractJsonRpcRequest
		const res = await tevm.request(req)
		if ('error' in res) {
			throw new Error(res.error.message)
		}
		expect(res.result.data satisfies bigint).toBe(1n)
		expect(res.result.executionGasUsed).toBe(2447n)
		expect(res.result.logs).toEqual([])
		expect(res.method).toBe(req.method)
		expect(res.id).toBe(req.id)
		expect(res.jsonrpc).toBe(req.jsonrpc)
	})

	it('should execute a call request', async () => {
		const tevm = await createTevm()
		const balance = 0x11111111n
		const address1 = '0x1f420000000000000000000000000000000000ff'
		const address2 = '0x2f420000000000000000000000000000000000ff'
		await tevm.account({
			address: address1,
			balance,
		})
		const transferAmount = 0x420n
		const res = await tevm.request({
			params: {
				caller: address1,
				data: '0x0',
				to: address2,
				value: transferAmount,
				origin: address1,
			},
			jsonrpc: '2.0',
			method: 'tevm_call',
			id: 1,
		})
		expect(res.jsonrpc).toBe('2.0')
		expect(res.id).toBe(1)
		expect(res.method).toBe('tevm_call')
		if ('error' in res) throw new Error(res.error.message)
		expect(res.result.errors).toBeUndefined()
		expect(res.result.rawData).toEqual('0x0')
		expect(
			(
				await tevm._evm.stateManager.getAccount(
					new Address(hexToBytes(address2)),
				)
			)?.balance,
		).toBe(transferAmount)
		expect(
			(
				await tevm._evm.stateManager.getAccount(
					new Address(hexToBytes(address1)),
				)
			)?.balance,
		).toBe(balance - transferAmount)
	})

	it('Should execute a putAccount request', async () => {
		const tevm = await createTevm()
		const balance = 0x11111111n
		const res = await tevm.request({
			jsonrpc: '2.0',
			method: 'tevm_account',
			id: 1,
			params: {
				address: '0xff420000000000000000000000000000000000ff',
				balance,
			},
		})
		expect(res).not.toHaveProperty('error')
	})
})

import { createTevm } from '../createTevm.js'
import { DaiContract } from './DaiContract.sol.js'
import { Address } from '@ethereumjs/util'
import type { TevmContractCallRequest, TevmScriptRequest } from '@tevm/jsonrpc'
import { describe, expect, it } from 'bun:test'
import { hexToBytes } from 'viem'

const contractAddress = '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1'

const forkConfig = {
	url: 'https://mainnet.optimism.io',
	blockTag: 111791332n,
}

describe('Tevm.prototype.request', async () => {
	const tevm = await createTevm()

	it('should execute a script request', async () => {
		const req = {
			params: DaiContract.script.balanceOf(
				'0x00000000000000000000000000000000000000ff',
			),
			jsonrpc: '2.0',
			method: 'tevm_script',
			id: 1,
		} as const satisfies TevmScriptRequest
		const res = await tevm.request(req)
		expect(res.result.data satisfies bigint).toBe(0n)
		expect(res.result.gasUsed satisfies BigInt).toBe(2447n)
		expect(res.result.logs).toEqual([])
		expect(res.method).toBe(req.method)
		expect(res.id).toBe(req.id)
		expect(res.jsonrpc).toBe(req.jsonrpc)
	})

	it('should execute a contractCall request', async () => {
		const tevm = await createTevm({
			fork: forkConfig,
		})
		const req = {
			params: DaiContract.read.balanceOf(
				'0xf0d4c12a5768d806021f80a262b4d39d26c58b8d',
				{
					contractAddress,
				},
			),
			jsonrpc: '2.0',
			method: 'tevm_contractCall',
			id: 1,
		} as const satisfies TevmContractCallRequest
		const res = await tevm.request(req)
		expect(res.result.data satisfies bigint).toBe(1n)
		expect(res.result.gasUsed).toBe(2447n)
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
		await tevm.putAccount({
			account: address1,
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
		expect(res.result.execResult.exceptionError).toBeUndefined()
		expect(res.result.execResult.returnValue).toEqual(Uint8Array.of())
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
			method: 'tevm_putAccount',
			id: 1,
			params: {
				account: '0xff420000000000000000000000000000000000ff',
				balance,
			},
		})
		expect(res.result.balance).toBe(balance)
		expect(res.jsonrpc).toBe('2.0')
		expect(res.id).toBe(1)
		expect(res.method).toBe('tevm_putAccount')
	})

	it('Should execute a putContractCode request', async () => {
		const tevm = await createTevm()
		const res = await tevm.request({
			id: 1,
			method: 'tevm_putContractCode',
			jsonrpc: '2.0',
			params: {
				deployedBytecode: DaiContract.deployedBytecode,
				contractAddress: '0xff420000000000000000000000000000000000ff',
			},
		})
		expect(res.result).toHaveLength(4782)
		expect(res.jsonrpc).toBe('2.0')
		expect(res.id).toBe(1)
		expect(res.method).toBe('tevm_putContractCode')
	})
})

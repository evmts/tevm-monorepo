import { ERC20 } from '@tevm/contract'
import { type TevmNode, createTevmNode } from '@tevm/node'
import { EthjsAddress, bytesToHex, keccak256, numberToHex } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import type { SetAccountJsonRpcRequest } from './SetAccountJsonRpcRequest.js'
import { setAccountProcedure } from './setAccountProcedure.js'

let client: TevmNode
const ERC20_ADDRESS = `0x${'69'.repeat(20)}` as const

beforeEach(() => {
	client = createTevmNode()
})

describe('setAccountProcedure', () => {
	it('should set account with provided parameters', async () => {
		const request: SetAccountJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'tevm_setAccount',
			id: 1,
			params: [
				{
					address: ERC20_ADDRESS,
					deployedBytecode: ERC20.deployedBytecode,
					balance: numberToHex(420n),
					nonce: numberToHex(69n),
				},
			],
		}
		const response = await setAccountProcedure(client)(request)
		expect(response.error).toBeUndefined()

		const account = await (await client.getVm()).stateManager.getAccount(createAddress(ERC20_ADDRESS))

		if (!account) throw new Error('Account not found')

		expect(bytesToHex(account.codeHash)).toBe(keccak256(ERC20.deployedBytecode))
		expect(account.balance).toBe(420n)
		expect(account.nonce).toBe(69n)
	})

	it('should handle errors correctly', async () => {
		const request: SetAccountJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'tevm_setAccount',
			id: 1,
			params: [
				{
					address: '0xInvalidAddress',
					deployedBytecode: ERC20.deployedBytecode,
					balance: numberToHex(420n),
					nonce: numberToHex(69n),
				},
			],
		}
		const response = await setAccountProcedure(client)(request)
		expect(response.error).toBeDefined()
		if (!response.error) throw new Error('Expected error')
		expect(response.error).toMatchSnapshot()
		expect(response.method).toBe('tevm_setAccount')
		expect(response.id).toBe(request.id as any)
	})

	it('should set account without optional parameters', async () => {
		const request: SetAccountJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'tevm_setAccount',
			id: 1,
			params: [
				{
					address: ERC20_ADDRESS,
				},
			],
		}
		const response = await setAccountProcedure(client)(request)
		expect(response.error).toBeUndefined()

		const account = await (await client.getVm()).stateManager.getAccount(createAddress(ERC20_ADDRESS))

		if (!account) throw new Error('Account not found')

		expect(account.balance).toBe(0n)
		expect(account.nonce).toBe(0n)
		expect(bytesToHex(account.codeHash)).toBe(keccak256(new Uint8Array()))
	})

	it('should return an error when stateManager fails', async () => {
		const vm = await client.getVm()
		vm.stateManager.putAccount = () => {
			throw new Error('unexpected error')
		}

		const request: SetAccountJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'tevm_setAccount',
			id: 1,
			params: [
				{
					address: ERC20_ADDRESS,
					deployedBytecode: ERC20.deployedBytecode,
					balance: numberToHex(420n),
					nonce: numberToHex(69n),
				},
			],
		}
		const response = await setAccountProcedure(client)(request)
		expect(response.error).toBeDefined()
		expect(response.error).toMatchSnapshot()
	})
})

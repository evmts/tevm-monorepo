import type { TevmContractCallRequest } from './jsonrpc/contractCall/TevmContractCallRequest.js'
import type { TevmScriptRequest } from './jsonrpc/runScript/TevmScriptRequest.js'
import { DaiContract } from './test/DaiContract.sol.js'
import { type CustomPrecompile, Tevm } from './tevm.js'
import { Address } from '@ethereumjs/util'
import { describe, expect, it } from 'bun:test'
import { hexToBytes } from 'viem'
import supertest from 'supertest'

const contractAddress = '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1'

const addbytecode =
	'0x608060405234801561000f575f80fd5b5060043610610029575f3560e01c8063771602f71461002d575b5f80fd5b610047600480360381019061004291906100a9565b61005d565b60405161005491906100f6565b60405180910390f35b5f818361006a919061013c565b905092915050565b5f80fd5b5f819050919050565b61008881610076565b8114610092575f80fd5b50565b5f813590506100a38161007f565b92915050565b5f80604083850312156100bf576100be610072565b5b5f6100cc85828601610095565b92505060206100dd85828601610095565b9150509250929050565b6100f081610076565b82525050565b5f6020820190506101095f8301846100e7565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f61014682610076565b915061015183610076565b92508282019050808211156101695761016861010f565b5b9291505056fea2646970667358221220a172295fd4b803cacd1fb3a2580b716655e5776929c3df7de2fca459a6e7140164736f6c63430008160033'

const addabi = [
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'a',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'b',
				type: 'uint256',
			},
		],
		name: 'add',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'pure',
		type: 'function',
	},
] as const

const forkConfig = {
	url: 'https://mainnet.optimism.io',
	blockTag: 111791332n,
}

describe('Tevm should create a local vm in JavaScript', () => {
	describe('Tevm.prototype.runScript', () => {
		it('should execute scripts based on their bytecode and return the result', async () => {
			const tevm = await Tevm.create()
			const res = await tevm.runScript(
				DaiContract.script.balanceOf(
					'0x00000000000000000000000000000000000000ff',
				),
			)
			expect(res.data).toBe(0n)
			expect(res.gasUsed).toBe(2447n)
			expect(res.logs).toEqual([])
		})

		it('should work for add contract', async () => {
			const tevm = await Tevm.create()
			const res = await tevm.runScript({
				deployedBytecode: addbytecode,
				abi: addabi,
				functionName: 'add',
				args: [1n, 2n],
			})
			expect(res.data).toBe(3n)
			expect(res.gasUsed).toBe(927n)
			expect(res.logs).toEqual([])
		})
	})

	describe('Tevm.prototype.runCall', () => {
		it('should execute a call on the vm', async () => {
			const tevm = await Tevm.create()
			const balance = 0x11111111n
			const address1 = '0x1f420000000000000000000000000000000000ff'
			const address2 = '0x2f420000000000000000000000000000000000ff'
			await tevm.putAccount({
				account: address1,
				balance,
			})
			const transferAmount = 0x420n
			await tevm.runCall({
				caller: address1,
				data: '0x0',
				to: address2,
				value: transferAmount,
				origin: address1,
			})
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
	})

	describe('Tevm.prototype.runContractCall', () => {
		it('should fork a network and then execute a contract call', async () => {
			const tevm = await Tevm.create({ fork: forkConfig })
			const res = await tevm.runContractCall(
				DaiContract.read.balanceOf(
					'0xf0d4c12a5768d806021f80a262b4d39d26c58b8d',
					{
						contractAddress,
					},
				),
			)
			expect(res.data).toBe(1n)
			expect(res.gasUsed).toBe(2447n)
			expect(res.logs).toEqual([])
		})
	})

	describe('Tevm.prototype.putAccount', () => {
		it('should insert a new account with eth into the state', async () => {
			const tevm = await Tevm.create()
			const balance = 0x11111111n
			const account = await tevm.putAccount({
				account: '0xff420000000000000000000000000000000000ff',
				balance,
			})
			expect(account.balance).toBe(balance)
		})
	})

	describe('Tevm.prototype.putContractCode', () => {
		it('should insert a new contract with bytecode', async () => {
			const tevm = await Tevm.create()
			const code = await tevm.putContractCode({
				deployedBytecode: DaiContract.deployedBytecode,
				contractAddress: '0xff420000000000000000000000000000000000ff',
			})
			expect(code).toHaveLength(4782)
		})
	})

	it('should be able to add custom precompiles', async () => {
		const address = '0xff420000000000000000000000000000000000ff'
		const sender = '0x1f420000000000000000000000000000000000ff'
		const expectedReturn = hexToBytes('0x420')
		const expectedGas = BigInt(69)

		const precompile: CustomPrecompile = {
			// TODO modify the api to take a hex address instead of ethjs address
			address: new Address(hexToBytes(address)),
			// Note ethereumjs fails if you don't include the args here because it checks code.length for some reason
			// code.length returns the number of arguments in the case of a function
			// see https://github.com/ethereumjs/ethereumjs-monorepo/pull/3158/files
			function: (_) => {
				return {
					executionGasUsed: expectedGas,
					returnValue: expectedReturn,
				}
			},
		}

		const tevm = await Tevm.create({ customPrecompiles: [precompile] })
		expect(tevm._evm.getPrecompile(new Address(hexToBytes(address)))).toEqual(
			precompile.function,
		)
		const result = await tevm.runCall({
			to: address,
			gasLimit: BigInt(30000),
			data: '0x0',
			caller: sender,
		})
		expect(result.execResult.exceptionError).toBeUndefined()
		expect(result.execResult.returnValue).toEqual(expectedReturn)
		expect(result.execResult.executionGasUsed).toEqual(expectedGas)
	})

	describe('Tevm.prototype.request', async () => {
		const tevm = await Tevm.create()

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
			const tevm = await Tevm.create({
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
			const tevm = await Tevm.create()
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
			const tevm = await Tevm.create()
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
			const tevm = await Tevm.create()
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

	describe('httpHandler', () => {
		it('should create an http handler', async () => {
			const tevm = await Tevm.create()

			const server = require('http').createServer(tevm.createHttpHandler())

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

			const res = await supertest(server)
				.post('/')
				.send(req)
				.expect(200)
				.expect('Content-Type', /json/)

			expect(res.body.data).toBe(1n)
			expect(res.body.result.gasUsed).toBe(2447n)
			expect(res.body.result.logs).toEqual([])
			expect(res.body.method).toBe(req.method)
			expect(res.body.id).toBe(req.id)
			expect(res.body.jsonrpc).toBe(req.jsonrpc)
		})
	})
})

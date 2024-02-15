import { createMemoryClient } from '../createMemoryClient.js'
import { DaiContract } from './DaiContract.sol.js'
import { Address } from '@ethereumjs/util'
import { hexToBytes } from '@tevm/utils'
import { describe, expect, it } from 'bun:test'

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
	describe('Tevm.script', () => {
		it('should execute scripts based on their bytecode and return the result', async () => {
			const tevm = await createMemoryClient()
			const res = await tevm.script(
				DaiContract.script.balanceOf(
					'0x00000000000000000000000000000000000000ff',
				),
			)
			expect(res.data).toBe(0n)
			expect(res.executionGasUsed).toBe(2447n)
			expect(res.logs).toEqual([])
			expect('errors' in res).toBe(false)
			expect(res.rawData).toBe(
				'0x0000000000000000000000000000000000000000000000000000000000000000',
			)
			expect(res.data).toBe(0n)
			// TODO test the other properties
		})

		it('should work for add contract', async () => {
			const tevm = await createMemoryClient()
			const res = await tevm.script({
				deployedBytecode: addbytecode,
				abi: addabi,
				functionName: 'add',
				args: [1n, 2n],
			})
			expect(res.data).toBe(3n)
			expect(res.executionGasUsed).toBe(927n)
			expect(res.logs).toEqual([])
		})
	})

	describe('Tevm.call', () => {
		it('should execute a call on the vm', async () => {
			const tevm = await createMemoryClient()
			const balance = 0x11111111n
			const address1 = '0x1f420000000000000000000000000000000000ff'
			const address2 = '0x2f420000000000000000000000000000000000ff'
			await tevm.setAccount({
				address: address1,
				balance,
			})
			const transferAmount = 0x420n
			// TODO test other input options
			await tevm.call({
				caller: address1,
				data: '0x0',
				to: address2,
				value: transferAmount,
				origin: address1,
				createTransaction: true,
			})
			expect(
				(
					await tevm.vm.stateManager.getAccount(
						new Address(hexToBytes(address2)),
					)
				)?.balance,
			).toBe(transferAmount)
			expect(
				(
					await tevm.vm.stateManager.getAccount(
						new Address(hexToBytes(address1)),
					)
				)?.balance,
			).toBe(balance - transferAmount)
			// TODO test other return properties
		})
	})

	describe('Tevm.contract', () => {
		it('should fork a network and then execute a contract call', async () => {
			const tevm = await createMemoryClient({ fork: forkConfig })
			// TODO test other inputs
			const res = await tevm.contract({
				to: contractAddress,
				...DaiContract.read.balanceOf(
					'0xf0d4c12a5768d806021f80a262b4d39d26c58b8d',
					{
						contractAddress,
					},
				),
			})
			expect(res.data).toBe(1n)
			expect(res.executionGasUsed).toBe(2447n)
			expect(res.logs).toEqual([])
			// TODO test other properties
		})
	})

	describe('Tevm.account', () => {
		it('should insert a new account with eth into the state', async () => {
			const tevm = await createMemoryClient()
			const balance = 0x11111111n
			const account = await tevm.setAccount({
				address: '0xff420000000000000000000000000000000000ff',
				balance,
			})
			expect(account).not.toHaveProperty('errors')
		})
		it('should insert a new contract with bytecode', async () => {
			const tevm = await createMemoryClient()
			const code = await tevm.setAccount({
				deployedBytecode: DaiContract.deployedBytecode,
				address: '0xff420000000000000000000000000000000000ff',
			})
			expect(code.errors).toBe(undefined as any)
		})
	})
})

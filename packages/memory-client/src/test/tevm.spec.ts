import { describe, expect, it } from 'bun:test'
import { optimism } from '@tevm/common'
import { transports } from '@tevm/test-utils'
import { EthjsAddress } from '@tevm/utils'
import { hexToBytes } from '@tevm/utils'
import { testActions } from 'viem'
import { createMemoryClient } from '../createMemoryClient.js'
import { DaiContract } from './DaiContract.sol.js'

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
	transport: transports.optimism,
	blockTag: 121138454n,
}

describe('Tevm should create a local vm in JavaScript', () => {
	describe('client.script', () => {
		it('should execute scripts based on their bytecode and return the result', async () => {
			const tevm = createMemoryClient()
			const res = await tevm.tevmScript(DaiContract.script.balanceOf('0x00000000000000000000000000000000000000ff'))
			expect(res.data).toBe(0n)
			expect(res.executionGasUsed).toBe(2447n)
			expect(res.logs).toEqual([])
			expect('errors' in res).toBe(false)
			expect(res.rawData).toBe('0x0000000000000000000000000000000000000000000000000000000000000000')
			expect(res.data).toBe(0n)
			// TODO test the other properties
		})

		it('should work for add contract', async () => {
			const tevm = createMemoryClient()
			const res = await tevm.tevmScript({
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

	describe('client.tevmCall', () => {
		it('should execute a call on the vm', async () => {
			const tevm = createMemoryClient().extend(testActions({ mode: 'anvil' }))
			const balance = 0x11111111n
			const address1 = '0x1f420000000000000000000000000000000000ff'
			const address2 = '0x2f420000000000000000000000000000000000ff'
			await tevm.tevmSetAccount({
				address: address1,
				balance,
			})
			expect(
				(
					await tevm.tevmGetAccount({
						address: address1,
					})
				).balance,
			).toBe(balance)
			const transferAmount = 0x420n
			// TODO test other input options
			await tevm.tevmCall({
				caller: address1,
				data: '0x0',
				to: address2,
				value: transferAmount,
				origin: address1,
				createTransaction: true,
			})
			await tevm.mine({ blocks: 1 })
			expect(
				(await (await tevm._tevm.getVm()).stateManager.getAccount(new EthjsAddress(hexToBytes(address2))))?.balance,
			).toBe(transferAmount)
			expect(
				(await (await tevm._tevm.getVm()).stateManager.getAccount(new EthjsAddress(hexToBytes(address1))))?.balance,
			).toBe(286183069n)
			// TODO test other return properties
		})
	})

	describe('client.contract', () => {
		it('should fork a network and then execute a contract call', async () => {
			const tevm = createMemoryClient({ fork: forkConfig, common: optimism })
			const res = await tevm.tevmContract({
				to: contractAddress,
				...DaiContract.read.balanceOf('0xf0d4c12a5768d806021f80a262b4d39d26c58b8d', {
					contractAddress,
				}),
			})
			expect(res).toEqual({
				// The amount of ether used by this transaction. Does not include l1 fees.
				amountSpent: 1442108352554n,
				// The amount of gas used by the transaction execution
				executionGasUsed: 2447n,
				// Latest known L1 base fee known by the l2 chain.
				// Only included when an op-stack common is passed to `createMemoryClient`
				l1BaseFee: 9147423326n,
				// Current blob base fee known by the l2 chain
				l1BlobFee: 1n,
				// L1 fee that should be paid for the tx Only included when an op-stack
				// // common is provided
				l1Fee: 21223193072n,
				// Amount of L1 gas used to publish the transaction. Only included when an
				// // op-stack common is provided
				l1GasUsed: 1696n,
				// Map of addresses which were created (used in EIP 6780) Note the addresses
				// are not actually created til the tx is mined
				createdAddresses: new Set(),
				// The decoded data based on the contract ABI
				data: 1n,
				// amount of gas left
				gas: 29976121n,
				// Logs emitted by the contract call
				logs: [],
				// The return value of the contract call
				rawData: '0x0000000000000000000000000000000000000000000000000000000000000001',
				// A set of accounts to selfdestruct
				selfdestruct: new Set(),
				// The amount of gas used in this transaction, which is paid for.
				// This contains the gas units that have been used on execution,
				// plus the upfront cost, which consists of calldata cost, intrinsic
				// cost and optionally the access list costs Does not include l1 fees
				totalGasSpent: 23879n,
			})
		})
	})

	describe('client.account', () => {
		it('should insert a new account with eth into the state', async () => {
			const tevm = createMemoryClient()
			const balance = 0x11111111n
			const account = await tevm.tevmSetAccount({
				address: '0xff420000000000000000000000000000000000ff',
				balance,
			})
			expect(account).not.toHaveProperty('errors')
		})
		it('should insert a new contract with bytecode', async () => {
			const tevm = createMemoryClient()
			const code = await tevm.tevmSetAccount({
				deployedBytecode: DaiContract.deployedBytecode,
				address: '0xff420000000000000000000000000000000000ff',
			})
			expect(code.errors).toBe(undefined as any)
		})
	})
})

import { afterAll, beforeAll, describe, expect, it } from 'bun:test'
import { type Server, createServer } from 'node:http'
import type { TevmClient } from '@tevm/client-types'
import { type MemoryClient, createMemoryClient } from '@tevm/memory-client'
import { createHttpHandler } from '@tevm/server'
import { EthjsAddress } from '@tevm/utils'
import { bytesToHex, keccak256 } from 'viem'
import { createHttpClient } from './createHttpClient.js'

describe(createHttpClient.name, () => {
	let tevm: MemoryClient
	let server: Server
	let client: HttpClient

	beforeAll(async () => {
		tevm = createMemoryClient({
			fork: { url: 'https://mainnet.optimism.io' },
		})
		server = createServer(createHttpHandler(tevm)).listen(6969)
		client = createHttpClient({ url: 'http://localhost:6969' })
	})

	afterAll(() => {
		server.close()
	})

	describe('implements a tevm client', () => {
		it('tevm.script', async () => {
			const { Add } = await import('./test/Add.s.sol.js')
			expect(await client.tevm.script(Add.read.add(399n, 21n))).toEqual({
				data: 420n,
				executionGasUsed: 927n,
				createdAddresses: new Set(),
				gas: 16776288n,
				logs: [],
				rawData: '0x00000000000000000000000000000000000000000000000000000000000001a4',
				selfdestruct: new Set(),
			})
		})

		it('tevm.contract', async () => {
			const contractAddress = `0x${'69'.repeat(20)}` as const
			const { Add } = await import('./test/Add.s.sol.js')
			await client.tevm.setAccount({
				address: contractAddress,
				deployedBytecode: Add.deployedBytecode,
			})
			const { errors, data } = await client.contract(Add.withAddress(contractAddress).read.add(399n, 21n))
			expect(errors).toBeUndefined()
			expect(data).toBe(420n)
		})

		it('tevm.setAccount and tevm.getAccount', async () => {
			const { ERC20 } = await import('./test/ERC20.sol.js')

			const account = {
				address: `0x${'69'.repeat(20)}`,
				deployedBytecode: ERC20.deployedBytecode,
			} as const
			const { errors } = await client.tevm.setAccount(account)

			expect(errors).toBeUndefined()

			const resultAccount = await (await tevm.getVm()).stateManager.getAccount(EthjsAddress.fromString(account.address))
			if (!resultAccount) throw new Error('Account not found')
			expect(bytesToHex(resultAccount.codeHash)).toEqual(keccak256(account.deployedBytecode))
			// testing getAccount
			const getAccountRes = await client.tevm.getAccount({
				address: account.address,
			})
			expect(getAccountRes).toMatchSnapshot()
		})

		it('can use tevm.eth.chainId', async () => {
			expect(await client.getChainId()).toEqual(10)
		})

		it('can use tevm.eth.getCode', async () => {
			const address = `0x${'69'.repeat(20)}` as const
			await client.tevm.setAccount({
				address,
				deployedBytecode: '0x69',
			})
			expect(await client.getBytecode({ address })).toEqual('0x69')
		})

		it('can use tevm.eth.gasPrice', async () => {
			expect(await client.getGasPrice()).toBeGreaterThan(0n)
		})

		it('can use tevm.eth.getBalance', async () => {
			const address = `0x${'69'.repeat(20)}` as const
			await client.tevm.setAccount({
				address,
				balance: 420n,
			})
			expect(await client.getBalance({ address })).toEqual(420n)
		})

		it('can use tevm.eth.blockNumber', async () => {
			expect(await client.getBlockNumber()).toEqual(0n)
		})

		// this test isn't blocked just moving fast and breaking things atm
		it.todo('can use tevm.eth.storageAt', async () => {
			expect(
				await client.getStorageAt({
					address: '0x0',
					slot: '0x0',
					blockTag: 'pending',
				}),
			).toEqual('0x69')
		})
	})
})

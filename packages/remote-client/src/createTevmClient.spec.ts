import { createTevmClient } from './createTevmClient.js'
import { Address } from '@ethereumjs/util'
import { type MemoryTevm, createMemoryTevm } from '@tevm/client-memory'
import type { Tevm } from '@tevm/client-spec'
import { createHttpHandler } from '@tevm/server'
import { afterAll, beforeAll, describe, expect, it } from 'bun:test'
import { Server, createServer } from 'http'
import { bytesToHex, keccak256 } from 'viem'

describe(createTevmClient.name, () => {
	let tevm: MemoryTevm
	let server: Server
	let client: Tevm

	beforeAll(async () => {
		tevm = await createMemoryTevm({
			fork: { url: 'https://mainnet.optimism.io' },
		})
		server = createServer(createHttpHandler({ request: tevm.request })).listen(
			6969,
		)
		client = createTevmClient({ url: 'http://localhost:6969' })
	})

	afterAll(() => {
		server.close()
	})

	describe('implements a tevm client', () => {
		it('tevm.script', async () => {
			const { Add } = await import('./test/Add.s.sol.js')
			expect(await client.script(Add.read.add(399n, 21n))).toEqual({
				data: 420n,
				executionGasUsed: 927n,
				createdAddresses: new Set(),
				gas: 16776288n,
				logs: [],
				rawData:
					'0x00000000000000000000000000000000000000000000000000000000000001a4',
				selfdestruct: new Set(),
			})
		})

		it('tevm.contract', async () => {
			const contractAddress = `0x${'69'.repeat(20)}` as const
			const { Add } = await import('./test/Add.s.sol.js')
			await client.setAccount({
				address: contractAddress,
				deployedBytecode: Add.deployedBytecode,
			})
			const { errors, data } = await client.contract(
				Add.withAddress(contractAddress).read.add(399n, 21n),
			)
			expect(errors).toBeUndefined()
			expect(data).toBe(420n)
		})

		it('tevm.setAccount and tevm.getAccount', async () => {
			const { ERC20 } = await import('./test/ERC20.sol.js')

			const account = {
				address: `0x${'69'.repeat(20)}`,
				deployedBytecode: ERC20.deployedBytecode,
			} as const
			const { errors } = await client.setAccount(account)

			expect(errors).toBeUndefined()

			const resultAccount = await tevm._evm.stateManager.getAccount(
				Address.fromString(account.address),
			)
			if (!resultAccount) throw new Error('Account not found')
			expect(bytesToHex(resultAccount.codeHash)).toEqual(
				keccak256(account.deployedBytecode),
			)
			// testing getAccount
			const getAccountRes = await client.getAccount({
				address: account.address,
			})
			expect(getAccountRes).toMatchSnapshot()
		})

		it('can use tevm.eth.chainId', async () => {
			expect(await client.eth.chainId()).toEqual(10n)
		})

		it('can use tevm.eth.getCode', async () => {
			const address = `0x${'69'.repeat(20)}` as const
			await client.setAccount({
				address,
				deployedBytecode: '0x69',
			})
			expect(await client.eth.getCode({ address })).toEqual('0x69')
		})

		it('can use tevm.eth.gasPrice', async () => {
			expect(await client.eth.gasPrice()).toEqual(1000000000n)
		})

		it('can use tevm.eth.getBalance', async () => {
			const address = `0x${'69'.repeat(20)}` as const
			await client.setAccount({
				address,
				balance: 420n,
			})
			expect(await client.eth.getBalance({ address })).toEqual(420n)
		})

		it('can use tevm.eth.blockNumber', async () => {
			expect(await client.eth.blockNumber()).toEqual(0n)
		})

		// this test isn't blocked just moving fast and breaking things atm
		it.todo('can use tevm.eth.storageAt', async () => {
			expect(
				await client.eth.getStorageAt({
					address: '0x0',
					position: '0x0',
					tag: 'pending',
				}),
			).toEqual('0x69')
		})
	})
})

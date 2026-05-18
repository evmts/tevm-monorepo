import { createServer, type Server } from 'node:http'
import { createAddress } from '@tevm/address'
import type { TevmClient } from '@tevm/client-types'
import { createMemoryClient, type MemoryClient } from '@tevm/memory-client'
import { createHttpHandler } from '@tevm/server'
import { transports } from '@tevm/test-utils'
import { bytesToHex, keccak256 } from 'viem'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createHttpClient } from './createHttpClient.js'

describe.skip(createHttpClient.name, () => {
	let tevm: MemoryClient
	let server: Server
	let client: TevmClient

	beforeAll(async () => {
		tevm = createMemoryClient({
			fork: { transport: transports.optimism },
		})
		server = createServer(createHttpHandler(tevm)).listen(6969)
		client = createHttpClient({ url: 'http://localhost:6969' })
	})

	afterAll(() => {
		server.close()
	})

	describe('implements a tevm client', () => {
		it(
			'tevm.script',
			async () => {
				const { Add } = await import('./test/Add.s.sol.js')
				expect(await client.contract(Add.withCode(Add.deployedBytecode).read.add(399n, 21n))).toEqual({
					data: 420n,
					executionGasUsed: 927n,
					createdAddresses: new Set(),
					gas: 16776288n,
					logs: [],
					rawData: '0x00000000000000000000000000000000000000000000000000000000000001a4',
					selfdestruct: new Set(),
				})
			},
			{ timeout: 30_000 },
		)

		it(
			'tevm.contract',
			async () => {
				const contractAddress = `0x${'69'.repeat(20)}` as const
				const { Add } = await import('./test/Add.s.sol.js')
				await client.setAccount({
					address: contractAddress,
					deployedBytecode: Add.deployedBytecode,
				})
				const { errors, data } = await client.contract(Add.withAddress(contractAddress).read.add(399n, 21n))
				expect(errors).toBeUndefined()
				expect(data).toBe(420n)
			},
			{ timeout: 15_000 },
		)

		it(
			'tevm.setAccount and tevm.getAccount',
			async () => {
				const { ERC20 } = await import('./test/ERC20.sol.js')

				const account = {
					address: `0x${'69'.repeat(20)}`,
					deployedBytecode: ERC20.deployedBytecode,
				} as const
				const { errors } = await client.setAccount(account)

				expect(errors).toBeUndefined()

				const resultAccount = await (await tevm.transport.tevm.getVm()).stateManager.getAccount(
					createAddress(account.address),
				)
				if (!resultAccount) throw new Error('Account not found')
				expect(bytesToHex(resultAccount.codeHash)).toEqual(keccak256(account.deployedBytecode))
				// testing getAccount
				const getAccountRes = await client.getAccount({
					address: account.address,
				})
				expect(getAccountRes).toMatchSnapshot()
			},
			{ timeout: 15_000 },
		)

		it(
			'can use tevm.eth.chainId',
			async () => {
				expect(await client.eth.chainId()).toEqual(10n)
			},
			{ timeout: 15_000 },
		)

		it(
			'can use tevm.eth.getCode',
			async () => {
				const address = `0x${'69'.repeat(20)}` as const
				await client.setAccount({
					address,
					deployedBytecode: '0x69',
				})
				expect(await client.eth.getCode({ address })).toEqual('0x69')
			},
			{ timeout: 15_000 },
		)

		it(
			'can use tevm.eth.gasPrice',
			async () => {
				expect(await client.eth.gasPrice()).toBeGreaterThan(0n)
			},
			{ timeout: 15_000 },
		)

		it(
			'can use tevm.eth.getBalance',
			async () => {
				const address = `0x${'69'.repeat(20)}` as const
				await client.setAccount({
					address,
					balance: 420n,
				})
				expect(await client.eth.getBalance({ address })).toEqual(420n)
			},
			{ timeout: 15_000 },
		)

		it(
			'can use tevm.eth.blockNumber',
			async () => {
				expect(await client.eth.blockNumber()).toBeGreaterThan(119469089n)
			},
			{ timeout: 15_000 },
		)

		// this test isn't blocked just moving fast and breaking things atm
		it.todo('can use tevm.eth.storageAt', async () => {
			expect(
				await client.eth.getStorageAt({
					address: '0x0',
					position: '0x0',
					blockTag: 'pending',
				}),
			).toEqual('0x69')
		})
	})
})

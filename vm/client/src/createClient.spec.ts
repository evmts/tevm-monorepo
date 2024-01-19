import { createClient } from './createClient.js'
import { Address } from '@ethereumjs/util'
import type { Tevm } from '@tevm/api'
import { createHttpHandler } from '@tevm/server'
import { type MemoryTevm, createMemoryTevm } from '@tevm/vm'
import { afterAll, beforeAll, describe, expect, it } from 'bun:test'
import { Server, createServer } from 'http'
import { bytesToHex, keccak256 } from 'viem'

describe(createClient.name, () => {
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
		client = createClient({ url: 'http://localhost:6969' })
	})

	afterAll(() => {
		server.close()
	})

	describe('implements a tevm client', () => {
		it('can run a script on fork', async () => {
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

		it('can put an account onto the fork', async () => {
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
			const getAccountRes = await client.getAccount({ address: account.address })
			expect(getAccountRes).toMatchSnapshot()
		})

		it('can use tevm.eth.chainId', async () => {
			expect(
				await client.eth.chainId()
			).toEqual(420n)
		})

		it('can use tevm.eth.getCode', async () => {
			const address = `0x${'69'.repeat(20)}` as const
			await client.setAccount({
				address,
				deployedBytecode: '0x69'
			})
			expect(
				await client.eth.getCode({ address })
			).toEqual('0x69')
		})

		it('can use tevm.eth.chainId', async () => {
			expect(
				await client.eth.chainId()
			).toEqual(420n)
		})

		it('can use tevm.eth.chainId', async () => {
			expect(
				await client.eth.chainId()
			).toEqual(420n)
		})

		it('can use tevm.eth.chainId', async () => {
			expect(
				await client.eth.chainId()
			).toEqual(420n)
		})
	})
})

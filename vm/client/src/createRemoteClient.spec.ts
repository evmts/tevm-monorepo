import { createMemoryClient } from './createMemoryClient.js'
import { type RemoteClient, createRemoteClient } from './createRemoteClient.js'
import { ERC20_ADDRESS } from './test/ERC20.sol.js'
import { Address } from '@ethereumjs/util'
import { createHttpHandler } from '@tevm/server'
import { type Tevm, createTevm } from '@tevm/vm'
import { afterAll, beforeAll, describe, expect, it } from 'bun:test'
import { Server, createServer } from 'http'
import { bytesToHex, keccak256 } from 'viem'

describe(createMemoryClient.name, () => {
	let tevm: Tevm
	let server: Server
	let client: RemoteClient

	beforeAll(async () => {
		tevm = await createTevm({ fork: { url: 'https://mainnet.optimism.io' } })
		server = createServer(createHttpHandler({ request: tevm.request })).listen(
			6969,
		)
		client = createRemoteClient({ url: 'http://localhost:6969' })
	})

	afterAll(() => {
		server.close()
	})

	it('wraps viem methods', async () => {
		expect(client.name).toBe('TevmRemoteClient:http://localhost:6969')
		expect(client.tevm).toBeDefined()
		expect(client.estimateGas).toBeDefined()
		expect(client.getLogs).toBeDefined()
		expect(client.getProof).toBeDefined()
		expect(client.getBlock).toBeDefined()
		expect(client.call).toBeDefined()
		expect(client.multicall).toBeDefined()
		expect(client.readContract).toBeDefined()
		expect(client.getFilterLogs).toBeDefined()
		expect(await client.getChainId()).toEqual(10)
	})

	describe('implements a tevm client', () => {
		it('can run a script on fork', async () => {
			const { Add } = await import('./test/Add.s.sol.js')
			expect(await client.tevm.script(Add.read.add(399n, 21n))).toEqual({
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
			const { errors } = await client.tevm.setAccount(account)

			expect(errors).toBeUndefined()

			const resultAccount = await tevm._evm.stateManager.getAccount(
				Address.fromString(account.address),
			)
			if (!resultAccount) throw new Error('Account not found')
			expect(bytesToHex(resultAccount.codeHash)).toEqual(
				keccak256(account.deployedBytecode),
			)
		})

		it('can read a contract on fork', async () => {
			const { ERC20 } = await import('./test/ERC20.sol.js')

			const client = await createMemoryClient({
				fork: { url: 'https://mainnet.optimism.io' },
			})
			await client.tevm.setAccount({
				address: ERC20_ADDRESS,
				deployedBytecode: ERC20.deployedBytecode,
			})

			const contractResult = await client.tevm.contract({
				to: ERC20_ADDRESS,
				...ERC20.read.name(),
			})

			expect(contractResult).toEqual({
				createdAddresses: new Set(),
				data: 'Dai Stablecoin',
				executionGasUsed: 625n,
				gas: 16776590n,
				logs: [],
				rawData:
					'0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000e44616920537461626c65636f696e000000000000000000000000000000000000',
				selfdestruct: new Set(),
			})
		})
	})
})

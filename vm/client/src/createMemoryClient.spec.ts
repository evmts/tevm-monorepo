import { Address } from '@ethereumjs/util'
import { bytesToHex, keccak256 } from 'viem'
import { createMemoryClient } from './createMemoryClient.js'
import { ERC20_ADDRESS } from './test/ERC20.sol.js'
import { describe, expect, it } from 'bun:test'

describe(createMemoryClient.name, () => {
	it('wraps viem methods', async () => {
		const client = await createMemoryClient({
			fork: { url: 'https://mainnet.optimism.io' },
		})
		expect(client.name).toBe('TevmMemoryClient:https://mainnet.optimism.io')
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

			const client = await createMemoryClient({
				fork: { url: 'https://mainnet.optimism.io' },
			})
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

			const client = await createMemoryClient({
				fork: { url: 'https://mainnet.optimism.io' },
			})
			const account = {
				address: `0x${'69'.repeat(20)}`,
				deployedBytecode: ERC20.deployedBytecode,
			} as const
			const { errors } = await client.tevm.setAccount(account)

			expect(errors).toBeUndefined()

			const resultAccount = await client.tevm._evm.stateManager.getAccount(
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

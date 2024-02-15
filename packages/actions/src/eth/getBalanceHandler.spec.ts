import { getBalanceHandler } from './getBalanceHandler.js'
import { EthjsAddress } from '@tevm/utils'
import { describe, expect, it, jest } from 'bun:test'

describe(getBalanceHandler.name, () => {
	it('should fetch balance from state manager if tag is not defined defaulting the tag to `pending`', async () => {
		const stateManager = {
			getAccount: jest.fn(),
		}
		stateManager.getAccount.mockResolvedValueOnce({ balance: 420n })
		const address = EthjsAddress.zero().toString() as `0x${string}`
		expect(
			await getBalanceHandler({
				vm: { stateManager } as any,
			})({ address }),
		).toEqual(420n)
		expect(stateManager.getAccount).toHaveBeenCalledWith(
			EthjsAddress.fromString(address),
		)
	})

	it('should fetch balance from state manager if tag is `pending`', async () => {
		const stateManager = {
			getAccount: jest.fn(),
		}
		stateManager.getAccount.mockResolvedValueOnce({ balance: 420n })
		const address = EthjsAddress.zero().toString() as `0x${string}`
		expect(
			await getBalanceHandler({
				vm: { stateManager } as any,
			})({ address, blockTag: 'pending' }),
		).toEqual(420n)
		expect(stateManager.getAccount).toHaveBeenCalledWith(
			EthjsAddress.fromString(address),
		)
	})

	it('should throw an error if tag is not pending and no forkUrl is set', async () => {
		const stateManager = {
			getAccount: jest.fn(),
		}
		stateManager.getAccount.mockResolvedValueOnce({ balance: 420n })
		const address = EthjsAddress.zero().toString() as `0x${string}`
		expect(
			await getBalanceHandler({
				vm: { stateManager } as any,
			})({ address, blockTag: 'latest' }).catch((e) => (e as any)._tag),
		).toEqual('NoForkUrlSetError')
	})

	// this passed until free rpc tier endpoint started failing
	it.todo(
		'should fetch from provider if fetching a historical block',
		async () => {
			const stateManager = {
				getAccount: jest.fn(),
			}
			stateManager.getAccount.mockResolvedValueOnce({ balance: 420n })
			const address = '0xa0b0660b498d0a7ce193dd6632bf7e9126168a3d' as const
			const blockNumber = 114830382n
			expect(
				await getBalanceHandler({
					vm: { stateManager } as any,
					forkUrl: 'https://mainnet.optimism.io',
				})({ address, blockTag: blockNumber }),
			).toEqual(5536669375141759n)
		},
	)
})

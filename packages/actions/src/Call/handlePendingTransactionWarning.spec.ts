import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { createImpersonatedTx } from '@tevm/tx'
import { describe, expect, it, vi } from 'vitest'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { handlePendingTransactionsWarning } from './handlePendingTransactionsWarning.js'

describe('handlePendingTransactionsWarning', () => {
	const client = createTevmNode()

	it('should warn if no code is found and there are pending transactions', async () => {
		const txPool = await client.getTxPool()
		await txPool.addUnverified(
			createImpersonatedTx({
				impersonatedAddress: createAddress(`0x${'1'.repeat(40)}`),
				data: `0x${'1'.repeat(40)}` as const,
			}),
		)
		client.logger.warn = vi.fn() as any

		await handlePendingTransactionsWarning(
			client,
			{ to: `0x${'1'.repeat(40)}`, data: `0x${'1'.repeat(40)}` as const },
			undefined,
			undefined,
		)

		expect(client.logger.warn).toHaveBeenCalledWith(
			'No code found for contract address 0x1111111111111111111111111111111111111111. But there is 1 pending tx in tx pool. Did you forget to mine a block?',
		)
	})

	it('should not warn if code is found', async () => {
		const address = `0x${'1'.repeat(40)}` as const
		await setAccountHandler(client)({
			address,
			deployedBytecode: `0x${'2'.repeat(40)}` as const,
			nonce: 0n,
			balance: 0n,
		})
		const txPool = await client.getTxPool()
		await txPool.addUnverified(
			createImpersonatedTx({
				impersonatedAddress: createAddress(address),
				data: `0x${'1'.repeat(40)}` as const,
			}),
		)
		client.logger.warn = vi.fn() as any

		await handlePendingTransactionsWarning(
			client,
			{ to: address, data: `0x${'1'.repeat(40)}` as const },
			undefined,
			undefined,
		)

		expect(client.logger.warn).not.toHaveBeenCalled()
	})

	it('should not warn if there are no pending transactions', async () => {
		client.logger.warn = vi.fn() as any

		await handlePendingTransactionsWarning(
			client,
			{ to: `0x${'1'.repeat(40)}`, data: `0x${'1'.repeat(40)}` as const },
			undefined,
			undefined,
		)

		expect(client.logger.warn).not.toHaveBeenCalled()
	})

	it('should not warn if both code and deployedBytecode are provided', async () => {
		client.logger.warn = vi.fn() as any

		await handlePendingTransactionsWarning(
			client,
			{ to: `0x${'1'.repeat(40)}`, data: `0x${'1'.repeat(40)}` as const },
			`0x${'2'.repeat(40)}` as const,
			`0x${'3'.repeat(40)}` as const,
		)

		expect(client.logger.warn).not.toHaveBeenCalled()
	})
})

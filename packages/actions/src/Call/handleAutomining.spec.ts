import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { transports } from '@tevm/test-utils'
import { createImpersonatedTx } from '@tevm/tx'
import { describe, expect, it } from 'vitest'
import { handleAutomining } from './handleAutomining.js'

describe('handleAutomining', () => {
	it('should return undefined if mining type is not auto', async () => {
		const client = createTevmNode({
			fork: { transport: transports.optimism },
			miningConfig: { type: 'manual' },
		})

		const result = await handleAutomining(client)
		expect(result).toBeUndefined()
	})

	it('should mine transaction if mining type is auto', async () => {
		const client = createTevmNode({
			fork: { transport: transports.optimism },
			miningConfig: { type: 'auto' },
		})

		const result = await handleAutomining(client, '0x123')
		expect(result).toBeUndefined()
	})

	it('should return mineHandler result if there are errors', async () => {
		const client = createTevmNode({
			fork: { transport: transports.optimism },
			miningConfig: { type: 'auto' },
		})
		const txPool = await client.getTxPool()
		const tx = createImpersonatedTx(
			{ impersonatedAddress: createAddress(0), to: createAddress(2), value: 1n },
			{ freeze: false },
		)
		await txPool.addUnverified(tx)
		txPool.txsByPriceAndNonce = () => {
			throw new Error('test')
		}
		const result = await handleAutomining(client, '0x123')
		expect(result).toMatchInlineSnapshot(`
			{
			  "errors": [
			    [InternalError: test

			Docs: https://tevm.sh/reference/tevm/errors/classes/internalerror/
			Details: test
			Version: 1.1.0.next-73],
			  ],
			}
		`)
	})

	it('should log mining process', async () => {
		const client = createTevmNode({
			fork: { transport: transports.optimism },
			miningConfig: { type: 'auto' },
		})

		const result = await handleAutomining(client, '0x123')
		expect(result).toBeUndefined()
	})
})

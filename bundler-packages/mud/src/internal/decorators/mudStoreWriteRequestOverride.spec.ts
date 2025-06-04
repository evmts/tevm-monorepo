import { createLogger } from '@tevm/logger'
import { createMemoryClient } from '@tevm/memory-client'
import { PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { state } from '../../../test/state.js'
import { mudStoreWriteRequestOverride } from './mudStoreWriteRequestOverride.js'
import { testContract, sessionClient } from '../../../test/prepare.js'

describe('mudStoreWriteRequestOverride', () => {
	// TODO: when eth_getProof is supported on tevm node
	it.todo('should correctly wrap writeContract calls with a bundler client', async () => {
		const optimisticClient = createMemoryClient({ fork: { transport: sessionClient } })
		const record = Object.values(state.records.app.TestTable)[0]!
		mudStoreWriteRequestOverride(
			sessionClient,
			createLogger({ name: '@tevm/mud', level: 'debug' }),
		)({
			memoryClient: optimisticClient,
			storeAddress: testContract.address,
			txStatusSubscribers: new Set(),
		})

		const txPool = await optimisticClient.transport.tevm.getTxPool()
		expect(txPool.txsInPool).toEqual(0)

		await sessionClient.writeContract({
			// @ts-expect-error - cannot type args
			...testContract.write.set(...Object.values(record)),
			account: PREFUNDED_ACCOUNTS[0].address,
		})

		// Pending block in the optimistic client should include that tx
		expect(txPool.txsInPool).toEqual(1)
		const { key1, key2, ...values } = record
		expect(
			(
				await optimisticClient.tevmContract({
					...testContract.read.get(key1, key2),
					blockTag: 'pending',
				})
			).data,
		).toEqual(values)

		// await viemClient.mine({ blocks: 1 }) // this will resolve awaiting for the tx inside the override
		// expect(txPool.txsInPool).toEqual(0)
	})

	it.todo('should correctly wrap eth_sendTransaction requests with a vanilla client')
	it.todo('should notify the tx status subscribers with the correct updates')
})

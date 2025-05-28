import { tevmDefault } from '@tevm/common'
import { requestEip1193 } from '@tevm/decorators'
import { createMemoryClient, createTevmTransport, tevmViemActions } from '@tevm/memory-client'
import { createTevmNode } from '@tevm/node'
import { MUDTestSystem } from '@tevm/test-utils'
import { PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { createClient, custom, testActions, walletActions } from 'viem'
import { createBundlerClient } from 'viem/account-abstraction'
import { describe, expect, it } from 'vitest'
import { state } from '../../../test/state.js'
import { mudStoreWriteRequestOverride } from './mudStoreWriteRequestOverride.js'

const testContract = MUDTestSystem.withAddress('0x5FbDB2315678afecb367f032d93F642f64180aa3')

const getClients = async () => {
	// TODO: just use a node or transport no need for that many clients
	const client = createMemoryClient()

	const viemClient = createClient({
		transport: custom(client),
		chain: client.chain,
		account: PREFUNDED_ACCOUNTS[0],
	}).extend(walletActions)
	const viemBundlerClient = createBundlerClient({
		client: viemClient,
		chain: viemClient.chain,
		transport: custom(client),
	}).extend(() => ({
		writeContract: (args) => viemClient.writeContract(args),
	}))

	await client.tevmDeploy({
		abi: testContract.abi,
		bytecode: testContract.bytecode,
		addToBlockchain: true,
	})

	const optimisticClient = createMemoryClient({ fork: { transport: client } })

	return { client, viemClient, viemBundlerClient, optimisticClient }
}

describe('mudStoreWriteRequestOverride', () => {
	it.todo('should correctly wrap writeContract calls with a bundler client', async () => {
		const { client, viemClient, viemBundlerClient, optimisticClient } = await getClients()
		const record = Object.values(state.records.app.TestTable)[0]!
		mudStoreWriteRequestOverride(viemBundlerClient)({
			memoryClient: optimisticClient,
			storeAddress: testContract.address,
			txStatusSubscribers: new Set(),
		})

		const txPool = await optimisticClient.transport.tevm.getTxPool()
		expect(txPool.txsInPool).toEqual(0)

		await viemBundlerClient.writeContract({
			// @ts-expect-error - cannot type args
			...testContract.write.set(...Object.values(record)),
			chain: viemBundlerClient.chain,
			account: PREFUNDED_ACCOUNTS[0].address,
		})

		// Pending block in the optimistic client should include that tx
		// TODO: fix the client not finding the block
		console.log(await optimisticClient.getBlock({ blockTag: 'pending' }))
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

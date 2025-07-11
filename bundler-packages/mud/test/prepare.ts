import { type TableRecord, createStash } from '@latticexyz/stash/internal'
import { storeEventsAbi } from '@latticexyz/store'
import { createStorageAdapter } from '@latticexyz/store-sync/internal'
import { tevmDefault } from '@tevm/common'
import { createTevmTransport, tevmContract, tevmDeploy } from '@tevm/memory-client'
import { MUDTestSystem } from '@tevm/test-utils'
import { PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { type Log, createClient, decodeEventLog } from 'viem'
import { createBundlerClient } from 'viem/account-abstraction'
import { writeContract } from 'viem/actions'
import { config } from './config.js'
import { state } from './state.js'

export const testContract = MUDTestSystem.withAddress('0x5FbDB2315678afecb367f032d93F642f64180aa3')
export const stash = createStash(config)

export const client = createClient({
	chain: tevmDefault,
	transport: createTevmTransport({ common: tevmDefault, miningConfig: { type: 'manual' } }),
	account: PREFUNDED_ACCOUNTS[0],
})
export const sessionClient = createBundlerClient({
	client,
	chain: tevmDefault,
	transport: createTevmTransport({ common: tevmDefault }),
}).extend(() => ({
	writeContract: (args) => writeContract(client, args),
}))

const adapter = createStorageAdapter({ stash })

export const writeRecords = async (records: TableRecord<typeof config.tables.app__TestTable>[]) => {
	const storeEventLogs: Log[] = []

	for (const values of records) {
		const { logs } = await tevmContract(client, {
			// @ts-expect-error - cannot type args
			...testContract.write.set(...Object.values(values)),
			addToBlockchain: true,
		})

		logs?.forEach(
			(log) =>
				log.address.toLowerCase() === testContract.address.toLowerCase() &&
				storeEventLogs.push({
					// @ts-expect-error - Source provides no match for required element at position 0 in target.
					...decodeEventLog({ abi: storeEventsAbi, data: log.data, topics: log.topics }),
					address: testContract.address,
					data: log.data,
					// @ts-expect-error - Source provides no match for required element at position 0 in target.
					topics: log.topics,
				}),
		)
	}

	// @ts-expect-error - Log -> StorageAdapterLog type
	await adapter({ logs: storeEventLogs, blockNumber: 1n })

	return { records }
}

export const prepare = async ({ count = 10 }: { count?: number } = {}) => {
	await tevmDeploy(client, {
		abi: testContract.abi,
		bytecode: testContract.bytecode,
		addToBlockchain: true,
	})

	const records = Object.values(state.records.app.TestTable).slice(0, count)
	return await writeRecords(records)
}

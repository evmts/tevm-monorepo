import { createStash, type TableRecord } from '@latticexyz/stash/internal'
import { storeEventsAbi } from '@latticexyz/store'
import { createStorageAdapter } from '@latticexyz/store-sync/internal'
import { tevmDefault } from '@tevm/common'
import { createClient, createTevmTransport, tevmContract, tevmDeploy } from '@tevm/memory-client'
import { MUDTestSystem } from '@tevm/test-utils'
import { decodeEventLog, type Log, PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { createBundlerClient } from 'viem/account-abstraction'
import { writeContract } from 'viem/actions'
import { config } from './config.js'
import { state } from './state.js'

export const testContract = MUDTestSystem.withAddress('0x5FbDB2315678afecb367f032d93F642f64180aa3')
export const stash = createStash(config)

export const client = createClient({
	chain: tevmDefault,
	transport: createTevmTransport({ common: tevmDefault, miningConfig: { type: 'manual' } }),
	// Cast to any to handle viem Account type mismatch with NativePrivateKeyAccount
	account: PREFUNDED_ACCOUNTS[0] as any,
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

		logs?.forEach((log) => {
			if (log.address.toLowerCase() === testContract.address.toLowerCase()) {
				storeEventLogs.push({
					...decodeEventLog({ abi: storeEventsAbi, data: log.data, topics: log.topics }),
					address: testContract.address,
					data: log.data,
					// @ts-expect-error - Source provides no match for required element at position 0 in target.
					topics: log.topics,
				})
			}
		})
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

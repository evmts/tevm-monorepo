import { spliceHex } from '@latticexyz/common'
import { type Table } from '@latticexyz/config'
import {
	decodeKey,
	decodeValueArgs,
	encodeValueArgs,
	getKeySchema,
	getSchemaTypes,
	getValueSchema,
} from '@latticexyz/protocol-parser/internal'
import { type PendingStashUpdate, type Stash, type TableRecord, getRecord } from '@latticexyz/stash/internal'
import { type StorageAdapterBlock, emptyValueArgs } from '@latticexyz/store-sync'
import { type Hex, concatHex, size } from 'viem'

export type CreateStorageAdapter = {
	stash: Stash
}

/**
 * Creates a storage adapter that returns updates instead of applying them directly.
 *
 * It is a copy of the original, with the only modification being that it returns updates instead of `applyUpdates`, and it doesn't need to be async.
 * @see https://github.com/latticexyz/mud/blob/091ece6264dd4cdbdc21ea3d22347a6f1043a6a3/packages/store-sync/src/stash/createStorageAdapter.ts
 */
export function createStorageAdapter({
	stash,
}: CreateStorageAdapter): (block: StorageAdapterBlock) => PendingStashUpdate[] {
	const tablesById = Object.fromEntries(
		Object.values(stash.get().config)
			.flatMap((namespace) => Object.values(namespace) as readonly Table[])
			.map((table) => [table.tableId, table]),
	)

	function getRecordId(tableId: Hex, keyTuple: readonly Hex[]): string {
		return `${tableId}:${concatHex(keyTuple)}`
	}

	return function storageAdapter({ logs }: StorageAdapterBlock): PendingStashUpdate[] {
		const pendingRecords: Record<string, PendingStashUpdate> = {}
		const updates: PendingStashUpdate[] = []

		for (const log of logs) {
			const table = tablesById[log.args.tableId]
			if (!table) continue

			const id = getRecordId(log.args.tableId, log.args.keyTuple)

			const valueSchema = getSchemaTypes(getValueSchema(table))
			const keySchema = getSchemaTypes(getKeySchema(table))
			const key = decodeKey(keySchema, log.args.keyTuple)

			if (log.eventName === 'Store_SetRecord') {
				const value = decodeValueArgs(valueSchema, log.args)
				updates.push((pendingRecords[id] = { table, key, value }))
			} else if (log.eventName === 'Store_SpliceStaticData') {
				const previousValue = pendingRecords[id]
					? pendingRecords[id].value
						? ({ ...pendingRecords[id].key, ...pendingRecords[id].value } as TableRecord)
						: undefined
					: getRecord({ stash, table, key })

				const {
					staticData: previousStaticData,
					encodedLengths,
					dynamicData,
				} = previousValue ? encodeValueArgs(valueSchema, previousValue) : emptyValueArgs

				const staticData = spliceHex(previousStaticData, log.args.start, size(log.args.data), log.args.data)
				const value = decodeValueArgs(valueSchema, {
					staticData,
					encodedLengths,
					dynamicData,
				})

				updates.push((pendingRecords[id] = { table, key, value }))
			} else if (log.eventName === 'Store_SpliceDynamicData') {
				const previousValue = pendingRecords[id]
					? ({ ...pendingRecords[id].key, ...pendingRecords[id].value } as TableRecord)
					: getRecord({ stash, table, key })

				const { staticData, dynamicData: previousDynamicData } = previousValue
					? encodeValueArgs(valueSchema, previousValue)
					: emptyValueArgs

				const dynamicData = spliceHex(previousDynamicData, log.args.start, log.args.deleteCount, log.args.data)
				const value = decodeValueArgs(valueSchema, {
					staticData,
					encodedLengths: log.args.encodedLengths,
					dynamicData,
				})

				updates.push((pendingRecords[id] = { table, key, value }))
			} else if (log.eventName === 'Store_DeleteRecord') {
				updates.push((pendingRecords[id] = { table, key, value: undefined }))
			}
		}

		return updates
	}
}

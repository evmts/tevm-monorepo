import { type Table } from '@latticexyz/config'
import { getRecords, type State } from '@latticexyz/stash/internal'
import type { Logger } from '@tevm/logger'
import type { Address, Hex } from '@tevm/utils'
import { type EIP1193RequestFn } from 'viem'
import { FieldLayout } from '../FieldLayout.js'

const getTablesWithRecords = async (getState: () => State, logger: Logger) => {
	// This can throw in getRecords:encodeKey - https://github.com/latticexyz/mud/blob/main/packages/stash/src/actions/encodeKey.ts#L15
	try {
		const state = getState()
		return Object.values(state.config)
			.flatMap((namespace) => Object.values(namespace) as readonly Table[])
			.map((table) => ({
				table,
				records: Object.values(getRecords({ state, table })),
			}))
	} catch (error) {
		logger.error({ error }, 'Error in MUD getRecords.')
		return []
	}
}

export const mudStoreGetStorageAtOverride =
	(transport: { request: EIP1193RequestFn }, clientType: 'internal' | 'optimistic', logger: Logger) =>
	({ getState, storeAddress }: { getState: () => State; storeAddress: Address }): EIP1193RequestFn => {
		const tableIdToFieldLayout = new Map<Hex, FieldLayout>()
		const { config } = getState()
		for (const namespace of Object.values(config)) {
			for (const table of Object.values(namespace)) {
				tableIdToFieldLayout.set(table.tableId, new FieldLayout(table))
			}
		}

		const originalRequest = transport.request
		// @ts-expect-error - Type 'unknown' is not assignable to type '_returnType'.
		return async function interceptedRequest(requestArgs: any, options: any): ReturnType<EIP1193RequestFn> {
			if (
				requestArgs.method !== 'eth_getStorageAt' ||
				!requestArgs.params ||
				!Array.isArray(requestArgs.params) ||
				requestArgs.params[0]?.toLowerCase() !== storeAddress.toLowerCase()
			) {
				return originalRequest(requestArgs, options)
			}

			const requestedPosition = requestArgs.params[1] as Hex
			logger.debug(
				{ clientType, storeAddress, requestedPosition },
				'MUD Intercept: eth_getStorageAt. Getting optimistic state.',
			)

			const tablesWithRecords = await getTablesWithRecords(getState, logger)

			for (const { table, records } of tablesWithRecords) {
				let fieldLayout = tableIdToFieldLayout.get(table.tableId)
				// If a table was not registered during initial sync
				if (!fieldLayout) {
					fieldLayout = new FieldLayout(table)
					tableIdToFieldLayout.set(table.tableId, fieldLayout)
				}

				// Try to find a matching slot for any record
				for (const record of records) {
					try {
						const slotInfo = fieldLayout.getSlotInfo(record, requestedPosition)
						if (slotInfo) {
							const encodedValueHex = fieldLayout.encodeValueAtSlot(record, slotInfo)
							logger.debug({ clientType, requestedPosition, slotInfo, encodedValueHex }, 'Returning optimistic data')
							return encodedValueHex
						}
					} catch (error) {
						logger.error({ error, clientType, table, record }, 'Error trying to get a matching slot for a record.')
					}
				}
			}

			logger.debug({ clientType, requestedPosition }, 'No MUD data in stash for requested position. Fallback to fork.')
			return await originalRequest(requestArgs, options)
		}
	}

import { type Table } from '@latticexyz/config'
import { type State, getRecords } from '@latticexyz/stash/internal'
import type { Logger } from '@tevm/logger'
import type { Address, Hex } from '@tevm/utils'
import { type EIP1193RequestFn } from 'viem'
import { FieldLayout } from '../FieldLayout.js'

const getTablesWithRecords = async (getState: () => State) => {
	const state = getState()
	return Object.values(state.config)
		.flatMap((namespace) => Object.values(namespace) as readonly Table[])
		.map((table) => ({
			table,
			records: Object.values(getRecords({ state, table })),
		}))
}

export const mudStoreGetStorageAtOverride =
	(transport: { request: EIP1193RequestFn }, clientType: 'internal' | 'optimistic', logger?: Logger) =>
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
				requestArgs.method === 'eth_getStorageAt' &&
				requestArgs.params &&
				Array.isArray(requestArgs.params) &&
				requestArgs.params[0]?.toLowerCase() === storeAddress.toLowerCase()
			) {
				const requestedPosition = requestArgs.params[1] as Hex
				logger?.debug(
					{ clientType, storeAddress, requestedPosition },
					'MUD Intercept: eth_getStorageAt. Getting optimistic state.',
				)

				try {
					const tablesWithRecords = await getTablesWithRecords(getState)

					for (const { table, records } of tablesWithRecords) {
						let fieldLayout = tableIdToFieldLayout.get(table.tableId)
						// In the rare but possible case some table was registered later on
						if (!fieldLayout) {
							fieldLayout = new FieldLayout(table)
							tableIdToFieldLayout.set(table.tableId, fieldLayout)
						}

						// Try to find a matching slot for any record
						for (const record of records) {
							const slotInfo = fieldLayout.getSlotInfo(record, requestedPosition)
							if (slotInfo) {
								const encodedValueHex = fieldLayout.encodeValueAtSlot(record, slotInfo)
								logger?.debug({ clientType, requestedPosition, slotInfo, encodedValueHex }, 'Returning optimistic data')
								return encodedValueHex
							}
						}
					}

					logger?.debug(
						{ clientType, requestedPosition },
						'No MUD data in stash for requested position. Fallback to fork.',
					)
					return await originalRequest(requestArgs, options)
				} catch (error: any) {
					logger?.error({ clientType, error }, 'Error in MUD storage interception.')
				}
			}

			return originalRequest(requestArgs, options)
		}
	}

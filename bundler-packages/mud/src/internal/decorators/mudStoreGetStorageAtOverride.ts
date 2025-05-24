import { type Table } from '@latticexyz/config'
import { type State, getRecords } from '@latticexyz/stash/internal'
import type { Address, Hex } from '@tevm/utils'
import { type EIP1193RequestFn } from 'viem'
import { FieldLayout } from '../FieldLayout.js'

const getTablesWithRecords = async (getState: () => Promise<State>) => {
	const state = await getState()

	return Object.values(state.config)
		.flatMap((namespace) => Object.values(namespace) as readonly Table[])
		.map((table) => ({
			table,
			records: Object.values(getRecords({ state, table })),
		}))
}

export const mudStoreGetStorageAtOverride =
	(transport: { request: EIP1193RequestFn }) =>
	({ getState, storeAddress }: { getState: () => Promise<State>; storeAddress: Address }): EIP1193RequestFn => {
		const logger = console
		// const logger = { debug: (...args: any[]) => {}, error: (...args: any[]) => {} }

		const tableIdToFieldLayout = new Map<Hex, FieldLayout>()
		getState().then(({ config }) => {
			for (const namespace of Object.values(config)) {
				for (const table of Object.values(namespace)) {
					tableIdToFieldLayout.set(table.tableId, new FieldLayout(table))
				}
			}
		})

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
				logger.debug(`MUD Intercept: eth_getStorageAt ${storeAddress} pos ${requestedPosition}`)

				try {
					const tablesWithRecords = await getTablesWithRecords(getState)

					for (const { table, records } of tablesWithRecords) {
						let fieldLayout = tableIdToFieldLayout.get(table.tableId)
						// In the rare but possible case some table was registered later on
						if (!fieldLayout) {
							fieldLayout = new FieldLayout(table)
							tableIdToFieldLayout.set(table.tableId, fieldLayout)
						}

						// Try to match static fields first
						for (const record of records) {
							const accessedSlotLayout = fieldLayout.getStaticAccessedSlotLayout(record, requestedPosition)
							if (accessedSlotLayout) {
								const encodedFieldsValuesHex = fieldLayout.encodeStaticFieldsValuesAtSlot(record, accessedSlotLayout)
								logger.debug('Returning static data', encodedFieldsValuesHex)
								logger.debug('Would have returned', await originalRequest(requestArgs, options))
								return encodedFieldsValuesHex
							}
						}

						// Then try to match encoded lengths
						for (const record of records) {
							const encodedLengthsSlot = fieldLayout.getEncodedLengthsSlot(record)
							if (encodedLengthsSlot.toLowerCase() === requestedPosition.toLowerCase()) {
								const encodedLengthsHex = fieldLayout.encodeEncodedLengthsAtSlot(record)

								logger.debug('Returning encoded lengths', encodedLengthsHex)
								logger.debug('Would have returned', await originalRequest(requestArgs, options))
								return encodedLengthsHex
							}
						}

						// Finally try to match dynamic fields
						for (const record of records) {
							const dynamicFieldsLayout = fieldLayout.getDynamicFieldsLayout(record)
							const accessedSlot = fieldLayout.getDynamicAccessedSlot(dynamicFieldsLayout, requestedPosition)
							if (accessedSlot) {
								const encodedFieldValuesHex = fieldLayout.encodeDynamicFieldsValuesAtSlot(accessedSlot)

								logger.debug('Returning dynamic field data', encodedFieldValuesHex)
								logger.debug('Would have returned', await originalRequest(requestArgs, options))
								return encodedFieldValuesHex
							}
						}
					}

					logger.debug(`No MUD data in stash for position ${requestedPosition}. Fallback to fork.`)
					return await originalRequest(requestArgs, options)
				} catch (error: any) {
					logger.error(`Error in MUD storage interception: ${error.message} ${error.stack}`, error)
				}
			}

			return originalRequest(requestArgs, options)
		}
	}

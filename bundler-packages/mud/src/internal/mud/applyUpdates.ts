import { type Table } from '@latticexyz/config'
import { schemaAbiTypeToDefaultValue } from '@latticexyz/schema-type/internal'
import {
	encodeKey,
	type Key,
	registerTable,
	type Stash,
	type TableRecord,
	type TableUpdates,
} from '@latticexyz/stash/internal'

export type PendingStashUpdate<table extends Table = Table> = {
	table: table
	key: Key<table>
	value: undefined | Partial<TableRecord<table>>
}

export type ApplyUpdatesArgs = {
	stash: Stash
	updates: PendingStashUpdate[]
}

type PendingUpdates = {
	[namespaceLabel: string]: {
		[tableLabel: string]: TableUpdates
	}
}

/**
 * Applies updates to the stash without notifying subscribers.
 *
 * This is a copy of the original, with the only modification being that it does not call `notifySubscribers`.
 */
export function applyStashUpdates({ stash, updates }: ApplyUpdatesArgs): void {
	for (const { table, key, value } of updates) {
		if (stash.get().config[table.namespaceLabel]?.[table.label] == null) {
			registerTable({ stash, table })
		}

		const { tableState, encodedKey, nextRecord } = getUpdatedRecords(stash, { table, key, value })

		// apply update to state
		if (nextRecord != null) {
			tableState[encodedKey] = nextRecord
		} else {
			delete tableState[encodedKey]
		}
	}
}

/**
 * Notifies all subscribers of the provided updates.
 *
 * The only difference with the original is that it takes the updates as an argument.
 */
export function notifyStashSubscribers({ stash, updates: _updates }: ApplyUpdatesArgs): void {
	if (_updates.length === 0) return

	const pendingUpdates: PendingUpdates = {}

	// Group updates by namespace and table for notification
	for (const { table, key, value } of _updates) {
		const tableUpdates = ((pendingUpdates[table.namespaceLabel] ??= {})[table.label] ??= [])

		const { prevRecord, nextRecord } = getUpdatedRecords(stash, { table, key, value })

		// push update to table updates
		tableUpdates.push({
			table,
			key,
			previous: prevRecord,
			current: nextRecord,
		})
	}

	// Notify table subscribers
	for (const [namespaceLabel, namespaceUpdates] of Object.entries(pendingUpdates)) {
		for (const [tableLabel, tableUpdates] of Object.entries(namespaceUpdates)) {
			stash._.tableSubscribers[namespaceLabel]?.[tableLabel]?.forEach((subscriber) => {
				subscriber(tableUpdates)
			})
		}
	}

	// Notify stash subscribers
	const updates = Object.values(pendingUpdates)
		.map((namespaceUpdates) => Object.values(namespaceUpdates))
		.flat(2)
	stash._.storeSubscribers.forEach((subscriber) => {
		subscriber({ type: 'records', updates })
	})
}

function getUpdatedRecords(stash: Stash, update: PendingStashUpdate) {
	const { table, key, value } = update

	const tableState = ((stash._.state.records[table.namespaceLabel] ??= {})[table.label] ??= {})
	const encodedKey = encodeKey({ table, key })
	const prevRecord = tableState[encodedKey]

	// create new record, preserving field order
	const nextRecord =
		value == null
			? undefined
			: Object.fromEntries(
					Object.entries(table.schema).map(([fieldName, { type }]) => [
						fieldName,
						key[fieldName] ?? // Use provided key fields
							value[fieldName] ?? // Or provided value fields
							prevRecord?.[fieldName] ?? // Keep existing non-overridden fields
							schemaAbiTypeToDefaultValue[type], // Default values for new fields
					]),
				)

	return { tableState, encodedKey, prevRecord, nextRecord }
}

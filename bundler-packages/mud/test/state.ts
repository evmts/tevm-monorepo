import { encodeKey, getKeySchema, getSchemaTypes } from '@latticexyz/protocol-parser/internal'
import type { State, TableRecord, TableRecords } from '@latticexyz/stash/internal'
import { bytesToHex, concatHex } from '@tevm/utils'
import { config } from './config.js'

const randomKey = () => {
	const key1 = BigInt(Math.floor(Math.random() * 1000))
	const key2 = Math.floor(Math.random() * 100)
	return {
		key: concatHex(
			encodeKey(getSchemaTypes(getKeySchema(config.tables.app__TestTable)), {
				key1,
				key2,
			}),
		),
		key1,
		key2,
	}
}

export const randomRecord = (): [string, TableRecord<typeof config.tables.app__TestTable>] => {
	const { key, key1, key2 } = randomKey()
	return [
		key,
		{
			key1,
			key2,
			val1: BigInt(Math.floor(Math.random() * 1000)),
			val2: Math.floor(Math.random() * 100),
			val3: Math.floor(Math.random() * 100),
			val4: Math.random() > 0.5,
			val5: bytesToHex(new Uint8Array(20).map(() => Math.floor(Math.random() * 256))),
			dyn1: Array.from({ length: Math.floor(Math.random() * 100) }, (_, i) => String.fromCharCode(i)).join(''),
			dyn2: bytesToHex(new Uint8Array(Math.floor(Math.random() * 100) + 1).map(() => Math.floor(Math.random() * 256))),
			dyn3: Array.from({ length: Math.floor(Math.random() * 100) }, () => Math.floor(Math.random() * 100) - 50),
		},
	]
}

// TODO: function that returns n random records with unique keys
const getRandomRecords = (n: number): TableRecords<typeof config.tables.app__TestTable> => {
	const records = new Map<string, TableRecord<typeof config.tables.app__TestTable>>()
	const usedKeys = new Set<string>()

	while (records.size < n) {
		const record = randomRecord()
		if (!usedKeys.has(record[0])) {
			usedKeys.add(record[0])
			records.set(record[0], record[1])
		}
	}

	return Object.fromEntries(records)
}
export const state = {
	config: { app: { TestTable: config.tables.app__TestTable } },
	records: {
		app: {
			TestTable: getRandomRecords(100),
		},
	},
} as const satisfies State<typeof config>

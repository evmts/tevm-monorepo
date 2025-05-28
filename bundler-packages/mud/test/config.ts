import { defineStore } from '@latticexyz/store'

// Copied from https://github.com/latticexyz/mud/blob/582f7187/packages/cli/scripts/generate-test-tables.ts#L11
export const config = defineStore({
	namespace: 'app',
	tables: {
		TestTable: {
			schema: {
				key1: 'uint200',
				key2: 'uint8',
				val1: 'uint200',
				val2: 'uint8',
				val3: 'uint16',
				val4: 'bool',
				val5: 'address',
				dyn1: 'string',
				dyn2: 'bytes',
				dyn3: 'int16[]',
			},
			key: ['key1', 'key2'],
		},
	},
})

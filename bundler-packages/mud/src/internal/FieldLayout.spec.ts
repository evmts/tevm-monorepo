import {
	encodeKey,
	encodeValueArgs,
	getKeySchema,
	getSchemaTypes,
	getValueSchema,
} from '@latticexyz/protocol-parser/internal'
import { type TableRecord } from '@latticexyz/stash/internal'
import { concatHex, type Hex, hexToBigInt, keccak256, numberToHex } from 'viem'
import { describe, expect, it } from 'vitest'
import { config } from '../../test/config.js'
import { state } from '../../test/state.js'
import { FieldLayout } from './FieldLayout.js'

describe('FieldLayout', () => {
	const table = config.tables.app__TestTable
	const fieldLayout = new FieldLayout(table)
	const sampleRecord = Object.values(state.records.app.TestTable)[0]!

	describe('getTableId', () => {
		it('should return the correct table ID', () => {
			expect(fieldLayout.getTableId()).toBe(table.tableId)
		})
	})

	describe('getSlotInfo', () => {
		it('should return null for non-existent slots', () => {
			const randomSlot = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef' as Hex
			const slotInfo = fieldLayout.getSlotInfo(sampleRecord, randomSlot)
			expect(slotInfo).toBeNull()
		})

		it('should identify static slot type', () => {
			// Calculate static slot manually
			const recordHash = calculateRecordHash(sampleRecord)
			const staticBaseSlot =
				hexToBigInt(/* keccak256("mud.store") */ '0x86425bff6b57326c7859e89024fe4f238ca327a1ae4a230180dd2f0e88aaa7d9') ^
				hexToBigInt(recordHash)
			const staticSlot = numberToHex(staticBaseSlot, { size: 32 })

			expect(fieldLayout.getSlotInfo(sampleRecord, staticSlot)).toMatchObject({
				type: 'static',
				slotIndex: 0,
				slot: staticSlot,
			})
		})

		it('should identify encodedLengths slot type', () => {
			const recordHash = calculateRecordHash(sampleRecord)
			const encodedLengthsSlot = numberToHex(
				hexToBigInt(
					/* keccak256("mud.store.dynamicDataLength") */ '0x14e2fcc58e58e68ec7edc30c8d50dccc3ce2714a623ec81f46b6a63922d76569',
				) ^ hexToBigInt(recordHash),
				{ size: 32 },
			)

			expect(fieldLayout.getSlotInfo(sampleRecord, encodedLengthsSlot)).toMatchObject({
				type: 'encodedLengths',
				slot: encodedLengthsSlot,
			})
		})

		it('should identify dynamic slot type', () => {
			const recordHash = calculateRecordHash(sampleRecord)
			const fieldIndex = 0 // First dynamic field (dyn1)
			const baseSlot =
				hexToBigInt(
					/* keccak256("mud.store.dynamicData") */ '0x3b4102da22e32d82fc925482184f16c09fd4281692720b87d124aef6da48a0f1',
				) ^
				(BigInt(fieldIndex) << 248n) ^
				hexToBigInt(recordHash)
			const dynamicSlot = numberToHex(baseSlot, { size: 32 })

			expect(fieldLayout.getSlotInfo(sampleRecord, dynamicSlot)).toMatchObject({
				type: 'dynamic',
				fieldName: 'dyn1',
				slotIndex: 0,
				slot: dynamicSlot,
				encodedData: encodeValueArgs({ dyn1: getSchemaTypes(getValueSchema(table)).dyn1 }, sampleRecord).dynamicData,
			})
		})
	})

	describe('encodeValueAtSlot', () => {
		const sample = {
			key1: 11n,
			key2: 22,
			val1: 33n,
			val2: 44,
			val3: 55n,
			val4: true,
			val5: '0x1231231231231231231231231231231231231231' as Hex,
			dyn1: 'Hello World',
			dyn2: `0x${'97'.repeat(50)}` as Hex,
			dyn3: [-1, 10, 30],
		}

		it('should encode static slot values', () => {
			expect(fieldLayout.encodeValueAtSlot(sample, { type: 'static', slotIndex: 0, slot: '0x' })).toEqual(
				'0x000000000000000000000000000000000000000000000000212c003701123123',
			)
			expect(fieldLayout.encodeValueAtSlot(sample, { type: 'static', slotIndex: 1, slot: '0x' })).toEqual(
				'0x1231231231231231231231231231231231000000000000000000000000000000',
			)
		})

		it('should encode encodedLengths slot values', () => {
			expect(fieldLayout.encodeValueAtSlot(sample, { type: 'encodedLengths', slot: '0x' })).toEqual(
				'0x0000000000000000000000000000060000000032000000000b00000000000043',
			)
		})

		it('should encode dynamic slot values', () => {
			expect(
				fieldLayout.encodeValueAtSlot(sample, {
					type: 'dynamic',
					fieldName: 'dyn1',
					slotIndex: 0,
					slot: '0x',
					encodedData: encodeValueArgs({ dyn1: getSchemaTypes(getValueSchema(table)).dyn1 }, sample).dynamicData,
				}),
			).toEqual('0x48656c6c6f20576f726c64000000000000000000000000000000000000000000')
			expect(
				fieldLayout.encodeValueAtSlot(sample, {
					type: 'dynamic',
					fieldName: 'dyn2',
					slotIndex: 0,
					slot: '0x',
					encodedData: encodeValueArgs({ dyn2: getSchemaTypes(getValueSchema(table)).dyn2 }, sample).dynamicData,
				}),
			).toEqual('0x9797979797979797979797979797979797979797979797979797979797979797')
			expect(
				fieldLayout.encodeValueAtSlot(sample, {
					type: 'dynamic',
					fieldName: 'dyn3',
					slotIndex: 0,
					slot: '0x',
					encodedData: encodeValueArgs({ dyn3: getSchemaTypes(getValueSchema(table)).dyn3 }, sample).dynamicData,
				}),
			).toEqual('0xffff000a001e0000000000000000000000000000000000000000000000000000')
		})
	})
})

// Helper to calculate record hash (minimal implementation for testing)
function calculateRecordHash(record: TableRecord<typeof config.tables.app__TestTable>): Hex {
	const table = config.tables.app__TestTable
	const keySchema = getSchemaTypes(getKeySchema(table))
	const keys = { key1: record['key1'], key2: record['key2'] }
	const keyTuple = encodeKey(keySchema, keys)

	return keccak256(concatHex([table.tableId, ...keyTuple]))
}

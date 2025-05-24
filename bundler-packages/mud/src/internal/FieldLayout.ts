import { type TableRecord } from '@latticexyz/stash/internal'
import { type Hex, encodeAbiParameters } from '@tevm/utils'
import { bytesToHex, concatHex, encodePacked, hexToBigInt, hexToBytes, keccak256, numberToHex, pad, toHex } from 'viem'

import { type AbiType, type Table } from '@latticexyz/config'
import {
	type SchemaToPrimitives,
	encodeKey,
	getKeySchema,
	getSchemaTypes,
	getValueSchema,
} from '@latticexyz/protocol-parser/internal' // Assuming internal exports are usable
import {
	type StaticAbiType,
	isDynamicAbiType,
	isStaticAbiType,
	staticAbiTypeToByteLength,
} from '@latticexyz/schema-type/internal'

export class FieldLayout<TTable extends Table = Table> {
	private static readonly STORE_SLOT: Hex = keccak256(toHex('mud.store'))
	private static readonly STORE_DYNAMIC_DATA_SLOT: Hex = keccak256(toHex('mud.store.dynamicData'))
	private static readonly STORE_DYNAMIC_DATA_LENGTH_SLOT: Hex = keccak256(toHex('mud.store.dynamicDataLength'))

	private readonly tableId: Hex
	private readonly keySchema: getSchemaTypes<getKeySchema<TTable>>
	private readonly valueSchema: getSchemaTypes<getValueSchema<TTable>>

	// [[{ slot: n, offset: 0 }, { slot: n, offset: 16 }, ...], [{ slot: n + 1, offset: 0 }, { slot: n + 1, offset: 16 }, ...], ...]
	private readonly staticFieldsLayout: Array<
		Array<{
			name: string
			type: StaticAbiType
			bytes: number
			offset: number
		}>
	>

	private readonly dynamicFields: {
		[k: string]: AbiType
	}

	constructor(table: TTable) {
		this.tableId = table.tableId
		this.keySchema = getSchemaTypes(getKeySchema(table))
		this.valueSchema = getSchemaTypes(getValueSchema(table))
		this.staticFieldsLayout = this.generateStaticFieldsLayout()
		this.dynamicFields = Object.fromEntries(
			Object.entries(this.valueSchema).filter(([, value]) => isDynamicAbiType(value)),
		) as { [k: string]: AbiType }
	}

	public getTableId() {
		return this.tableId
	}

	/* ------------------------------ STATIC FIELDS ----------------------------- */
	private generateStaticFieldsLayout() {
		return Object.entries(this.valueSchema)
			.filter(([, abiType]) => isStaticAbiType(abiType))
			.reduce(
				(slots, [name, _abiType]) => {
					const abiType = _abiType as StaticAbiType
					const bytes = staticAbiTypeToByteLength[abiType]

					// Find current slot or create new one
					let currentSlot = slots[slots.length - 1]
					if (!currentSlot) {
						currentSlot = { fields: [], usedBytes: 0 }
						slots.push(currentSlot)
					}

					// Check if field fits in current slot
					if (currentSlot.usedBytes + bytes > 32) {
						// Create new slot
						currentSlot = { fields: [], usedBytes: 0 }
						slots.push(currentSlot)
					}

					// Add field to current slot
					currentSlot.fields.push({
						name,
						type: abiType,
						bytes,
						offset: currentSlot.usedBytes,
					})

					currentSlot.usedBytes += bytes

					return slots
				},
				[] as Array<{
					fields: Array<{
						name: string
						type: StaticAbiType
						bytes: number
						offset: number // 0-31, relative to slot start
					}>
					usedBytes: number
				}>,
			)
			.map((slot) => slot.fields)
	}

	public getStaticAccessedSlotLayout(record: TableRecord, requestedPosition: Hex) {
		const recordHash = this.encodeRecordHash(record)
		const baseSlot = hexToBigInt(FieldLayout.STORE_SLOT) ^ hexToBigInt(recordHash)
		const allSlots = Array.from({ length: this.staticFieldsLayout.length }, (_, index) =>
			numberToHex(baseSlot + BigInt(index), { size: 32 }),
		)

		const accessedSlot = allSlots.find((slot) => slot.toLowerCase() === requestedPosition.toLowerCase())
		if (accessedSlot) return this.staticFieldsLayout[allSlots.indexOf(accessedSlot)]!
		return null
	}

	public encodeStaticFieldsValuesAtSlot(
		record: TableRecord,
		accessedSlotLayout: Array<{ name: string; type: StaticAbiType; bytes: number; offset: number }>,
	) {
		const values = accessedSlotLayout
			.sort((a, b) => Object.keys(this.valueSchema).indexOf(a.name) - Object.keys(this.valueSchema).indexOf(b.name))
			.map((field) => record[field.name])

		return pad(encodePacked(Object.values(this.valueSchema), values), { size: 32, dir: 'right' })
	}

	/* ----------------------------- ENCODED LENGTHS ---------------------------- */
	public getEncodedLengthsSlot(record: TableRecord) {
		if (Object.keys(this.dynamicFields).length > 0) {
			const recordHash = this.encodeRecordHash(record)
			const encodedLengthsSlot = hexToBigInt(FieldLayout.STORE_DYNAMIC_DATA_LENGTH_SLOT) ^ hexToBigInt(recordHash)
			return numberToHex(encodedLengthsSlot, { size: 32 })
		}

		return numberToHex(0, { size: 32 })
	}

	public encodeEncodedLengthsAtSlot(record: TableRecord) {
		const dynamicFieldNames = Object.keys(this.dynamicFields)
		const fieldLengths: number[] = []
		let totalLength = 0

		// Calculate byte length for each dynamic field
		for (const fieldName of dynamicFieldNames) {
			const fieldValue = record[fieldName]
			const fieldType = this.dynamicFields[fieldName]!

			const encodedValue = encodeAbiParameters([{ type: fieldType }], [fieldValue])
			const fieldLength = hexToBytes(encodedValue).length

			fieldLengths.push(fieldLength)
			totalLength += fieldLength
		}

		// Encode according to EncodedLengths format:
		// bytes[0:6] = total length, bytes[7:11] = 1st field, bytes[12:16] = 2nd field, etc. up to 5 fields
		return concatHex([
			numberToHex(totalLength, { size: 7 }),
			...Array.from(
				{ length: 5 },
				(_, i) => numberToHex(fieldLengths[i] ?? 0, { size: 5 }), // Up to 5 field lengths, 5 bytes each
			),
		])
	}

	/* ----------------------------- DYNAMIC FIELDS ----------------------------- */
	public getDynamicFieldsLayout(record: TableRecord) {
		const recordHash = this.encodeRecordHash(record)
		const dynamicFieldNames = Object.keys(this.dynamicFields)

		const fieldsLayout: Array<{
			fieldName: string
			fieldIndex: number
			slots: Array<{
				slot: Hex
				slotIndex: number
			}>
			encodedData: Hex
		}> = []

		dynamicFieldNames.forEach((fieldName, fieldIndex) => {
			const fieldValue = record[fieldName]
			const fieldType = this.dynamicFields[fieldName]!

			// Encode the field to get its packed data
			const encodedData = encodeAbiParameters([{ type: fieldType }], [fieldValue])
			const dataBytes = hexToBytes(encodedData)

			// Calculate how many 32-byte slots this field spans
			const numSlots = Math.ceil(dataBytes.length / 32)

			// Calculate slots occupied by this field
			const baseSlot = hexToBigInt(FieldLayout.STORE_DYNAMIC_DATA_SLOT) ^ BigInt(fieldIndex) ^ hexToBigInt(recordHash)
			const slots = Array.from({ length: numSlots }, (_, slotIndex) => ({
				slot: numberToHex(baseSlot + BigInt(slotIndex), { size: 32 }),
				slotIndex,
			}))

			fieldsLayout.push({
				fieldName,
				fieldIndex,
				slots,
				encodedData,
			})
		})

		return fieldsLayout
	}

	public getDynamicAccessedSlot(
		dynamicFieldsLayout: Array<{ slots: Array<{ slot: Hex; slotIndex: number }>; encodedData: Hex }>,
		requestedPosition: Hex,
	) {
		for (const field of dynamicFieldsLayout) {
			const matchedSlot = field.slots.find(({ slot }) => slot.toLowerCase() === requestedPosition.toLowerCase())
			if (matchedSlot) {
				return {
					index: matchedSlot.slotIndex,
					encodedData: field.encodedData,
				}
			}
		}
		return null
	}

	// Extracts the relevant data to a slot index that fits into a series of slots for dynamic data
	public encodeDynamicFieldsValuesAtSlot(slot: { index: number; encodedData: Hex }) {
		// Extract the 32-byte chunk for this specific slot
		const dataBytes = hexToBytes(slot.encodedData)
		const startByte = slot.index * 32
		const endByte = Math.min(startByte + 32, dataBytes.length)
		const slotData = dataBytes.slice(startByte, endByte)

		// Pad to 32 bytes if needed (right-pad with zeros)
		return pad(bytesToHex(slotData), { size: 32, dir: 'right' })
	}

	/* ---------------------------------- UTILS --------------------------------- */
	private encodeRecordHash(record: TableRecord) {
		const keys = Object.fromEntries(
			Object.entries(record).filter(([key]) => Object.keys(this.keySchema).includes(key)),
		) as SchemaToPrimitives<typeof this.keySchema>
		const keyTuple = encodeKey(this.keySchema, keys)

		return keccak256(concatHex([this.tableId, ...keyTuple]))
	}
}

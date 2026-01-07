import { type Table } from '@latticexyz/config'
import {
	encodeKey,
	encodeValueArgs,
	getKeySchema,
	getSchemaTypes,
	getValueSchema,
	type SchemaToPrimitives,
} from '@latticexyz/protocol-parser/internal' // Assuming internal exports are usable
import {
	type DynamicAbiType,
	isDynamicAbiType,
	isStaticAbiType,
	type StaticAbiType,
	type StaticAbiTypeToPrimitiveType,
	staticAbiTypeToByteLength,
	staticAbiTypeToDefaultValue,
} from '@latticexyz/schema-type/internal'
import { type TableRecord } from '@latticexyz/stash/internal'
import {
	bytesToHex,
	concatHex,
	encodePacked,
	type Hex,
	hexToBigInt,
	hexToBytes,
	keccak256,
	numberToHex,
	pad,
	toHex,
} from '@tevm/utils'

// Unified slot info types
type StaticSlotInfo = {
	type: 'static'
	slotIndex: number
	slot: Hex
}

type EncodedLengthsSlotInfo = {
	type: 'encodedLengths'
	slot: Hex
}

type DynamicSlotInfo = {
	type: 'dynamic'
	fieldName: string
	slotIndex: number
	slot: Hex
	encodedData: Hex
}

type SlotInfo = StaticSlotInfo | EncodedLengthsSlotInfo | DynamicSlotInfo

export class FieldLayout<TTable extends Table = Table> {
	private static readonly STORE_SLOT: Hex = keccak256(toHex('mud.store'))
	private static readonly STORE_DYNAMIC_DATA_SLOT: Hex = keccak256(toHex('mud.store.dynamicData'))
	private static readonly STORE_DYNAMIC_DATA_LENGTH_SLOT: Hex = keccak256(toHex('mud.store.dynamicDataLength'))

	private readonly tableId: Hex
	private readonly keySchema: getSchemaTypes<getKeySchema<TTable>>
	private readonly valueSchema: getSchemaTypes<getValueSchema<TTable>>

	private readonly staticFieldsInfo: {
		fields: Array<{ name: string; type: StaticAbiType }>
		totalBytes: number
		numSlots: number
	}

	private readonly dynamicFieldsInfo: Array<{
		name: string
		type: DynamicAbiType
		fieldIndex: number
	}>

	constructor(table: TTable) {
		this.tableId = table.tableId
		this.keySchema = getSchemaTypes(getKeySchema(table))
		this.valueSchema = getSchemaTypes(getValueSchema(table))

		// Process static fields
		const staticEntries = Object.entries(this.valueSchema)
			.filter(([, abiType]) => isStaticAbiType(abiType))
			.map(([name, abiType]) => ({ name, type: abiType as StaticAbiType }))

		const totalBytes = staticEntries.reduce((sum, { type }) => sum + staticAbiTypeToByteLength[type], 0)

		this.staticFieldsInfo = {
			fields: staticEntries,
			totalBytes,
			numSlots: Math.ceil(totalBytes / 32),
		}

		// Process dynamic fields with pre-computed indices
		this.dynamicFieldsInfo = Object.entries(this.valueSchema)
			.filter(([, abiType]) => isDynamicAbiType(abiType))
			.map(([name, abiType], index) => ({
				name,
				type: abiType as DynamicAbiType,
				fieldIndex: index,
			}))
	}

	public getTableId() {
		return this.tableId
	}

	/* ----------------------------- UNIFIED SLOT API ----------------------------- */

	/**
	 * Get slot information for a requested position. Returns null if the position doesn't match any known slot.
	 * This is the main entry point that avoids redundant computations.
	 */
	public getSlotInfo(record: TableRecord, requestedPosition: Hex): SlotInfo | null {
		const recordHash = this.encodeRecordHash(record)
		const requestedLower = requestedPosition.toLowerCase()

		// Check static slots first
		const staticBaseSlot = hexToBigInt(FieldLayout.STORE_SLOT) ^ hexToBigInt(recordHash)
		for (let slotIndex = 0; slotIndex < this.staticFieldsInfo.numSlots; slotIndex++) {
			const slot = numberToHex(staticBaseSlot + BigInt(slotIndex), { size: 32 })
			if (slot.toLowerCase() === requestedLower) {
				return {
					type: 'static',
					slotIndex,
					slot,
				}
			}
		}

		// Check encoded lengths slot
		if (this.dynamicFieldsInfo.length > 0) {
			const encodedLengthsSlot = numberToHex(
				hexToBigInt(FieldLayout.STORE_DYNAMIC_DATA_LENGTH_SLOT) ^ hexToBigInt(recordHash),
				{ size: 32 },
			)
			if (encodedLengthsSlot.toLowerCase() === requestedLower) {
				return {
					type: 'encodedLengths',
					slot: encodedLengthsSlot,
				}
			}
		}

		// Check dynamic slots
		for (const { name, fieldIndex } of this.dynamicFieldsInfo) {
			// Encode the field to get its packed data
			const { dynamicData } = encodeValueArgs(
				{ [name]: this.valueSchema[name as keyof typeof this.valueSchema] },
				record as SchemaToPrimitives<typeof this.valueSchema>,
			)

			const dataBytes = hexToBytes(dynamicData)
			const numSlots = Math.ceil(dataBytes.length / 32)

			// Calculate base slot for this field
			const baseSlot =
				hexToBigInt(FieldLayout.STORE_DYNAMIC_DATA_SLOT) ^ (BigInt(fieldIndex) << 248n) ^ hexToBigInt(recordHash)

			// Check each slot for this field
			for (let slotIndex = 0; slotIndex < numSlots; slotIndex++) {
				const slot = numberToHex(baseSlot + BigInt(slotIndex), { size: 32 })
				if (slot.toLowerCase() === requestedLower) {
					return {
						type: 'dynamic',
						fieldName: name,
						slotIndex,
						slot,
						encodedData: dynamicData,
					}
				}
			}
		}

		return null
	}

	/**
	 * Encode the value at a specific slot based on slot info.
	 * This method uses the slot info to avoid recomputing the same data.
	 */
	public encodeValueAtSlot(record: TableRecord, slotInfo: SlotInfo): Hex {
		switch (slotInfo.type) {
			case 'static':
				return this.encodeStaticValueAtSlot(record, slotInfo.slotIndex)
			case 'encodedLengths':
				return this.encodeEncodedLengthsValue(record)
			case 'dynamic':
				return this.encodeDynamicValueAtSlot(slotInfo.slotIndex, slotInfo.encodedData)
		}
	}

	/* ----------------------------- PRIVATE ENCODING METHODS ----------------------------- */

	private encodeStaticValueAtSlot(record: TableRecord, slotIndex: number): Hex {
		const staticValues = this.staticFieldsInfo.fields.map(({ name, type }) =>
			record[name] === undefined ? staticAbiTypeToDefaultValue[type] : record[name],
		) as Array<StaticAbiTypeToPrimitiveType>
		const staticTypes = this.staticFieldsInfo.fields.map(({ type }) => type)

		const packedData = encodePacked(staticTypes, staticValues)
		return this.extractSlotData(packedData, slotIndex)
	}

	private encodeEncodedLengthsValue(record: TableRecord): Hex {
		const { encodedLengths } = encodeValueArgs(this.valueSchema, record as SchemaToPrimitives<typeof this.valueSchema>)
		return encodedLengths
	}

	private encodeDynamicValueAtSlot(slotIndex: number, encodedData: Hex): Hex {
		return this.extractSlotData(encodedData, slotIndex)
	}

	/* ---------------------------------- UTILS --------------------------------- */
	private encodeRecordHash(record: TableRecord) {
		const keys = Object.fromEntries(
			Object.entries(record).filter(([key]) => Object.keys(this.keySchema).includes(key)),
		) as SchemaToPrimitives<typeof this.keySchema>
		const keyTuple = encodeKey(this.keySchema, keys)

		return keccak256(concatHex([this.tableId, ...keyTuple]))
	}

	private extractSlotData(encodedData: Hex, slotIndex: number) {
		const dataBytes = hexToBytes(encodedData)

		// Extract the 32-byte chunk for this specific slot
		const startByte = slotIndex * 32
		const endByte = Math.min(startByte + 32, dataBytes.length)
		const slotData = dataBytes.slice(startByte, endByte)

		// Pad to 32 bytes if needed (right-pad with zeros)
		return pad(bytesToHex(slotData), { size: 32, dir: 'right' })
	}
}

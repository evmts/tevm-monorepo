import { type Stash, type State, type TableRecord, decodeKey, getRecord, getRecords } from '@latticexyz/stash/internal'
import type { EthGetStorageAtJsonRpcRequest, EthGetStorageAtJsonRpcResponse } from '@tevm/actions'
import type { MemoryClient } from '@tevm/memory-client'
import { type Address, type Hex, encodeAbiParameters } from '@tevm/utils'
import {
	type EIP1193RequestFn,
	bytesToHex,
	concatHex, // Changed from concat
	encodePacked,
	hexToBigInt,
	hexToBytes,
	keccak256,
	numberToHex,
	pad,
	sliceHex as slice, // Changed from slice
	toHex,
} from 'viem'

// Core MUD imports
import {
	type Table, // Actual type from @latticexyz/config
} from '@latticexyz/config'
import {
	type SchemaToPrimitives,
	decodeKeyTuple, // Replaces manual key tuple encoding attempt
	encodeKey,
	encodeKeyTuple,
	encodeValueArgs,
	getKeySchema,
	getKeyTuple,
	getSchemaTypes,
	getValueSchema, // Main function to get all parts of a record
	hexToEncodedLengths, // To parse EncodedLengths hex
	getKeySchema as protocolParserGetKeySchema, // To avoid naming clash
	getValueSchema as protocolParserGetValueSchema,
	valueSchemaToFieldLayoutHex,
} from '@latticexyz/protocol-parser/internal' // Assuming internal exports are usable
import {
	type StaticAbiType,
	isDynamicAbiType,
	isStaticAbiType,
	staticAbiTypeToByteLength,
} from '@latticexyz/schema-type/internal'
// import {
// 	type DynamicAbiType,
// 	type SchemaAbiType,
// 	type StaticAbiType,
// 	// staticAbiTypeToByteLength, // Might not be needed if using higher-level parser functions
// 	// isStaticAbiType,
// 	// isDynamicAbiType,
// } from '@latticexyz/schema-type/internal'

const STORE_SLOT: Hex = keccak256(toHex('mud.store'))
const STORE_DYNAMIC_DATA_SLOT: Hex = keccak256(toHex('mud.store.dynamicData'))
const STORE_DYNAMIC_DATA_LENGTH_SLOT: Hex = keccak256(toHex('mud.store.dynamicDataLength'))

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
				// logger.debug(`MUD Intercept: eth_getStorageAt ${storeAddress} pos ${requestedPosition}`)

				try {
					const tablesWithRecords = await getTablesWithRecords(() => getState())

					// Goal: For the given `requestedPosition` (storage slot), identify the corresponding
					// MUD table, record (key), and specific data type (static data, dynamic data length, or a specific dynamic field).

					// For the two TODOs below, as in figuring out all storage slots -> field/packed fields mappings,
					// this is pretty much what we did in polareth/evmstate during storage layout/storage diff exploration.

					// 1. Iterate through each table defined in `tablesById`.
					//    `tableIds` (derived from `getTables(stash)`) contains the string identifiers for each table.
					//    `tablesById` maps these IDs to `Table` objects from `@latticexyz/config`.
					//    `records` (from `getAllRecords(stash, tablesById)`) is an object: `{[tableId: string]: TableRecord[]}`.
					//    A `TableRecord` here is `getSchemaPrimitives<table["schema"]>` - a flat object with all decoded fields.
					for (const { table, records } of tablesWithRecords) {
						/* --------------------------------- SCHEMA --------------------------------- */
						const keySchema = getSchemaTypes(getKeySchema(table))
						const valueSchema = getSchemaTypes(getValueSchema(table))
						console.log({ keySchema, valueSchema })

						/* ------------------------------ STATIC FIELDS ----------------------------- */
						// Get static fields and their offsets
						// [[{ slot: n, offset: 0 }, { slot: n, offset: 16 }, ...], [{ slot: n + 1, offset: 0 }, { slot: n + 1, offset: 16 }, ...], ...]
						const staticFieldsLayout = Object.entries(valueSchema)
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

						const getStaticAccessedSlotLayout = (record: TableRecord) => {
							const keys = Object.fromEntries(
								Object.entries(record).filter(([key]) => Object.keys(keySchema).includes(key)),
							) as SchemaToPrimitives<typeof keySchema>
							const keyTuple = encodeKey(keySchema, keys)

							const baseRecordHash = keccak256(concatHex([table.tableId, ...keyTuple]))
							const baseSlot = hexToBigInt(STORE_SLOT) ^ hexToBigInt(baseRecordHash)
							const allSlots = [
								numberToHex(baseSlot, { size: 32 }),
								...staticFieldsLayout.slice(1).map((_, index) => numberToHex(baseSlot + BigInt(index), { size: 32 })),
							]

							const accessedSlot = allSlots.find((slot) => slot.toLowerCase() === requestedPosition.toLowerCase())
							if (accessedSlot) return staticFieldsLayout[allSlots.indexOf(accessedSlot)]!
							return null
						}

						for (const record of records) {
							const accessedSlotLayout = getStaticAccessedSlotLayout(record)
							if (accessedSlotLayout) {
								const values = accessedSlotLayout
									.sort((a, b) => Object.keys(valueSchema).indexOf(a.name) - Object.keys(valueSchema).indexOf(b.name))
									.map((field) => record[field.name])

								const encodedValues = pad(encodePacked(Object.values(valueSchema), values), { size: 32, dir: 'right' })
								logger.debug('Returning static data', encodedValues)
								logger.debug('Would have returned', await originalRequest(requestArgs, options))
								return encodedValues
							}
						}

						/* ----------------------------- ENCODED LENGTHS ---------------------------- */

						/* ------------------------------ DYNAMIC FIELDS ----------------------------- */
						const dynamicFields = Object.fromEntries(
							Object.entries(valueSchema).filter(([, value]) => isDynamicAbiType(value)),
						)
					}

					//    For each `tableIdString` in `tableIds`:
					//      a. Get the `tableConfig = tablesById[tableIdString]`. This is the `Table` object from MUD config.
					//      b. The `tableIdHex = tableConfig.tableId` (this is the `bytes32` table ID).
					//      c. Get `keySchemaObject` for the current table using `protocolParserGetKeySchema(tableConfig)`. This returns a schema object like `{ staticFields: ['type1'], dynamicFields: [] }`.
					//      d. Get `valueSchemaObject` for the current table using `protocolParserGetValueSchema(tableConfig)`. This also returns an old-style schema object.
					//      e. Get `numStaticFields = valueSchemaObject.staticFields.length`.
					//      f. Get `dynamicFieldAbiTypes = valueSchemaObject.dynamicFields`. (These are `DynamicAbiType[]`)
					//      g. Get the list of records for this table: `recordsForTable = records[tableIdString]`.

					// 2. For each `recordInStash` in `recordsForTable`:
					//      `recordInStash` is an object e.g., `{ keyField1: value1, valueField1: value2, ... }`.
					//      a. Construct `decodedKeyObject`: Extract the key fields from `recordInStash` based on the field names in `keySchemaObject.staticFields` (assuming keys are only static, which they are).
					//         More robustly, use the actual key names from `tableConfig.key` (which is `readonly string[]`).
					//         `const decodedKeyObject = Object.fromEntries(tableConfig.key.map(keyName => [keyName, recordInStash[keyName]]));`
					//      b. Encode this `decodedKeyObject` into a `keyTuple` (array of `Hex` (bytes32)):
					//         `const keyTuple = encodeKey(keySchemaObject, decodedKeyObject);` (`encodeKey` is imported from `@latticexyz/protocol-parser/internal`).

					//      c. Calculate the potential static data storage slot:
					//         TODO: we'll need to calculate all the slots the static data occupies, then map the field/packed fields to their slot
					//         using the offset of each field
					//         Then we can do the following for each slot:
					//         `const recordHashStatic = keccak256(concatHex([tableIdHex, ...keyTuple]));`
					//         `const staticDataSlot = numberToHex(hexToBigInt(STORE_SLOT) ^ hexToBigInt(recordHashStatic), { size: 32 });`
					//         If `staticDataSlot.toLowerCase() === requestedPosition.toLowerCase()`:
					//           - Found! It's the static data for `tableIdHex` and `keyTuple`.
					//           - The "field" is the entire block of static data.
					//           - Log match: tableId, keyTuple, type "static data".
					//           - (Future: retrieve data, encode, and return). Stop further checks for this request.

					//      d. If `dynamicFieldAbiTypes.length > 0`:
					//          i. Calculate the potential dynamic data length storage slot:
					//             `const recordHashDynamicLength = keccak256(concatHex([tableIdHex, ...keyTuple]));` (same as recordHashStatic)
					//             `const dynamicDataLengthSlot = numberToHex(hexToBigInt(STORE_DYNAMIC_DATA_LENGTH_SLOT) ^ hexToBigInt(recordHashDynamicLength), { size: 32 });`
					//             If `dynamicDataLengthSlot.toLowerCase() === requestedPosition.toLowerCase()`:
					//               - Found! It's the `encodedLengths` slot for `tableIdHex` and `keyTuple`.
					//               - Log match: tableId, keyTuple, type "encoded lengths".
					//               - (Future: retrieve data, encode, and return). Stop further checks for this request.

					//          ii. Calculate potential dynamic data storage slots for each dynamic field:
					//              TODO: same as above, we'll need to get the offset of each dynamic field, and also it could occupy multiple slots
					//              `const recordHashDynamic = keccak256(concatHex([tableIdHex, ...keyTuple]));` (same as recordHashStatic)
					//              For `dynamicFieldIndex` from `0` to `dynamicFieldAbiTypes.length - 1`:
					//                  `const dynamicFieldSlot = numberToHex(hexToBigInt(STORE_DYNAMIC_DATA_SLOT) ^ BigInt(dynamicFieldIndex) ^ hexToBigInt(recordHashDynamic), { size: 32 });`
					//                  (Note: `BigInt(dynamicFieldIndex)` XORs the numeric value of the index. This matches Solidity's `bytes1(dynamicFieldIndex)` behavior for small indices in XOR ops with larger `bytes32` values).
					//                  If `dynamicFieldSlot.toLowerCase() === requestedPosition.toLowerCase()`:
					//                      - Found! It's the data for the dynamic field `dynamicFieldAbiTypes[dynamicFieldIndex]`.
					//                      - To get field name: The `valueSchemaObject.dynamicFields` are ordered. The name isn't directly in `dynamicFieldAbiTypes`.
					//                        One would need to map `dynamicFieldIndex` back to a field name from the original full `tableConfig.schema` by skipping static fields.
					//                        You would also need `isStaticAbiType` and `isDynamicAbiType` from `@latticexyz/schema-type/internal`
					//                        Example to get field name:
					//                        `const allValueFieldNames = Object.keys(tableConfig.schema).filter(name => !tableConfig.key.includes(name));`
					//                        `const staticValueFieldNames = allValueFieldNames.filter(name => isStaticAbiType(tableConfig.schema[name].type));`
					//                        `const dynamicValueFieldNames = allValueFieldNames.filter(name => isDynamicAbiType(tableConfig.schema[name].type));`
					//                        `const matchedFieldName = dynamicValueFieldNames[dynamicFieldIndex];`
					//                      - Log match: tableId, keyTuple, type "dynamic field", fieldName, dynamicFieldIndex.
					//                      - (Future: retrieve data, encode, and return). Stop further checks for this request.

					// 3. If a match is found in any of the above steps (and not already returned):
					//    - The log entry from the specific match is sufficient.
					//    - Break loops and prepare to return the mocked value.
					//    - For POC, `console.log` the findings. For actual implementation, construct and return the hex value.
					//    - `return mockedValue;`

					// 4. If no match is found after checking all tables and all their records for the `requestedPosition`:
					//    - The `logger.debug` message "No MUD data in stash..." will be hit.
					//    - The request will then fall through to `originalRequest.call(this, requestArgs, options)`.

					/* -------------------------------- END PLAN -------------------------------- */

					// logger.debug(`No MUD data in stash for position ${requestedPosition}. Fallback to fork.`)
				} catch (error: any) {
					logger.error(`Error in MUD storage interception: ${error.message} ${error.stack}`, error)
				}
			}

			return originalRequest(requestArgs, options)
		}
	}

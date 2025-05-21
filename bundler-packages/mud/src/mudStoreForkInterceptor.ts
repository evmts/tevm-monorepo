import { type Stash, type TableRecord, decodeKey, getRecord, getRecords } from '@latticexyz/stash/internal'
import type { EthGetStorageAtJsonRpcRequest, EthGetStorageAtJsonRpcResponse } from '@tevm/actions'
import type { MemoryClient } from '@tevm/memory-client'
import type { Address, Hex } from '@tevm/utils'
import {
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
	decodeKeyTuple, // Replaces manual key tuple encoding attempt
	encodeKey,
	encodeKeyTuple,
	encodeValueArgs,
	getKeySchema,
	getKeyTuple,
	getSchemaTypes, // Main function to get all parts of a record
	hexToEncodedLengths, // To parse EncodedLengths hex
	getKeySchema as protocolParserGetKeySchema, // To avoid naming clash
	getValueSchema as protocolParserGetValueSchema,
	valueSchemaToFieldLayoutHex,
} from '@latticexyz/protocol-parser/internal' // Assuming internal exports are usable
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

const getTables = (stash: Stash) => {
	const tablesById = Object.fromEntries(
		Object.values(stash.get().config)
			.flatMap((namespace) => Object.values(namespace) as readonly Table[])
			.map((table) => [table.tableId, table]),
	)

	return { tablesById, tableIds: Object.keys(tablesById) }
}

const getAllRecords = (stash: Stash, tablesById: Record<string, Table>) => {
	const records = Object.fromEntries(
		Object.entries(tablesById).map(([tableId, table]) => {
			return [tableId, getRecords({ stash, table })]
		}),
	)

	return records
}

export const mudStoreForkInterceptor =
	({ stash, storeAddress }: { stash: Stash; storeAddress: Address }) =>
	(client: MemoryClient): any => {
		// const logger = client.transport.tevm.logger;
		const logger = console
		if (!client.transport?.tevm?.forkTransport?.request) {
			logger.warn('No fork transport found - MUD storage interceptor will have no effect')
			return {}
		}

		const { tablesById, tableIds } = getTables(stash)

		const originalForkRequest = client.transport.tevm.forkTransport.request
		client.transport.tevm.forkTransport.request = async function interceptedRequest(
			requestArgs: any,
			options: any,
		): Promise<EthGetStorageAtJsonRpcResponse | undefined> {
			if (
				requestArgs.method === 'eth_getStorageAt' &&
				requestArgs.params &&
				Array.isArray(requestArgs.params) &&
				requestArgs.params[0]?.toLowerCase() === storeAddress.toLowerCase()
			) {
				const requestedPosition = requestArgs.params[1] as Hex
				logger.debug(`MUD Intercept: eth_getStorageAt ${storeAddress} pos ${requestedPosition}`)

				try {
					const records = getAllRecords(stash, tablesById)
					console.log({ records })

					/* ----------------------------------- POC ---------------------------------- */
					// position of player is stored at slot: 0x4e4b8e26ffb342bf2c02b7d8accf09945411e68c9f4dfcc636a9ff4365c84aaf
					// Position tableId: 0x74626170700000000000000000000000506f736974696f6e0000000000000000
					// player key: 0xAD285b5dF24BDE77A8391924569AF2AD2D4eE4A7
					const positionTableId = '0x74626170700000000000000000000000506f736974696f6e0000000000000000'
					const positionTable = tablesById[positionTableId]!
					const playerKey = { player: '0xAD285b5dF24BDE77A8391924569AF2AD2D4eE4A7' as Hex }

					const positionKeySchema = getSchemaTypes(getKeySchema(positionTable))
					const keyTuple = encodeKey(positionKeySchema, playerKey)

					const recordHashStatic = keccak256(concatHex([positionTableId, ...keyTuple]))
					const staticDataSlot = numberToHex(hexToBigInt(STORE_SLOT) ^ hexToBigInt(recordHashStatic), { size: 32 })

					if (requestedPosition.toLowerCase() === staticDataSlot.toLowerCase()) {
						const data = getRecord({ stash, table: positionTable!, key: playerKey })
						console.log({ data })
					}
					/* --------------------------------- END POC -------------------------------- */

					/* ---------------------------------- PLAN ---------------------------------- */

					// Goal: For the given `requestedPosition` (storage slot), identify the corresponding
					// MUD table, record (key), and specific data type (static data, dynamic data length, or a specific dynamic field).

					// 1. Iterate through each table defined in `tablesById`.
					//    `tableIds` (derived from `getTables(stash)`) contains the string identifiers for each table.
					//    `tablesById` maps these IDs to `Table` objects from `@latticexyz/config`.
					//    `records` (from `getAllRecords(stash, tablesById)`) is an object: `{[tableId: string]: TableRecord[]}`.
					//    A `TableRecord` here is `getSchemaPrimitives<table["schema"]>` - a flat object with all decoded fields.

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
					//    - The request will then fall through to `originalForkRequest.call(this, requestArgs, options)`.

					/* -------------------------------- END PLAN -------------------------------- */

					logger.debug(`No MUD data in stash for position ${requestedPosition}. Fallback to fork.`)
				} catch (error: any) {
					logger.error(`Error in MUD storage interception: ${error.message} ${error.stack}`, error)
				}
			}

			return originalForkRequest.call(this, requestArgs, options) as Promise<EthGetStorageAtJsonRpcResponse>
		}
		return {}
	}

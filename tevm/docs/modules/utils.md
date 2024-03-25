[tevm](../README.md) / [Modules](../modules.md) / utils

# Module: utils

## Table of contents

### References

- [Abi](utils.md#abi)
- [AbiConstructor](utils.md#abiconstructor)
- [AbiEvent](utils.md#abievent)
- [AbiFunction](utils.md#abifunction)
- [AbiItemType](utils.md#abiitemtype)
- [AbiParametersToPrimitiveTypes](utils.md#abiparameterstoprimitivetypes)
- [Account](utils.md#account)
- [Address](utils.md#address)
- [BlockNumber](utils.md#blocknumber)
- [BlockTag](utils.md#blocktag)
- [ContractFunctionName](utils.md#contractfunctionname)
- [CreateEventFilterParameters](utils.md#createeventfilterparameters)
- [CreateMemoryDbFn](utils.md#creatememorydbfn)
- [DecodeFunctionResultReturnType](utils.md#decodefunctionresultreturntype)
- [EncodeFunctionDataParameters](utils.md#encodefunctiondataparameters)
- [ExtractAbiEvent](utils.md#extractabievent)
- [ExtractAbiEventNames](utils.md#extractabieventnames)
- [ExtractAbiEvents](utils.md#extractabievents)
- [ExtractAbiFunction](utils.md#extractabifunction)
- [ExtractAbiFunctionNames](utils.md#extractabifunctionnames)
- [Filter](utils.md#filter)
- [FormatAbi](utils.md#formatabi)
- [GetEventArgs](utils.md#geteventargs)
- [HDAccount](utils.md#hdaccount)
- [Hex](utils.md#hex)
- [MemoryDb](utils.md#memorydb)
- [ParseAbi](utils.md#parseabi)
- [boolToBytes](utils.md#booltobytes)
- [boolToHex](utils.md#booltohex)
- [bytesToBigInt](utils.md#bytestobigint)
- [bytesToBigint](utils.md#bytestobigint-1)
- [bytesToBool](utils.md#bytestobool)
- [bytesToHex](utils.md#bytestohex)
- [bytesToNumber](utils.md#bytestonumber)
- [createMemoryDb](utils.md#creatememorydb)
- [decodeAbiParameters](utils.md#decodeabiparameters)
- [decodeErrorResult](utils.md#decodeerrorresult)
- [decodeEventLog](utils.md#decodeeventlog)
- [decodeFunctionData](utils.md#decodefunctiondata)
- [decodeFunctionResult](utils.md#decodefunctionresult)
- [encodeAbiParameters](utils.md#encodeabiparameters)
- [encodeDeployData](utils.md#encodedeploydata)
- [encodeErrorResult](utils.md#encodeerrorresult)
- [encodeEventTopics](utils.md#encodeeventtopics)
- [encodeFunctionData](utils.md#encodefunctiondata)
- [encodeFunctionResult](utils.md#encodefunctionresult)
- [encodePacked](utils.md#encodepacked)
- [formatAbi](utils.md#formatabi-1)
- [formatEther](utils.md#formatether)
- [formatGwei](utils.md#formatgwei)
- [formatLog](utils.md#formatlog)
- [fromBytes](utils.md#frombytes)
- [fromHex](utils.md#fromhex)
- [fromRlp](utils.md#fromrlp)
- [getAddress](utils.md#getaddress)
- [hexToBigInt](utils.md#hextobigint)
- [hexToBool](utils.md#hextobool)
- [hexToBytes](utils.md#hextobytes)
- [hexToNumber](utils.md#hextonumber)
- [hexToString](utils.md#hextostring)
- [isAddress](utils.md#isaddress)
- [isBytes](utils.md#isbytes)
- [isHex](utils.md#ishex)
- [keccak256](utils.md#keccak256)
- [mnemonicToAccount](utils.md#mnemonictoaccount)
- [numberToHex](utils.md#numbertohex)
- [parseAbi](utils.md#parseabi-1)
- [parseEther](utils.md#parseether)
- [parseGwei](utils.md#parsegwei)
- [stringToHex](utils.md#stringtohex)
- [toBytes](utils.md#tobytes)
- [toHex](utils.md#tohex)
- [toRlp](utils.md#torlp)

### Classes

- [EthjsAccount](../classes/utils.EthjsAccount.md)
- [EthjsAddress](../classes/utils.EthjsAddress.md)

### Interfaces

- [GenesisState](../interfaces/utils.GenesisState.md)

### Type Aliases

- [BigIntToHex](utils.md#biginttohex)
- [JsonSerializable](utils.md#jsonserializable)
- [JsonSerializableArray](utils.md#jsonserializablearray)
- [JsonSerializableObject](utils.md#jsonserializableobject)
- [JsonSerializableSet](utils.md#jsonserializableset)
- [SerializeToJson](utils.md#serializetojson)
- [SetToHex](utils.md#settohex)
- [WithdrawalData](utils.md#withdrawaldata)

### Functions

- [equalsBytes](utils.md#equalsbytes)

## References

### Abi

Re-exports [Abi](index.md#abi)

___

### AbiConstructor

Re-exports [AbiConstructor](index.md#abiconstructor)

___

### AbiEvent

Re-exports [AbiEvent](index.md#abievent)

___

### AbiFunction

Re-exports [AbiFunction](index.md#abifunction)

___

### AbiItemType

Re-exports [AbiItemType](index.md#abiitemtype)

___

### AbiParametersToPrimitiveTypes

Re-exports [AbiParametersToPrimitiveTypes](index.md#abiparameterstoprimitivetypes)

___

### Account

Re-exports [Account](index.md#account)

___

### Address

Re-exports [Address](index.md#address)

___

### BlockNumber

Re-exports [BlockNumber](index.md#blocknumber)

___

### BlockTag

Re-exports [BlockTag](index.md#blocktag)

___

### ContractFunctionName

Re-exports [ContractFunctionName](index.md#contractfunctionname)

___

### CreateEventFilterParameters

Re-exports [CreateEventFilterParameters](index.md#createeventfilterparameters)

___

### CreateMemoryDbFn

Re-exports [CreateMemoryDbFn](index.md#creatememorydbfn)

___

### DecodeFunctionResultReturnType

Re-exports [DecodeFunctionResultReturnType](index.md#decodefunctionresultreturntype)

___

### EncodeFunctionDataParameters

Re-exports [EncodeFunctionDataParameters](index.md#encodefunctiondataparameters)

___

### ExtractAbiEvent

Re-exports [ExtractAbiEvent](index.md#extractabievent)

___

### ExtractAbiEventNames

Re-exports [ExtractAbiEventNames](index.md#extractabieventnames)

___

### ExtractAbiEvents

Re-exports [ExtractAbiEvents](index.md#extractabievents)

___

### ExtractAbiFunction

Re-exports [ExtractAbiFunction](index.md#extractabifunction)

___

### ExtractAbiFunctionNames

Re-exports [ExtractAbiFunctionNames](index.md#extractabifunctionnames)

___

### Filter

Re-exports [Filter](index.md#filter)

___

### FormatAbi

Re-exports [FormatAbi](index.md#formatabi)

___

### GetEventArgs

Re-exports [GetEventArgs](index.md#geteventargs)

___

### HDAccount

Re-exports [HDAccount](index.md#hdaccount)

___

### Hex

Re-exports [Hex](index.md#hex)

___

### MemoryDb

Re-exports [MemoryDb](index.md#memorydb)

___

### ParseAbi

Re-exports [ParseAbi](index.md#parseabi)

___

### boolToBytes

Re-exports [boolToBytes](index.md#booltobytes)

___

### boolToHex

Re-exports [boolToHex](index.md#booltohex)

___

### bytesToBigInt

Renames and re-exports [bytesToBigint](index.md#bytestobigint-1)

___

### bytesToBigint

Re-exports [bytesToBigint](index.md#bytestobigint-1)

___

### bytesToBool

Re-exports [bytesToBool](index.md#bytestobool)

___

### bytesToHex

Re-exports [bytesToHex](index.md#bytestohex)

___

### bytesToNumber

Re-exports [bytesToNumber](index.md#bytestonumber)

___

### createMemoryDb

Re-exports [createMemoryDb](index.md#creatememorydb)

___

### decodeAbiParameters

Re-exports [decodeAbiParameters](index.md#decodeabiparameters)

___

### decodeErrorResult

Re-exports [decodeErrorResult](index.md#decodeerrorresult)

___

### decodeEventLog

Re-exports [decodeEventLog](index.md#decodeeventlog)

___

### decodeFunctionData

Re-exports [decodeFunctionData](index.md#decodefunctiondata)

___

### decodeFunctionResult

Re-exports [decodeFunctionResult](index.md#decodefunctionresult)

___

### encodeAbiParameters

Re-exports [encodeAbiParameters](index.md#encodeabiparameters)

___

### encodeDeployData

Re-exports [encodeDeployData](index.md#encodedeploydata)

___

### encodeErrorResult

Re-exports [encodeErrorResult](index.md#encodeerrorresult)

___

### encodeEventTopics

Re-exports [encodeEventTopics](index.md#encodeeventtopics)

___

### encodeFunctionData

Re-exports [encodeFunctionData](index.md#encodefunctiondata)

___

### encodeFunctionResult

Re-exports [encodeFunctionResult](index.md#encodefunctionresult)

___

### encodePacked

Re-exports [encodePacked](index.md#encodepacked)

___

### formatAbi

Re-exports [formatAbi](index.md#formatabi-1)

___

### formatEther

Re-exports [formatEther](index.md#formatether)

___

### formatGwei

Re-exports [formatGwei](index.md#formatgwei)

___

### formatLog

Re-exports [formatLog](index.md#formatlog)

___

### fromBytes

Re-exports [fromBytes](index.md#frombytes)

___

### fromHex

Re-exports [fromHex](index.md#fromhex)

___

### fromRlp

Re-exports [fromRlp](index.md#fromrlp)

___

### getAddress

Re-exports [getAddress](index.md#getaddress)

___

### hexToBigInt

Re-exports [hexToBigInt](index.md#hextobigint)

___

### hexToBool

Re-exports [hexToBool](index.md#hextobool)

___

### hexToBytes

Re-exports [hexToBytes](index.md#hextobytes)

___

### hexToNumber

Re-exports [hexToNumber](index.md#hextonumber)

___

### hexToString

Re-exports [hexToString](index.md#hextostring)

___

### isAddress

Re-exports [isAddress](index.md#isaddress)

___

### isBytes

Re-exports [isBytes](index.md#isbytes)

___

### isHex

Re-exports [isHex](index.md#ishex)

___

### keccak256

Re-exports [keccak256](index.md#keccak256)

___

### mnemonicToAccount

Re-exports [mnemonicToAccount](index.md#mnemonictoaccount)

___

### numberToHex

Re-exports [numberToHex](index.md#numbertohex)

___

### parseAbi

Re-exports [parseAbi](index.md#parseabi-1)

___

### parseEther

Re-exports [parseEther](index.md#parseether)

___

### parseGwei

Re-exports [parseGwei](index.md#parsegwei)

___

### stringToHex

Re-exports [stringToHex](index.md#stringtohex)

___

### toBytes

Re-exports [toBytes](index.md#tobytes)

___

### toHex

Re-exports [toHex](index.md#tohex)

___

### toRlp

Re-exports [toRlp](index.md#torlp)

## Type Aliases

### BigIntToHex

Ƭ **BigIntToHex**\<`T`\>: `T` extends `bigint` ? [`Hex`](index.md#hex) : `T`

A helper type that converts a bigint to a hex string.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

evmts-monorepo/packages/utils/types/SerializeToJson.d.ts:23

___

### JsonSerializable

Ƭ **JsonSerializable**: `bigint` \| `string` \| `number` \| `boolean` \| ``null`` \| [`JsonSerializableArray`](utils.md#jsonserializablearray) \| [`JsonSerializableObject`](utils.md#jsonserializableobject) \| [`JsonSerializableSet`](utils.md#jsonserializableset)

A type that represents a JSON-serializable value.

#### Defined in

evmts-monorepo/packages/utils/types/SerializeToJson.d.ts:5

___

### JsonSerializableArray

Ƭ **JsonSerializableArray**: `ReadonlyArray`\<[`JsonSerializable`](utils.md#jsonserializable)\>

A type that represents a JSON-serializable array.

#### Defined in

evmts-monorepo/packages/utils/types/SerializeToJson.d.ts:9

___

### JsonSerializableObject

Ƭ **JsonSerializableObject**: `Object`

A type that represents a JSON-serializable object.

#### Index signature

▪ [key: `string`]: [`JsonSerializable`](utils.md#jsonserializable)

#### Defined in

evmts-monorepo/packages/utils/types/SerializeToJson.d.ts:13

___

### JsonSerializableSet

Ƭ **JsonSerializableSet**\<`T`\>: `Set`\<`T`\>

A type that represents a JSON-serializable set.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `bigint` \| `string` \| `number` \| `boolean` = `bigint` \| `string` \| `number` \| `boolean` |

#### Defined in

evmts-monorepo/packages/utils/types/SerializeToJson.d.ts:19

___

### SerializeToJson

Ƭ **SerializeToJson**\<`T`\>: `T` extends [`JsonSerializableSet`](utils.md#jsonserializableset)\<infer S\> ? `ReadonlyArray`\<`S`\> : `T` extends [`JsonSerializableObject`](utils.md#jsonserializableobject) ? \{ [P in keyof T]: SerializeToJson\<T[P]\> } : `T` extends [`JsonSerializableArray`](utils.md#jsonserializablearray) ? [`SerializeToJson`](utils.md#serializetojson)\<`T`[`number`]\>[] : [`BigIntToHex`](utils.md#biginttohex)\<[`SetToHex`](utils.md#settohex)\<`T`\>\>

A helper type that converts a widened JSON-serializable value to a JSON-serializable value.
It replaces bigint with hex strings and sets with arrays.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

evmts-monorepo/packages/utils/types/SerializeToJson.d.ts:32

___

### SetToHex

Ƭ **SetToHex**\<`T`\>: `T` extends `Set`\<`any`\> ? [`Hex`](index.md#hex) : `T`

A helper type that converts a set to a hex string.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

evmts-monorepo/packages/utils/types/SerializeToJson.d.ts:27

___

### WithdrawalData

Ƭ **WithdrawalData**: `Object`

Flexible input data type for EIP-4895 withdrawal data with amount in Gwei to
match CL representation and for eventual ssz withdrawalsRoot

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | `AddressLike` |
| `amount` | `BigIntLike` |
| `index` | `BigIntLike` |
| `validatorIndex` | `BigIntLike` |

#### Defined in

evmts-monorepo/node_modules/.pnpm/@ethereumjs+util@9.0.3/node_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:7

## Functions

### equalsBytes

▸ **equalsBytes**(`a`, `b`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `Uint8Array` |
| `b` | `Uint8Array` |

#### Returns

`boolean`

#### Defined in

evmts-monorepo/node_modules/.pnpm/ethereum-cryptography@2.1.3/node_modules/ethereum-cryptography/utils.d.ts:7

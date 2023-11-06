[Documentation](../README.md) / [Modules](../modules.md) / [@evmts/viem](evmts_viem.md) / utils

# Module: utils

## Table of contents

### Functions

- [assertRequestEffect](evmts_viem.utils.md#assertrequesteffect)
- [buildRequestEffect](evmts_viem.utils.md#buildrequesteffect)
- [concatEffect](evmts_viem.utils.md#concateffect)
- [decodeAbiParametersEffect](evmts_viem.utils.md#decodeabiparameterseffect)
- [decodeDeployDataEffect](evmts_viem.utils.md#decodedeploydataeffect)
- [decodeErrorResultEffect](evmts_viem.utils.md#decodeerrorresulteffect)
- [decodeEventLogEffect](evmts_viem.utils.md#decodeeventlogeffect)
- [decodeFunctionDataEffect](evmts_viem.utils.md#decodefunctiondataeffect)
- [decodeFunctionResultEffect](evmts_viem.utils.md#decodefunctionresulteffect)
- [encodeAbiParametersEffect](evmts_viem.utils.md#encodeabiparameterseffect)
- [encodeDeployDataEffect](evmts_viem.utils.md#encodedeploydataeffect)
- [encodeErrorResultEffect](evmts_viem.utils.md#encodeerrorresulteffect)
- [encodeEventTopicsEffect](evmts_viem.utils.md#encodeeventtopicseffect)
- [encodeFunctionDataEffect](evmts_viem.utils.md#encodefunctiondataeffect)
- [encodeFunctionResultEffect](evmts_viem.utils.md#encodefunctionresulteffect)
- [encodePackedEffect](evmts_viem.utils.md#encodepackedeffect)
- [extractEffect](evmts_viem.utils.md#extracteffect)
- [formatAbiItemEffect](evmts_viem.utils.md#formatabiitemeffect)
- [formatAbiItemWithArgsEffect](evmts_viem.utils.md#formatabiitemwithargseffect)
- [formatEtherEffect](evmts_viem.utils.md#formatethereffect)
- [formatGweiEffect](evmts_viem.utils.md#formatgweieffect)
- [formatUnitsEffect](evmts_viem.utils.md#formatunitseffect)
- [fromBytesEffect](evmts_viem.utils.md#frombyteseffect)
- [fromHexEffect](evmts_viem.utils.md#fromhexeffect)
- [fromRlpEffect](evmts_viem.utils.md#fromrlpeffect)
- [getAbiItemEffect](evmts_viem.utils.md#getabiitemeffect)
- [getAddressEffect](evmts_viem.utils.md#getaddresseffect)
- [getContractAddressEffect](evmts_viem.utils.md#getcontractaddresseffect)
- [getEventSelectorEffect](evmts_viem.utils.md#geteventselectoreffect)
- [getEventSignatureEffect](evmts_viem.utils.md#geteventsignatureeffect)
- [getFunctionSelectorEffect](evmts_viem.utils.md#getfunctionselectoreffect)
- [getFunctionSignatureEffect](evmts_viem.utils.md#getfunctionsignatureeffect)
- [getSerializedTransactionTypeEffect](evmts_viem.utils.md#getserializedtransactiontypeeffect)
- [getTransactionTypeEffect](evmts_viem.utils.md#gettransactiontypeeffect)
- [hashMessageEffect](evmts_viem.utils.md#hashmessageeffect)
- [hashTypedDataEffect](evmts_viem.utils.md#hashtypeddataeffect)
- [hexToSignatureEffect](evmts_viem.utils.md#hextosignatureeffect)
- [isAddressEffect](evmts_viem.utils.md#isaddresseffect)
- [isAddressEqualEffect](evmts_viem.utils.md#isaddressequaleffect)
- [isBytesEffect](evmts_viem.utils.md#isbyteseffect)
- [isHashEffect](evmts_viem.utils.md#ishasheffect)
- [isHexEffect](evmts_viem.utils.md#ishexeffect)
- [keccak256Effect](evmts_viem.utils.md#keccak256effect)
- [padEffect](evmts_viem.utils.md#padeffect)
- [parseEtherEffect](evmts_viem.utils.md#parseethereffect)
- [parseGweiEffect](evmts_viem.utils.md#parsegweieffect)
- [parseTransactionEffect](evmts_viem.utils.md#parsetransactioneffect)
- [parseUnitsEffect](evmts_viem.utils.md#parseunitseffect)
- [recoverAddressEffect](evmts_viem.utils.md#recoveraddresseffect)
- [recoverMessageAddressEffect](evmts_viem.utils.md#recovermessageaddresseffect)
- [recoverPublicKeyEffect](evmts_viem.utils.md#recoverpublickeyeffect)
- [recoverTypedDataAddressEffect](evmts_viem.utils.md#recovertypeddataaddresseffect)
- [serializeAccessListEffect](evmts_viem.utils.md#serializeaccesslisteffect)
- [serializeTransactionEffect](evmts_viem.utils.md#serializetransactioneffect)
- [signatureToHexEffect](evmts_viem.utils.md#signaturetohexeffect)
- [sizeEffect](evmts_viem.utils.md#sizeeffect)
- [sliceEffect](evmts_viem.utils.md#sliceeffect)
- [stringifyEffect](evmts_viem.utils.md#stringifyeffect)
- [toBytesEffect](evmts_viem.utils.md#tobyteseffect)
- [toHexEffect](evmts_viem.utils.md#tohexeffect)
- [toRlpEffect](evmts_viem.utils.md#torlpeffect)
- [trimEffect](evmts_viem.utils.md#trimeffect)
- [verifyMessageEffect](evmts_viem.utils.md#verifymessageeffect)
- [verifyTypedDataEffect](evmts_viem.utils.md#verifytypeddataeffect)

## Functions

### assertRequestEffect

▸ **assertRequestEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `AssertRequestErrorType`, `void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [args: AssertRequestParameters] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `AssertRequestErrorType`, `void`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### buildRequestEffect

▸ **buildRequestEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `never`, (`args`: `any`) => `Promise`\<`any`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [(`args`: `any`) => `Promise`\<`any`\>, Object?] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `never`, (`args`: `any`) => `Promise`\<`any`\>\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### concatEffect

▸ **concatEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `ConcatErrorType`, \`0x$\{string}\` \| `Uint8Array`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [values: readonly (\`0x$\{string}\` \| Uint8Array)[]] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `ConcatErrorType`, \`0x$\{string}\` \| `Uint8Array`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### decodeAbiParametersEffect

▸ **decodeAbiParametersEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `DecodeAbiParametersErrorType`, `unknown`[] \| readonly `unknown`[]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [params: readonly unknown[] \| readonly AbiParameter[], data: \`0x$\{string}\`] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `DecodeAbiParametersErrorType`, `unknown`[] \| readonly `unknown`[]\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### decodeDeployDataEffect

▸ **decodeDeployDataEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `DecodeDeployDataErrorType`, `DecodeDeployDataReturnType`\<`Abi` \| readonly `unknown`[]\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [`DecodeDeployDataParameters`\<`Abi` \| readonly `unknown`[]\>] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `DecodeDeployDataErrorType`, `DecodeDeployDataReturnType`\<`Abi` \| readonly `unknown`[]\>\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### decodeErrorResultEffect

▸ **decodeErrorResultEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `DecodeErrorResultErrorType`, \{ `abiItem`: `AbiConstructor` \| `AbiError` \| `AbiEvent` \| `AbiFallback` \| `AbiFunction` \| `AbiReceive` ; `args`: `undefined` \| readonly `unknown`[] ; `errorName`: `string`  }\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [`DecodeErrorResultParameters`\<`Abi` \| readonly `unknown`[]\>] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `DecodeErrorResultErrorType`, \{ `abiItem`: `AbiConstructor` \| `AbiError` \| `AbiEvent` \| `AbiFallback` \| `AbiFunction` \| `AbiReceive` ; `args`: `undefined` \| readonly `unknown`[] ; `errorName`: `string`  }\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### decodeEventLogEffect

▸ **decodeEventLogEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `DecodeEventLogErrorType`, \{ `args`: \{} \| \{} ; `eventName`: `string`  } \| \{ `args`: \{} \| \{} ; `eventName`: `string`  }\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [`DecodeEventLogParameters`\<`Abi` \| readonly `unknown`[], `undefined` \| `string`, \`0x$\{string}\`[], `undefined` \| \`0x$\{string}\`, `boolean`\>] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `DecodeEventLogErrorType`, \{ `args`: \{} \| \{} ; `eventName`: `string`  } \| \{ `args`: \{} \| \{} ; `eventName`: `string`  }\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### decodeFunctionDataEffect

▸ **decodeFunctionDataEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `DecodeFunctionDataErrorType`, \{ `args`: `undefined` \| readonly `unknown`[] ; `functionName`: `string`  }\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [`DecodeFunctionDataParameters`\<`Abi` \| readonly `unknown`[]\>] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `DecodeFunctionDataErrorType`, \{ `args`: `undefined` \| readonly `unknown`[] ; `functionName`: `string`  }\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### decodeFunctionResultEffect

▸ **decodeFunctionResultEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `DecodeFunctionResultErrorType`, `unknown`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [`DecodeFunctionResultParameters`\<`Abi` \| readonly `unknown`[], `undefined` \| `string`, `undefined` \| `string`\>] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `DecodeFunctionResultErrorType`, `unknown`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### encodeAbiParametersEffect

▸ **encodeAbiParametersEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `EncodeAbiParametersErrorType`, \`0x$\{string}\`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [params: readonly unknown[] \| readonly AbiParameter[], values: readonly unknown[]] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `EncodeAbiParametersErrorType`, \`0x$\{string}\`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### encodeDeployDataEffect

▸ **encodeDeployDataEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `EncodeDeployDataErrorType`, \`0x$\{string}\`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [`EncodeDeployDataParameters`\<`Abi` \| readonly `unknown`[]\>] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `EncodeDeployDataErrorType`, \`0x$\{string}\`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### encodeErrorResultEffect

▸ **encodeErrorResultEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `EncodeErrorResultErrorType`, \`0x$\{string}\`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [`EncodeErrorResultParameters`\<`Abi` \| readonly `unknown`[], `undefined` \| `string`, `undefined` \| `string`\>] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `EncodeErrorResultErrorType`, \`0x$\{string}\`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### encodeEventTopicsEffect

▸ **encodeEventTopicsEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `EncodeErrorResultErrorType`, \`0x$\{string}\`[]\>

I manually updated this

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [`EncodeEventTopicsParameters`\<`Abi` \| readonly `unknown`[], `undefined` \| `string`, `undefined` \| `string`\>] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `EncodeErrorResultErrorType`, \`0x$\{string}\`[]\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### encodeFunctionDataEffect

▸ **encodeFunctionDataEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `EncodeFunctionDataErrorType`, \`0x$\{string}\`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [`EncodeFunctionDataParameters`\<`Abi` \| readonly `unknown`[], `undefined` \| `string`, `undefined` \| `string`\>] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `EncodeFunctionDataErrorType`, \`0x$\{string}\`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### encodeFunctionResultEffect

▸ **encodeFunctionResultEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `EncodeFunctionResultErrorType`, \`0x$\{string}\`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [`EncodeFunctionResultParameters`\<`Abi` \| readonly `unknown`[], `undefined` \| `string`, `undefined` \| `string`\>] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `EncodeFunctionResultErrorType`, \`0x$\{string}\`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### encodePackedEffect

▸ **encodePackedEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `EncodePackedErrorType`, \`0x$\{string}\`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [types: readonly unknown[] \| readonly PackedAbiType[], values: readonly unknown[]] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `EncodePackedErrorType`, \`0x$\{string}\`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### extractEffect

▸ **extractEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `ExtractErrorType`, `Record`\<`string`, `unknown`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [`Record`\<`string`, `unknown`\>, \{ `format?`: (`args`: `any`) => `any`  }] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `ExtractErrorType`, `Record`\<`string`, `unknown`\>\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### formatAbiItemEffect

▸ **formatAbiItemEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `FormatAbiItemErrorType`, `string`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [`AbiConstructor` \| `AbiError` \| `AbiEvent` \| `AbiFallback` \| `AbiFunction` \| `AbiReceive`, Object?] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `FormatAbiItemErrorType`, `string`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### formatAbiItemWithArgsEffect

▸ **formatAbiItemWithArgsEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `FormatAbiItemWithArgsErrorType`, `undefined` \| `string`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [\{ `abiItem`: `AbiConstructor` \| `AbiError` \| `AbiEvent` \| `AbiFallback` \| `AbiFunction` \| `AbiReceive` ; `args`: readonly `unknown`[] ; `includeFunctionName?`: `boolean` ; `includeName?`: `boolean`  }] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `FormatAbiItemWithArgsErrorType`, `undefined` \| `string`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### formatEtherEffect

▸ **formatEtherEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `FormatUnitsErrorType`, `string`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [wei: bigint, unit?: "wei" \| "gwei"] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `FormatUnitsErrorType`, `string`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### formatGweiEffect

▸ **formatGweiEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `FormatUnitsErrorType`, `string`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [wei: bigint, unit?: "wei"] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `FormatUnitsErrorType`, `string`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### formatUnitsEffect

▸ **formatUnitsEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `FormatUnitsErrorType`, `string`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [value: bigint, decimals: number] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `FormatUnitsErrorType`, `string`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### fromBytesEffect

▸ **fromBytesEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `FromBytesErrorType`, `string` \| `number` \| `bigint` \| `boolean`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [bytes: Uint8Array, toOrOpts: FromBytesParameters\<"string" \| "number" \| "bigint" \| "boolean" \| "hex"\>] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `FromBytesErrorType`, `string` \| `number` \| `bigint` \| `boolean`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### fromHexEffect

▸ **fromHexEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `FromHexErrorType`, `string` \| `number` \| `bigint` \| `boolean` \| `Uint8Array`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [hex: \`0x$\{string}\`, toOrOpts: FromHexParameters\<"string" \| "number" \| "bigint" \| "boolean" \| "bytes"\>] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `FromHexErrorType`, `string` \| `number` \| `bigint` \| `boolean` \| `Uint8Array`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### fromRlpEffect

▸ **fromRlpEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `FromRlpErrorType`, `FromRlpReturnType`\<`To`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [value: \`0x$\{string}\` \| Uint8Array, to?: To] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `FromRlpErrorType`, `FromRlpReturnType`\<`To`\>\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### getAbiItemEffect

▸ **getAbiItemEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `GetAbiItemErrorType`, `never`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [`GetAbiItemParameters`\<`Abi` \| readonly `unknown`[], `string`\>] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `GetAbiItemErrorType`, `never`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### getAddressEffect

▸ **getAddressEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `Error`, \`0x$\{string}\`\>

// I manually updated this

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [address: string, chainId?: number] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `Error`, \`0x$\{string}\`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### getContractAddressEffect

▸ **getContractAddressEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `never`, \`0x$\{string}\`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [opts: GetContractAddressOptions] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `never`, \`0x$\{string}\`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### getEventSelectorEffect

▸ **getEventSelectorEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `GetEventSelectorErrorType`, \`0x$\{string}\`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [fn: string \| AbiEvent] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `GetEventSelectorErrorType`, \`0x$\{string}\`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### getEventSignatureEffect

▸ **getEventSignatureEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `GetEventSignatureErrorType`, `string`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [fn: string \| AbiEvent] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `GetEventSignatureErrorType`, `string`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### getFunctionSelectorEffect

▸ **getFunctionSelectorEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `GetFunctionSelectorErrorType`, \`0x$\{string}\`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [fn: string \| AbiFunction] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `GetFunctionSelectorErrorType`, \`0x$\{string}\`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### getFunctionSignatureEffect

▸ **getFunctionSignatureEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `GetFunctionSignatureErrorType`, `string`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [fn: string \| AbiFunction] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `GetFunctionSignatureErrorType`, `string`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### getSerializedTransactionTypeEffect

▸ **getSerializedTransactionTypeEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `GetSerializedTransactionTypeErrorType`, `any`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [serializedTransaction: \`0x$\{string}\`] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `GetSerializedTransactionTypeErrorType`, `any`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### getTransactionTypeEffect

▸ **getTransactionTypeEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `never`, `string`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [transaction: TransactionSerializable] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `never`, `string`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### hashMessageEffect

▸ **hashMessageEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `HashMessageErrorType`, `HashMessage`\<`To`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [message: SignableMessage, to\_?: To] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `HashMessageErrorType`, `HashMessage`\<`To`\>\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### hashTypedDataEffect

▸ **hashTypedDataEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `HashMessageErrorType`, \`0x$\{string}\`\>

// I manually updated this

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [`HashTypedDataParameters`\<\{ `address`: `undefined` ; `bool`: `undefined` ; `bytes`: `undefined` ; `bytes1`: `undefined` ; `bytes10`: `undefined` ; `bytes11`: `undefined` ; `bytes12`: `undefined` ; `bytes13`: `undefined` ; `bytes14`: `undefined` ; `bytes15`: `undefined` ; `bytes16`: `undefined` ; `bytes17`: `undefined` ; `bytes18`: `undefined` ; `bytes19`: `undefined` ; `bytes2`: `undefined` ; `bytes20`: `undefined` ; `bytes21`: `undefined` ; `bytes22`: `undefined` ; `bytes23`: `undefined` ; `bytes24`: `undefined` ; `bytes25`: `undefined` ; `bytes26`: `undefined` ; `bytes27`: `undefined` ; `bytes28`: `undefined` ; `bytes29`: `undefined` ; `bytes3`: `undefined` ; `bytes30`: `undefined` ; `bytes31`: `undefined` ; `bytes32`: `undefined` ; `bytes4`: `undefined` ; `bytes5`: `undefined` ; `bytes6`: `undefined` ; `bytes7`: `undefined` ; `bytes8`: `undefined` ; `bytes9`: `undefined` ; `int104`: `undefined` ; `int112`: `undefined` ; `int120`: `undefined` ; `int128`: `undefined` ; `int136`: `undefined` ; `int144`: `undefined` ; `int152`: `undefined` ; `int16`: `undefined` ; `int160`: `undefined` ; `int168`: `undefined` ; `int176`: `undefined` ; `int184`: `undefined` ; `int192`: `undefined` ; `int200`: `undefined` ; `int208`: `undefined` ; `int216`: `undefined` ; `int224`: `undefined` ; `int232`: `undefined` ; `int24`: `undefined` ; `int240`: `undefined` ; `int248`: `undefined` ; `int256`: `undefined` ; `int32`: `undefined` ; `int40`: `undefined` ; `int48`: `undefined` ; `int56`: `undefined` ; `int64`: `undefined` ; `int72`: `undefined` ; `int8`: `undefined` ; `int80`: `undefined` ; `int88`: `undefined` ; `int96`: `undefined` ; `string`: `undefined` ; `uint104`: `undefined` ; `uint112`: `undefined` ; `uint120`: `undefined` ; `uint128`: `undefined` ; `uint136`: `undefined` ; `uint144`: `undefined` ; `uint152`: `undefined` ; `uint16`: `undefined` ; `uint160`: `undefined` ; `uint168`: `undefined` ; `uint176`: `undefined` ; `uint184`: `undefined` ; `uint192`: `undefined` ; `uint200`: `undefined` ; `uint208`: `undefined` ; `uint216`: `undefined` ; `uint224`: `undefined` ; `uint232`: `undefined` ; `uint24`: `undefined` ; `uint240`: `undefined` ; `uint248`: `undefined` ; `uint256`: `undefined` ; `uint32`: `undefined` ; `uint40`: `undefined` ; `uint48`: `undefined` ; `uint56`: `undefined` ; `uint64`: `undefined` ; `uint72`: `undefined` ; `uint8`: `undefined` ; `uint80`: `undefined` ; `uint88`: `undefined` ; `uint96`: `undefined`  } \| \{ `[key: string]`: `unknown`;  }, `string`\>] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `HashMessageErrorType`, \`0x$\{string}\`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### hexToSignatureEffect

▸ **hexToSignatureEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `HexToSignatureErrorType`, `Signature`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [signatureHex: \`0x$\{string}\`] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `HexToSignatureErrorType`, `Signature`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### isAddressEffect

▸ **isAddressEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `IsAddressErrorType`, `boolean`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [address: string] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `IsAddressErrorType`, `boolean`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### isAddressEqualEffect

▸ **isAddressEqualEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `IsAddressEqualErrorType`, `boolean`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [a: \`0x$\{string}\`, b: \`0x$\{string}\`] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `IsAddressEqualErrorType`, `boolean`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### isBytesEffect

▸ **isBytesEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `IsBytesErrorType`, `boolean`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [value: unknown] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `IsBytesErrorType`, `boolean`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### isHashEffect

▸ **isHashEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `IsHashErrorType`, `boolean`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [hash: string] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `IsHashErrorType`, `boolean`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### isHexEffect

▸ **isHexEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `IsHexErrorType`, `boolean`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [`unknown`, Object?] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `IsHexErrorType`, `boolean`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### keccak256Effect

▸ **keccak256Effect**\<`TParams`\>(`...args`): `Effect`\<`never`, `Keccak256ErrorType`, `Keccak256Hash`\<`To`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [value: \`0x$\{string}\` \| Uint8Array, to\_?: To] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `Keccak256ErrorType`, `Keccak256Hash`\<`To`\>\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### padEffect

▸ **padEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `PadErrorType`, \`0x$\{string}\` \| `Uint8Array`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [\`0x$\{string}\` \| `Uint8Array`, PadOptions?] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `PadErrorType`, \`0x$\{string}\` \| `Uint8Array`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### parseEtherEffect

▸ **parseEtherEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `ParseEtherErrorType`, `bigint`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [ether: string, unit?: "wei" \| "gwei"] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `ParseEtherErrorType`, `bigint`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### parseGweiEffect

▸ **parseGweiEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `ParseGweiErrorType`, `bigint`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [ether: string, unit?: "wei"] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `ParseGweiErrorType`, `bigint`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### parseTransactionEffect

▸ **parseTransactionEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `ParseTransactionErrorType`, `any`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [serializedTransaction: \`0x$\{string}\`] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `ParseTransactionErrorType`, `any`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### parseUnitsEffect

▸ **parseUnitsEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `ParseUnitsErrorType`, `bigint`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [value: string, decimals: number] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `ParseUnitsErrorType`, `bigint`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### recoverAddressEffect

▸ **recoverAddressEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `RecoverAddressErrorType`, \`0x$\{string}\`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [`RecoverAddressParameters`] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `RecoverAddressErrorType`, \`0x$\{string}\`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### recoverMessageAddressEffect

▸ **recoverMessageAddressEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `RecoverMessageAddressErrorType`, \`0x$\{string}\`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [`RecoverMessageAddressParameters`] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `RecoverMessageAddressErrorType`, \`0x$\{string}\`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### recoverPublicKeyEffect

▸ **recoverPublicKeyEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `RecoverPublicKeyErrorType`, \`0x$\{string}\`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [`RecoverPublicKeyParameters`] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `RecoverPublicKeyErrorType`, \`0x$\{string}\`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### recoverTypedDataAddressEffect

▸ **recoverTypedDataAddressEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `RecoverTypedDataAddressErrorType`, \`0x$\{string}\`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [`RecoverTypedDataAddressParameters`\<\{ `address`: `undefined` ; `bool`: `undefined` ; `bytes`: `undefined` ; `bytes1`: `undefined` ; `bytes10`: `undefined` ; `bytes11`: `undefined` ; `bytes12`: `undefined` ; `bytes13`: `undefined` ; `bytes14`: `undefined` ; `bytes15`: `undefined` ; `bytes16`: `undefined` ; `bytes17`: `undefined` ; `bytes18`: `undefined` ; `bytes19`: `undefined` ; `bytes2`: `undefined` ; `bytes20`: `undefined` ; `bytes21`: `undefined` ; `bytes22`: `undefined` ; `bytes23`: `undefined` ; `bytes24`: `undefined` ; `bytes25`: `undefined` ; `bytes26`: `undefined` ; `bytes27`: `undefined` ; `bytes28`: `undefined` ; `bytes29`: `undefined` ; `bytes3`: `undefined` ; `bytes30`: `undefined` ; `bytes31`: `undefined` ; `bytes32`: `undefined` ; `bytes4`: `undefined` ; `bytes5`: `undefined` ; `bytes6`: `undefined` ; `bytes7`: `undefined` ; `bytes8`: `undefined` ; `bytes9`: `undefined` ; `int104`: `undefined` ; `int112`: `undefined` ; `int120`: `undefined` ; `int128`: `undefined` ; `int136`: `undefined` ; `int144`: `undefined` ; `int152`: `undefined` ; `int16`: `undefined` ; `int160`: `undefined` ; `int168`: `undefined` ; `int176`: `undefined` ; `int184`: `undefined` ; `int192`: `undefined` ; `int200`: `undefined` ; `int208`: `undefined` ; `int216`: `undefined` ; `int224`: `undefined` ; `int232`: `undefined` ; `int24`: `undefined` ; `int240`: `undefined` ; `int248`: `undefined` ; `int256`: `undefined` ; `int32`: `undefined` ; `int40`: `undefined` ; `int48`: `undefined` ; `int56`: `undefined` ; `int64`: `undefined` ; `int72`: `undefined` ; `int8`: `undefined` ; `int80`: `undefined` ; `int88`: `undefined` ; `int96`: `undefined` ; `string`: `undefined` ; `uint104`: `undefined` ; `uint112`: `undefined` ; `uint120`: `undefined` ; `uint128`: `undefined` ; `uint136`: `undefined` ; `uint144`: `undefined` ; `uint152`: `undefined` ; `uint16`: `undefined` ; `uint160`: `undefined` ; `uint168`: `undefined` ; `uint176`: `undefined` ; `uint184`: `undefined` ; `uint192`: `undefined` ; `uint200`: `undefined` ; `uint208`: `undefined` ; `uint216`: `undefined` ; `uint224`: `undefined` ; `uint232`: `undefined` ; `uint24`: `undefined` ; `uint240`: `undefined` ; `uint248`: `undefined` ; `uint256`: `undefined` ; `uint32`: `undefined` ; `uint40`: `undefined` ; `uint48`: `undefined` ; `uint56`: `undefined` ; `uint64`: `undefined` ; `uint72`: `undefined` ; `uint8`: `undefined` ; `uint80`: `undefined` ; `uint88`: `undefined` ; `uint96`: `undefined`  } \| \{ `[key: string]`: `unknown`;  }, `string`\>] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `RecoverTypedDataAddressErrorType`, \`0x$\{string}\`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### serializeAccessListEffect

▸ **serializeAccessListEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `SerializeAccessListErrorType`, `RecursiveArray`\<\`0x$\{string}\`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [accessList?: AccessList] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `SerializeAccessListErrorType`, `RecursiveArray`\<\`0x$\{string}\`\>\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### serializeTransactionEffect

▸ **serializeTransactionEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `SerializeTransactionErrorType`, \`0x$\{string}\` \| \`0x02$\{string}\` \| \`0x01$\{string}\`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [transaction: TransactionSerializable, signature?: Signature] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `SerializeTransactionErrorType`, \`0x$\{string}\` \| \`0x02$\{string}\` \| \`0x01$\{string}\`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### signatureToHexEffect

▸ **signatureToHexEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `SignatureToHexErrorType`, \`0x$\{string}\`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [`Signature`] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `SignatureToHexErrorType`, \`0x$\{string}\`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### sizeEffect

▸ **sizeEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `SizeErrorType`, `number`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [value: \`0x$\{string}\` \| Uint8Array] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `SizeErrorType`, `number`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### sliceEffect

▸ **sliceEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `SliceErrorType`, \`0x$\{string}\` \| `Uint8Array`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [\`0x$\{string}\` \| `Uint8Array`, number?, number?, Object?] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `SliceErrorType`, \`0x$\{string}\` \| `Uint8Array`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### stringifyEffect

▸ **stringifyEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `StringifyErrorType`, `string`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [value: any, replacer?: null \| (string \| number)[], space?: string \| number] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `StringifyErrorType`, `string`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### toBytesEffect

▸ **toBytesEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `ToBytesErrorType`, `Uint8Array`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [value: string \| number \| bigint \| boolean, opts?: ToBytesParameters] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `ToBytesErrorType`, `Uint8Array`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### toHexEffect

▸ **toHexEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `ToHexErrorType`, \`0x$\{string}\`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [value: string \| number \| bigint \| boolean \| Uint8Array, opts?: ToHexParameters] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `ToHexErrorType`, \`0x$\{string}\`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### toRlpEffect

▸ **toRlpEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `ToRlpErrorType`, `ToRlpReturnType`\<`To`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [bytes: RecursiveArray\<Uint8Array\> \| RecursiveArray\<\`0x$\{string}\`\>, to?: To] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `ToRlpErrorType`, `ToRlpReturnType`\<`To`\>\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### trimEffect

▸ **trimEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `TrimErrorType`, \`0x$\{string}\` \| `Uint8Array`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [\`0x$\{string}\` \| `Uint8Array`, TrimOptions?] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `TrimErrorType`, \`0x$\{string}\` \| `Uint8Array`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### verifyMessageEffect

▸ **verifyMessageEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `VerifyMessageErrorType`, `boolean`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [`Client`\<`Transport`, `undefined` \| `Chain`\>, `VerifyMessageParameters`] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `VerifyMessageErrorType`, `boolean`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

___

### verifyTypedDataEffect

▸ **verifyTypedDataEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `VerifyTypedDataErrorType`, `boolean`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [`Client`\<`Transport`, `undefined` \| `Chain`\>, `VerifyTypedDataParameters`\<\{ `address`: `undefined` ; `bool`: `undefined` ; `bytes`: `undefined` ; `bytes1`: `undefined` ; `bytes10`: `undefined` ; `bytes11`: `undefined` ; `bytes12`: `undefined` ; `bytes13`: `undefined` ; `bytes14`: `undefined` ; `bytes15`: `undefined` ; `bytes16`: `undefined` ; `bytes17`: `undefined` ; `bytes18`: `undefined` ; `bytes19`: `undefined` ; `bytes2`: `undefined` ; `bytes20`: `undefined` ; `bytes21`: `undefined` ; `bytes22`: `undefined` ; `bytes23`: `undefined` ; `bytes24`: `undefined` ; `bytes25`: `undefined` ; `bytes26`: `undefined` ; `bytes27`: `undefined` ; `bytes28`: `undefined` ; `bytes29`: `undefined` ; `bytes3`: `undefined` ; `bytes30`: `undefined` ; `bytes31`: `undefined` ; `bytes32`: `undefined` ; `bytes4`: `undefined` ; `bytes5`: `undefined` ; `bytes6`: `undefined` ; `bytes7`: `undefined` ; `bytes8`: `undefined` ; `bytes9`: `undefined` ; `int104`: `undefined` ; `int112`: `undefined` ; `int120`: `undefined` ; `int128`: `undefined` ; `int136`: `undefined` ; `int144`: `undefined` ; `int152`: `undefined` ; `int16`: `undefined` ; `int160`: `undefined` ; `int168`: `undefined` ; `int176`: `undefined` ; `int184`: `undefined` ; `int192`: `undefined` ; `int200`: `undefined` ; `int208`: `undefined` ; `int216`: `undefined` ; `int224`: `undefined` ; `int232`: `undefined` ; `int24`: `undefined` ; `int240`: `undefined` ; `int248`: `undefined` ; `int256`: `undefined` ; `int32`: `undefined` ; `int40`: `undefined` ; `int48`: `undefined` ; `int56`: `undefined` ; `int64`: `undefined` ; `int72`: `undefined` ; `int8`: `undefined` ; `int80`: `undefined` ; `int88`: `undefined` ; `int96`: `undefined` ; `string`: `undefined` ; `uint104`: `undefined` ; `uint112`: `undefined` ; `uint120`: `undefined` ; `uint128`: `undefined` ; `uint136`: `undefined` ; `uint144`: `undefined` ; `uint152`: `undefined` ; `uint16`: `undefined` ; `uint160`: `undefined` ; `uint168`: `undefined` ; `uint176`: `undefined` ; `uint184`: `undefined` ; `uint192`: `undefined` ; `uint200`: `undefined` ; `uint208`: `undefined` ; `uint216`: `undefined` ; `uint224`: `undefined` ; `uint232`: `undefined` ; `uint24`: `undefined` ; `uint240`: `undefined` ; `uint248`: `undefined` ; `uint256`: `undefined` ; `uint32`: `undefined` ; `uint40`: `undefined` ; `uint48`: `undefined` ; `uint56`: `undefined` ; `uint64`: `undefined` ; `uint72`: `undefined` ; `uint8`: `undefined` ; `uint80`: `undefined` ; `uint88`: `undefined` ; `uint96`: `undefined`  }, `string`\>] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `VerifyTypedDataErrorType`, `boolean`\>

#### Defined in

[extensions/viem/src/wrapInEffect.d.ts:14](https://github.com/evmts/evmts-monorepo/blob/main/extensions/viem/src/wrapInEffect.d.ts#L14)

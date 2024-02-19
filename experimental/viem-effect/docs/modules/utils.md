[@tevm/viem-effect](../README.md) / [Modules](../modules.md) / utils

# Module: utils

## Table of contents

### Functions

- [assertRequestEffect](utils.md#assertrequesteffect)
- [buildRequestEffect](utils.md#buildrequesteffect)
- [concatEffect](utils.md#concateffect)
- [decodeAbiParametersEffect](utils.md#decodeabiparameterseffect)
- [decodeDeployDataEffect](utils.md#decodedeploydataeffect)
- [decodeErrorResultEffect](utils.md#decodeerrorresulteffect)
- [decodeEventLogEffect](utils.md#decodeeventlogeffect)
- [decodeFunctionDataEffect](utils.md#decodefunctiondataeffect)
- [decodeFunctionResultEffect](utils.md#decodefunctionresulteffect)
- [encodeAbiParametersEffect](utils.md#encodeabiparameterseffect)
- [encodeDeployDataEffect](utils.md#encodedeploydataeffect)
- [encodeErrorResultEffect](utils.md#encodeerrorresulteffect)
- [encodeEventTopicsEffect](utils.md#encodeeventtopicseffect)
- [encodeFunctionDataEffect](utils.md#encodefunctiondataeffect)
- [encodeFunctionResultEffect](utils.md#encodefunctionresulteffect)
- [encodePackedEffect](utils.md#encodepackedeffect)
- [extractEffect](utils.md#extracteffect)
- [formatAbiItemEffect](utils.md#formatabiitemeffect)
- [formatAbiItemWithArgsEffect](utils.md#formatabiitemwithargseffect)
- [formatEtherEffect](utils.md#formatethereffect)
- [formatGweiEffect](utils.md#formatgweieffect)
- [formatUnitsEffect](utils.md#formatunitseffect)
- [fromBytesEffect](utils.md#frombyteseffect)
- [fromHexEffect](utils.md#fromhexeffect)
- [fromRlpEffect](utils.md#fromrlpeffect)
- [getAbiItemEffect](utils.md#getabiitemeffect)
- [getAddressEffect](utils.md#getaddresseffect)
- [getContractAddressEffect](utils.md#getcontractaddresseffect)
- [getEventSelectorEffect](utils.md#geteventselectoreffect)
- [getEventSignatureEffect](utils.md#geteventsignatureeffect)
- [getFunctionSelectorEffect](utils.md#getfunctionselectoreffect)
- [getFunctionSignatureEffect](utils.md#getfunctionsignatureeffect)
- [getSerializedTransactionTypeEffect](utils.md#getserializedtransactiontypeeffect)
- [getTransactionTypeEffect](utils.md#gettransactiontypeeffect)
- [hashMessageEffect](utils.md#hashmessageeffect)
- [hashTypedDataEffect](utils.md#hashtypeddataeffect)
- [hexToSignatureEffect](utils.md#hextosignatureeffect)
- [isAddressEffect](utils.md#isaddresseffect)
- [isAddressEqualEffect](utils.md#isaddressequaleffect)
- [isBytesEffect](utils.md#isbyteseffect)
- [isHashEffect](utils.md#ishasheffect)
- [isHexEffect](utils.md#ishexeffect)
- [keccak256Effect](utils.md#keccak256effect)
- [padEffect](utils.md#padeffect)
- [parseEtherEffect](utils.md#parseethereffect)
- [parseGweiEffect](utils.md#parsegweieffect)
- [parseTransactionEffect](utils.md#parsetransactioneffect)
- [parseUnitsEffect](utils.md#parseunitseffect)
- [recoverAddressEffect](utils.md#recoveraddresseffect)
- [recoverMessageAddressEffect](utils.md#recovermessageaddresseffect)
- [recoverPublicKeyEffect](utils.md#recoverpublickeyeffect)
- [recoverTypedDataAddressEffect](utils.md#recovertypeddataaddresseffect)
- [serializeAccessListEffect](utils.md#serializeaccesslisteffect)
- [serializeTransactionEffect](utils.md#serializetransactioneffect)
- [signatureToHexEffect](utils.md#signaturetohexeffect)
- [sizeEffect](utils.md#sizeeffect)
- [sliceEffect](utils.md#sliceeffect)
- [stringifyEffect](utils.md#stringifyeffect)
- [toBytesEffect](utils.md#tobyteseffect)
- [toHexEffect](utils.md#tohexeffect)
- [toRlpEffect](utils.md#torlpeffect)
- [trimEffect](utils.md#trimeffect)
- [verifyMessageEffect](utils.md#verifymessageeffect)
- [verifyTypedDataEffect](utils.md#verifytypeddataeffect)

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

[experimental/viem-effect/src/utils/transaction/assertRequestEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/transaction/assertRequestEffect.js#L7)

___

### buildRequestEffect

▸ **buildRequestEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `never`, (`args`: `any`) => `Promise`\<`any`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [request: Function, Object?] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `never`, (`args`: `any`) => `Promise`\<`any`\>\>

#### Defined in

[experimental/viem-effect/src/utils/buildRequestEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/buildRequestEffect.js#L7)

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

[experimental/viem-effect/src/utils/data/concatEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/data/concatEffect.js#L7)

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

[experimental/viem-effect/src/utils/abi/decodeAbiParametersEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/abi/decodeAbiParametersEffect.js#L7)

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

[experimental/viem-effect/src/utils/abi/decodeDeployDataEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/abi/decodeDeployDataEffect.js#L7)

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

[experimental/viem-effect/src/utils/abi/decodeErrorResultEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/abi/decodeErrorResultEffect.js#L7)

___

### decodeEventLogEffect

▸ **decodeEventLogEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `DecodeEventLogErrorType`, \{ `args`: {} \| {} ; `eventName`: `string`  } \| \{ `args`: {} \| {} ; `eventName`: `string`  }\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [`DecodeEventLogParameters`\<`Abi` \| readonly `unknown`[], `undefined` \| `string`, \`0x$\{string}\`[], `undefined` \| \`0x$\{string}\`, `boolean`\>] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `DecodeEventLogErrorType`, \{ `args`: {} \| {} ; `eventName`: `string`  } \| \{ `args`: {} \| {} ; `eventName`: `string`  }\>

#### Defined in

[experimental/viem-effect/src/utils/abi/decodeEventLogEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/abi/decodeEventLogEffect.js#L7)

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

[experimental/viem-effect/src/utils/abi/decodeFunctionDataEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/abi/decodeFunctionDataEffect.js#L7)

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

[experimental/viem-effect/src/utils/abi/decodeFunctionResultEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/abi/decodeFunctionResultEffect.js#L7)

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

[experimental/viem-effect/src/utils/abi/encodeAbiParametersEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/abi/encodeAbiParametersEffect.js#L7)

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

[experimental/viem-effect/src/utils/abi/encodeDeployDataEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/abi/encodeDeployDataEffect.js#L7)

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

[experimental/viem-effect/src/utils/abi/encodeErrorResultEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/abi/encodeErrorResultEffect.js#L7)

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

[experimental/viem-effect/src/utils/abi/encodeEventTopicsEffect.js:8](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/abi/encodeEventTopicsEffect.js#L8)

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

[experimental/viem-effect/src/utils/abi/encodeFunctionDataEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/abi/encodeFunctionDataEffect.js#L7)

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

[experimental/viem-effect/src/utils/abi/encodeFunctionResultEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/abi/encodeFunctionResultEffect.js#L7)

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

[experimental/viem-effect/src/utils/abi/encodePackedEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/abi/encodePackedEffect.js#L7)

___

### extractEffect

▸ **extractEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `ExtractErrorType`, `Record`\<`string`, `unknown`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [value\_: Record\<string, unknown\>, \{ `format?`: (`args`: `any`) => `any`  }] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `ExtractErrorType`, `Record`\<`string`, `unknown`\>\>

#### Defined in

[experimental/viem-effect/src/utils/formatters/extractEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/formatters/extractEffect.js#L7)

___

### formatAbiItemEffect

▸ **formatAbiItemEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `FormatAbiItemErrorType`, `string`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [abiItem: AbiConstructor \| AbiError \| AbiEvent \| AbiFallback \| AbiFunction \| AbiReceive, Object?] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `FormatAbiItemErrorType`, `string`\>

#### Defined in

[experimental/viem-effect/src/utils/abi/formatAbiItemEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/abi/formatAbiItemEffect.js#L7)

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

[experimental/viem-effect/src/utils/abi/formatAbiItemWithArgsEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/abi/formatAbiItemWithArgsEffect.js#L7)

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

[experimental/viem-effect/src/utils/unit/formatEtherEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/unit/formatEtherEffect.js#L7)

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

[experimental/viem-effect/src/utils/unit/formatGweiEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/unit/formatGweiEffect.js#L7)

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

[experimental/viem-effect/src/utils/unit/formatUnitsEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/unit/formatUnitsEffect.js#L7)

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

[experimental/viem-effect/src/utils/encoding/fromBytesEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/encoding/fromBytesEffect.js#L7)

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

[experimental/viem-effect/src/utils/encoding/fromHexEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/encoding/fromHexEffect.js#L7)

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

[experimental/viem-effect/src/utils/encoding/fromRlpEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/encoding/fromRlpEffect.js#L7)

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

[experimental/viem-effect/src/utils/abi/getAbiItemEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/abi/getAbiItemEffect.js#L7)

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

[experimental/viem-effect/src/utils/address/getAddressEffect.js:8](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/address/getAddressEffect.js#L8)

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

[experimental/viem-effect/src/utils/address/getContractAddressEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/address/getContractAddressEffect.js#L7)

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

[experimental/viem-effect/src/utils/hash/getEventSelectorEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/hash/getEventSelectorEffect.js#L7)

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

[experimental/viem-effect/src/utils/hash/getEventSignatureEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/hash/getEventSignatureEffect.js#L7)

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

[experimental/viem-effect/src/utils/hash/getFunctionSelectorEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/hash/getFunctionSelectorEffect.js#L7)

___

### getFunctionSignatureEffect

▸ **getFunctionSignatureEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `GetFunctionSignatureErrorType`, `string`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [fn\_: string \| AbiFunction] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `GetFunctionSignatureErrorType`, `string`\>

#### Defined in

[experimental/viem-effect/src/utils/hash/getFunctionSignatureEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/hash/getFunctionSignatureEffect.js#L7)

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

[experimental/viem-effect/src/utils/transaction/getSerializedTransactionTypeEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/transaction/getSerializedTransactionTypeEffect.js#L7)

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

[experimental/viem-effect/src/utils/transaction/getTransactionTypeEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/transaction/getTransactionTypeEffect.js#L7)

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

[experimental/viem-effect/src/utils/signature/hashMessageEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/signature/hashMessageEffect.js#L7)

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

[experimental/viem-effect/src/utils/signature/hashTypedDataEffect.js:8](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/signature/hashTypedDataEffect.js#L8)

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

[experimental/viem-effect/src/utils/signature/hexToSignatureEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/signature/hexToSignatureEffect.js#L7)

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

[experimental/viem-effect/src/utils/address/isAddressEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/address/isAddressEffect.js#L7)

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

[experimental/viem-effect/src/utils/address/isAddressEqualEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/address/isAddressEqualEffect.js#L7)

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

[experimental/viem-effect/src/utils/data/isBytesEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/data/isBytesEffect.js#L7)

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

[experimental/viem-effect/src/utils/hash/isHashEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/hash/isHashEffect.js#L7)

___

### isHexEffect

▸ **isHexEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `IsHexErrorType`, `boolean`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [value: unknown, Object?] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `IsHexErrorType`, `boolean`\>

#### Defined in

[experimental/viem-effect/src/utils/data/isHexEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/data/isHexEffect.js#L7)

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

[experimental/viem-effect/src/utils/hash/keccak256Effect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/hash/keccak256Effect.js#L7)

___

### padEffect

▸ **padEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `PadErrorType`, \`0x$\{string}\` \| `Uint8Array`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [hexOrBytes: \`0x$\{string}\` \| Uint8Array, PadOptions?] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `PadErrorType`, \`0x$\{string}\` \| `Uint8Array`\>

#### Defined in

[experimental/viem-effect/src/utils/data/padEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/data/padEffect.js#L7)

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

[experimental/viem-effect/src/utils/unit/parseEtherEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/unit/parseEtherEffect.js#L7)

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

[experimental/viem-effect/src/utils/unit/parseGweiEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/unit/parseGweiEffect.js#L7)

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

[experimental/viem-effect/src/utils/transaction/parseTransactionEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/transaction/parseTransactionEffect.js#L7)

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

[experimental/viem-effect/src/utils/unit/parseUnitsEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/unit/parseUnitsEffect.js#L7)

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

[experimental/viem-effect/src/utils/signature/recoverAddressEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/signature/recoverAddressEffect.js#L7)

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

[experimental/viem-effect/src/utils/signature/recoverMessageAddressEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/signature/recoverMessageAddressEffect.js#L7)

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

[experimental/viem-effect/src/utils/signature/recoverPublicKeyEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/signature/recoverPublicKeyEffect.js#L7)

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

[experimental/viem-effect/src/utils/signature/recoverTypedDataAddressEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/signature/recoverTypedDataAddressEffect.js#L7)

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

[experimental/viem-effect/src/utils/transaction/serializeAccessListEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/transaction/serializeAccessListEffect.js#L7)

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

[experimental/viem-effect/src/utils/transaction/serializeTransactionEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/transaction/serializeTransactionEffect.js#L7)

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

[experimental/viem-effect/src/utils/signature/signatureToHexEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/signature/signatureToHexEffect.js#L7)

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

[experimental/viem-effect/src/utils/data/sizeEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/data/sizeEffect.js#L7)

___

### sliceEffect

▸ **sliceEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `SliceErrorType`, \`0x$\{string}\` \| `Uint8Array`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [value: \`0x$\{string}\` \| Uint8Array, start?: number, end?: number, Object?] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `SliceErrorType`, \`0x$\{string}\` \| `Uint8Array`\>

#### Defined in

[experimental/viem-effect/src/utils/data/sliceEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/data/sliceEffect.js#L7)

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

[experimental/viem-effect/src/utils/stringifyEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/stringifyEffect.js#L7)

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

[experimental/viem-effect/src/utils/encoding/toBytesEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/encoding/toBytesEffect.js#L7)

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

[experimental/viem-effect/src/utils/encoding/toHexEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/encoding/toHexEffect.js#L7)

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

[experimental/viem-effect/src/utils/encoding/toRlpEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/encoding/toRlpEffect.js#L7)

___

### trimEffect

▸ **trimEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `TrimErrorType`, \`0x$\{string}\` \| `Uint8Array`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [hexOrBytes: \`0x$\{string}\` \| Uint8Array, TrimOptions?] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `TrimErrorType`, \`0x$\{string}\` \| `Uint8Array`\>

#### Defined in

[experimental/viem-effect/src/utils/data/trimEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/data/trimEffect.js#L7)

___

### verifyMessageEffect

▸ **verifyMessageEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `VerifyMessageErrorType`, `boolean`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [client: Client\<Transport, undefined \| Chain\>, `VerifyMessageParameters`] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `VerifyMessageErrorType`, `boolean`\>

#### Defined in

[experimental/viem-effect/src/utils/signature/verifyMessageEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/signature/verifyMessageEffect.js#L7)

___

### verifyTypedDataEffect

▸ **verifyTypedDataEffect**\<`TParams`\>(`...args`): `Effect`\<`never`, `VerifyTypedDataErrorType`, `boolean`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends [client: Client\<Transport, undefined \| Chain\>, `VerifyTypedDataParameters`\<\{ `address`: `undefined` ; `bool`: `undefined` ; `bytes`: `undefined` ; `bytes1`: `undefined` ; `bytes10`: `undefined` ; `bytes11`: `undefined` ; `bytes12`: `undefined` ; `bytes13`: `undefined` ; `bytes14`: `undefined` ; `bytes15`: `undefined` ; `bytes16`: `undefined` ; `bytes17`: `undefined` ; `bytes18`: `undefined` ; `bytes19`: `undefined` ; `bytes2`: `undefined` ; `bytes20`: `undefined` ; `bytes21`: `undefined` ; `bytes22`: `undefined` ; `bytes23`: `undefined` ; `bytes24`: `undefined` ; `bytes25`: `undefined` ; `bytes26`: `undefined` ; `bytes27`: `undefined` ; `bytes28`: `undefined` ; `bytes29`: `undefined` ; `bytes3`: `undefined` ; `bytes30`: `undefined` ; `bytes31`: `undefined` ; `bytes32`: `undefined` ; `bytes4`: `undefined` ; `bytes5`: `undefined` ; `bytes6`: `undefined` ; `bytes7`: `undefined` ; `bytes8`: `undefined` ; `bytes9`: `undefined` ; `int104`: `undefined` ; `int112`: `undefined` ; `int120`: `undefined` ; `int128`: `undefined` ; `int136`: `undefined` ; `int144`: `undefined` ; `int152`: `undefined` ; `int16`: `undefined` ; `int160`: `undefined` ; `int168`: `undefined` ; `int176`: `undefined` ; `int184`: `undefined` ; `int192`: `undefined` ; `int200`: `undefined` ; `int208`: `undefined` ; `int216`: `undefined` ; `int224`: `undefined` ; `int232`: `undefined` ; `int24`: `undefined` ; `int240`: `undefined` ; `int248`: `undefined` ; `int256`: `undefined` ; `int32`: `undefined` ; `int40`: `undefined` ; `int48`: `undefined` ; `int56`: `undefined` ; `int64`: `undefined` ; `int72`: `undefined` ; `int8`: `undefined` ; `int80`: `undefined` ; `int88`: `undefined` ; `int96`: `undefined` ; `string`: `undefined` ; `uint104`: `undefined` ; `uint112`: `undefined` ; `uint120`: `undefined` ; `uint128`: `undefined` ; `uint136`: `undefined` ; `uint144`: `undefined` ; `uint152`: `undefined` ; `uint16`: `undefined` ; `uint160`: `undefined` ; `uint168`: `undefined` ; `uint176`: `undefined` ; `uint184`: `undefined` ; `uint192`: `undefined` ; `uint200`: `undefined` ; `uint208`: `undefined` ; `uint216`: `undefined` ; `uint224`: `undefined` ; `uint232`: `undefined` ; `uint24`: `undefined` ; `uint240`: `undefined` ; `uint248`: `undefined` ; `uint256`: `undefined` ; `uint32`: `undefined` ; `uint40`: `undefined` ; `uint48`: `undefined` ; `uint56`: `undefined` ; `uint64`: `undefined` ; `uint72`: `undefined` ; `uint8`: `undefined` ; `uint80`: `undefined` ; `uint88`: `undefined` ; `uint96`: `undefined`  }, `string`\>] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `TParams` |

#### Returns

`Effect`\<`never`, `VerifyTypedDataErrorType`, `boolean`\>

#### Defined in

[experimental/viem-effect/src/utils/signature/verifyTypedDataEffect.js:7](https://github.com/evmts/tevm-monorepo/blob/main/experimental/viem-effect/src/utils/signature/verifyTypedDataEffect.js#L7)

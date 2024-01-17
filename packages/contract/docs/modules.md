[@tevm/contract](README.md) / Exports

# @tevm/contract

## Table of contents

### Type Aliases

- [Contract](modules.md#contract)
- [CreateContractParams](modules.md#createcontractparams)
- [CreateScriptParams](modules.md#createscriptparams)
- [Events](modules.md#events)
- [Read](modules.md#read)
- [Script](modules.md#script)
- [Write](modules.md#write)

### Functions

- [createContract](modules.md#createcontract)
- [createScript](modules.md#createscript)
- [decodeFunctionData](modules.md#decodefunctiondata)
- [decodeFunctionResult](modules.md#decodefunctionresult)
- [encodeFunctionData](modules.md#encodefunctiondata)
- [encodeFunctionResult](modules.md#encodefunctionresult)
- [formatAbi](modules.md#formatabi)
- [formatEther](modules.md#formatether)
- [formatGwei](modules.md#formatgwei)
- [formatLog](modules.md#formatlog)
- [fromBytes](modules.md#frombytes)
- [fromHex](modules.md#fromhex)
- [parseAbi](modules.md#parseabi)
- [toBytes](modules.md#tobytes)
- [toHex](modules.md#tohex)

## Type Aliases

### Contract

Ƭ **Contract**\<`TName`, `THumanReadableAbi`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends `ReadonlyArray`\<`string`\> |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `abi` | `ParseAbi`\<`THumanReadableAbi`\> |
| `bytecode?` | `undefined` |
| `deployedBytecode?` | `undefined` |
| `events` | [`Events`](modules.md#events)\<`THumanReadableAbi`, `undefined`, `undefined`, `undefined`\> |
| `humanReadableAbi` | `THumanReadableAbi` |
| `name` | `TName` |
| `read` | [`Read`](modules.md#read)\<`THumanReadableAbi`, `undefined`, `undefined`, `undefined`\> |
| `withAddress` | \<TAddress\>(`address`: `TAddress`) => `Omit`\<[`Contract`](modules.md#contract)\<`TName`, `THumanReadableAbi`\>, ``"read"`` \| ``"write"`` \| ``"events"``\> & \{ `address`: `TAddress` ; `events`: [`Events`](modules.md#events)\<`THumanReadableAbi`, `undefined`, `undefined`, `TAddress`\> ; `read`: [`Read`](modules.md#read)\<`THumanReadableAbi`, `undefined`, `undefined`, `TAddress`\> ; `write`: [`Write`](modules.md#write)\<`THumanReadableAbi`, `undefined`, `undefined`, `TAddress`\>  } |
| `write` | [`Write`](modules.md#write)\<`THumanReadableAbi`, `undefined`, `undefined`, `undefined`\> |

#### Defined in

[packages/contract/src/Contract.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/Contract.ts#L6)

___

### CreateContractParams

Ƭ **CreateContractParams**\<`TName`, `THumanReadableAbi`\>: `Pick`\<[`Contract`](modules.md#contract)\<`TName`, `THumanReadableAbi`\>, ``"name"`` \| ``"humanReadableAbi"``\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends readonly `string`[] |

#### Defined in

[packages/contract/src/types.ts:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/types.ts#L4)

___

### CreateScriptParams

Ƭ **CreateScriptParams**\<`TName`, `THumanReadableAbi`\>: `Pick`\<[`Script`](modules.md#script)\<`TName`, `THumanReadableAbi`\>, ``"name"`` \| ``"humanReadableAbi"`` \| ``"bytecode"`` \| ``"deployedBytecode"``\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends readonly `string`[] |

#### Defined in

[packages/contract/src/types.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/types.ts#L20)

___

### Events

Ƭ **Events**\<`THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`, `TAddress`, `TAddressArgs`\>: \{ [TEventName in ExtractAbiEventNames\<ParseAbi\<THumanReadableAbi\>\>]: Function & Object & TAddressArgs }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `THumanReadableAbi` | extends readonly `string`[] |
| `TBytecode` | extends `Hex` \| `undefined` |
| `TDeployedBytecode` | extends `Hex` \| `undefined` |
| `TAddress` | extends `Address` \| `undefined` |
| `TAddressArgs` | `TAddress` extends `undefined` ? {} : \{ `address`: `TAddress`  } |

#### Defined in

[packages/contract/src/event/Event.ts:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/event/Event.ts#L28)

___

### Read

Ƭ **Read**\<`THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`, `TAddress`, `TAddressArgs`\>: \{ [TFunctionName in ExtractAbiFunctionNames\<ParseAbi\<THumanReadableAbi\>, "pure" \| "view"\>]: Function & Object & TAddressArgs }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `THumanReadableAbi` | extends readonly `string`[] |
| `TBytecode` | extends `Hex` \| `undefined` |
| `TDeployedBytecode` | extends `Hex` \| `undefined` |
| `TAddress` | extends `Address` \| `undefined` |
| `TAddressArgs` | `TAddress` extends `undefined` ? {} : \{ `address`: `TAddress`  } |

#### Defined in

[packages/contract/src/read/Read.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/read/Read.ts#L12)

___

### Script

Ƭ **Script**\<`TName`, `THumanReadableAbi`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends `ReadonlyArray`\<`string`\> |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `abi` | `ParseAbi`\<`THumanReadableAbi`\> |
| `bytecode` | `Hex` |
| `deployedBytecode` | `Hex` |
| `events` | [`Events`](modules.md#events)\<`THumanReadableAbi`, `Hex`, `Hex`, `undefined`\> |
| `humanReadableAbi` | `THumanReadableAbi` |
| `name` | `TName` |
| `read` | [`Read`](modules.md#read)\<`THumanReadableAbi`, `Hex`, `Hex`, `undefined`\> |
| `withAddress` | \<TAddress\>(`address`: `TAddress`) => [`Script`](modules.md#script)\<`TName`, `THumanReadableAbi`\> & \{ `address`: `TAddress` ; `events`: [`Events`](modules.md#events)\<`THumanReadableAbi`, `Hex`, `Hex`, `TAddress`\> ; `read`: [`Read`](modules.md#read)\<`THumanReadableAbi`, `Hex`, `Hex`, `TAddress`\> ; `write`: [`Write`](modules.md#write)\<`THumanReadableAbi`, `Hex`, `Hex`, `TAddress`\>  } |
| `write` | [`Write`](modules.md#write)\<`THumanReadableAbi`, `Hex`, `Hex`, `undefined`\> |

#### Defined in

[packages/contract/src/Script.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/Script.ts#L7)

___

### Write

Ƭ **Write**\<`THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`, `TAddress`, `TAddressArgs`\>: \{ [TFunctionName in ExtractAbiFunctionNames\<ParseAbi\<THumanReadableAbi\>, "payable" \| "nonpayable"\>]: Function & Object & TAddressArgs }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `THumanReadableAbi` | extends readonly `string`[] |
| `TBytecode` | extends `Hex` \| `undefined` |
| `TDeployedBytecode` | extends `Hex` \| `undefined` |
| `TAddress` | extends `Address` \| `undefined` |
| `TAddressArgs` | `TAddress` extends `undefined` ? {} : \{ `address`: `TAddress`  } |

#### Defined in

[packages/contract/src/write/Write.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/write/Write.ts#L12)

## Functions

### createContract

▸ **createContract**\<`TName`, `THumanReadableAbi`\>(`«destructured»`): [`Contract`](modules.md#contract)\<`TName`, `THumanReadableAbi`\>

Creates a tevm Contract instance from human readable abi
To use a json abi first pass it into `formatAbi` to turn it into human readable

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends readonly `string`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`CreateContractParams`](modules.md#createcontractparams)\<`TName`, `THumanReadableAbi`\> |

#### Returns

[`Contract`](modules.md#contract)\<`TName`, `THumanReadableAbi`\>

#### Defined in

[packages/contract/src/types.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/types.ts#L9)

___

### createScript

▸ **createScript**\<`TName`, `THumanReadableAbi`\>(`«destructured»`): [`Script`](modules.md#script)\<`TName`, `THumanReadableAbi`\>

Creates a Tevm Script instance from humanReadableAbi and bytecode

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends readonly `string`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`CreateScriptParams`](modules.md#createscriptparams)\<`TName`, `THumanReadableAbi`\> |

#### Returns

[`Script`](modules.md#script)\<`TName`, `THumanReadableAbi`\>

#### Defined in

[packages/contract/src/types.ts:28](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/types.ts#L28)

___

### decodeFunctionData

▸ **decodeFunctionData**\<`abi`\>(`parameters`): `DecodeFunctionDataReturnType`\<`abi`, `ContractFunctionName`\<`abi`, `AbiStateMutability`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `abi` | extends readonly `unknown`[] \| `Abi` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | `DecodeFunctionDataParameters`\<`abi`\> |

#### Returns

`DecodeFunctionDataReturnType`\<`abi`, `ContractFunctionName`\<`abi`, `AbiStateMutability`\>\>

#### Defined in

node_modules/.pnpm/viem@2.0.2_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/abi/decodeFunctionData.d.ts:25

___

### decodeFunctionResult

▸ **decodeFunctionResult**\<`abi`, `functionName`, `args`\>(`parameters`): `DecodeFunctionResultReturnType`\<`abi`, `functionName`, `args`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `abi` | extends readonly `unknown`[] \| `Abi` |
| `functionName` | extends `undefined` \| `string` = `undefined` |
| `args` | extends `unknown` = `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` extends `ContractFunctionName`\<`abi`\> ? `functionName` : `ContractFunctionName`\<`abi`\>\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | `DecodeFunctionResultParameters`\<`abi`, `functionName`, `args`, `abi` extends `Abi` ? `Abi` extends `abi` ? ``true`` : [`Extract`\<`abi`[`number`], \{ `stateMutability`: `AbiStateMutability` ; `type`: ``"function"``  }\>] extends [`never`] ? ``false`` : ``true`` : ``true``, `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` extends `ContractFunctionName`\<`abi`, `AbiStateMutability`\> ? `functionName` : `ContractFunctionName`\<`abi`, `AbiStateMutability`\>\>, `ContractFunctionName`\<`abi`, `AbiStateMutability`\>\> |

#### Returns

`DecodeFunctionResultReturnType`\<`abi`, `functionName`, `args`\>

#### Defined in

node_modules/.pnpm/viem@2.0.2_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/abi/decodeFunctionResult.d.ts:25

___

### encodeFunctionData

▸ **encodeFunctionData**\<`abi`, `functionName`\>(`parameters`): `EncodeFunctionDataReturnType`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `abi` | extends readonly `unknown`[] \| `Abi` |
| `functionName` | extends `undefined` \| `string` = `undefined` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | `EncodeFunctionDataParameters`\<`abi`, `functionName`, `abi` extends `Abi` ? `Abi` extends `abi` ? ``true`` : [`Extract`\<`abi`[`number`], \{ `stateMutability`: `AbiStateMutability` ; `type`: ``"function"``  }\>] extends [`never`] ? ``false`` : ``true`` : ``true``, `ContractFunctionArgs`\<`abi`, `AbiStateMutability`, `functionName` extends `ContractFunctionName`\<`abi`, `AbiStateMutability`\> ? `functionName` : `ContractFunctionName`\<`abi`, `AbiStateMutability`\>\>, `ContractFunctionName`\<`abi`, `AbiStateMutability`\>\> |

#### Returns

`EncodeFunctionDataReturnType`

#### Defined in

node_modules/.pnpm/viem@2.0.2_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/abi/encodeFunctionData.d.ts:27

___

### encodeFunctionResult

▸ **encodeFunctionResult**\<`abi`, `functionName`\>(`parameters`): `EncodeFunctionResultReturnType`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `abi` | extends readonly `unknown`[] \| `Abi` |
| `functionName` | extends `undefined` \| `string` = `undefined` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | `EncodeFunctionResultParameters`\<`abi`, `functionName`, `abi` extends `Abi` ? `Abi` extends `abi` ? ``true`` : [`Extract`\<`abi`[`number`], \{ `stateMutability`: `AbiStateMutability` ; `type`: ``"function"``  }\>] extends [`never`] ? ``false`` : ``true`` : ``true``, `ContractFunctionName`\<`abi`, `AbiStateMutability`\>\> |

#### Returns

`EncodeFunctionResultReturnType`

#### Defined in

node_modules/.pnpm/viem@2.0.2_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/abi/encodeFunctionResult.d.ts:21

___

### formatAbi

▸ **formatAbi**\<`TAbi`\>(`abi`): `FormatAbi`\<`TAbi`\>

Parses JSON ABI into human-readable ABI

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TAbi` | extends `Abi` \| readonly `unknown`[] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `abi` | `TAbi` | ABI |

#### Returns

`FormatAbi`\<`TAbi`\>

Human-readable ABI

#### Defined in

node_modules/.pnpm/abitype@0.10.2_typescript@5.3.3_zod@3.22.4/node_modules/abitype/dist/types/human-readable/formatAbi.d.ts:18

___

### formatEther

▸ **formatEther**(`wei`, `unit?`): `string`

Converts numerical wei to a string representation of ether.

- Docs: https://viem.sh/docs/utilities/formatEther.html

#### Parameters

| Name | Type |
| :------ | :------ |
| `wei` | `bigint` |
| `unit?` | ``"wei"`` \| ``"gwei"`` |

#### Returns

`string`

**`Example`**

```ts
import { formatEther } from 'viem'

formatEther(1000000000000000000n)
// '1'
```

#### Defined in

node_modules/.pnpm/viem@2.0.2_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/unit/formatEther.d.ts:14

___

### formatGwei

▸ **formatGwei**(`wei`, `unit?`): `string`

Converts numerical wei to a string representation of gwei.

- Docs: https://viem.sh/docs/utilities/formatGwei.html

#### Parameters

| Name | Type |
| :------ | :------ |
| `wei` | `bigint` |
| `unit?` | ``"wei"`` |

#### Returns

`string`

**`Example`**

```ts
import { formatGwei } from 'viem'

formatGwei(1000000000n)
// '1'
```

#### Defined in

node_modules/.pnpm/viem@2.0.2_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/unit/formatGwei.d.ts:14

___

### formatLog

▸ **formatLog**(`log`, `«destructured»?`): `Log`

#### Parameters

| Name | Type |
| :------ | :------ |
| `log` | `Partial`\<`RpcLog`\> |
| `«destructured»` | `Object` |
| › `args?` | `unknown` |
| › `eventName?` | `string` |

#### Returns

`Log`

#### Defined in

node_modules/.pnpm/viem@2.0.2_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/formatters/log.d.ts:5

___

### fromBytes

▸ **fromBytes**\<`TTo`\>(`bytes`, `toOrOpts`): `FromBytesReturnType`\<`TTo`\>

Decodes a byte array into a UTF-8 string, hex value, number, bigint or boolean.

- Docs: https://viem.sh/docs/utilities/fromBytes.html
- Example: https://viem.sh/docs/utilities/fromBytes.html#usage

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TTo` | extends ``"string"`` \| ``"number"`` \| ``"bigint"`` \| ``"boolean"`` \| ``"hex"`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bytes` | `Uint8Array` | Byte array to decode. |
| `toOrOpts` | `FromBytesParameters`\<`TTo`\> | Type to convert to or options. |

#### Returns

`FromBytesReturnType`\<`TTo`\>

Decoded value.

**`Example`**

```ts
import { fromBytes } from 'viem'
const data = fromBytes(new Uint8Array([1, 164]), 'number')
// 420
```

**`Example`**

```ts
import { fromBytes } from 'viem'
const data = fromBytes(
  new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]),
  'string'
)
// 'Hello world'
```

#### Defined in

node_modules/.pnpm/viem@2.0.2_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/fromBytes.d.ts:37

___

### fromHex

▸ **fromHex**\<`TTo`\>(`hex`, `toOrOpts`): `FromHexReturnType`\<`TTo`\>

Decodes a hex string into a string, number, bigint, boolean, or byte array.

- Docs: https://viem.sh/docs/utilities/fromHex.html
- Example: https://viem.sh/docs/utilities/fromHex.html#usage

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TTo` | extends ``"string"`` \| ``"number"`` \| ``"bigint"`` \| ``"boolean"`` \| ``"bytes"`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hex` | \`0x$\{string}\` | Hex string to decode. |
| `toOrOpts` | `FromHexParameters`\<`TTo`\> | Type to convert to or options. |

#### Returns

`FromHexReturnType`\<`TTo`\>

Decoded value.

**`Example`**

```ts
import { fromHex } from 'viem'
const data = fromHex('0x1a4', 'number')
// 420
```

**`Example`**

```ts
import { fromHex } from 'viem'
const data = fromHex('0x48656c6c6f20576f726c6421', 'string')
// 'Hello world'
```

**`Example`**

```ts
import { fromHex } from 'viem'
const data = fromHex('0x48656c6c6f20576f726c64210000000000000000000000000000000000000000', {
  size: 32,
  to: 'string'
})
// 'Hello world'
```

#### Defined in

node_modules/.pnpm/viem@2.0.2_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/fromHex.d.ts:47

___

### parseAbi

▸ **parseAbi**\<`TSignatures`\>(`signatures`): `ParseAbi`\<`TSignatures`\>

Parses human-readable ABI into JSON Abi

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TSignatures` | extends readonly `string`[] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `signatures` | `TSignatures`[``"length"``] extends ``0`` ? [``"Error: At least one signature required"``] : `Signatures`\<`TSignatures`\> extends `TSignatures` ? `TSignatures` : `Signatures`\<`TSignatures`\> | Human-Readable ABI |

#### Returns

`ParseAbi`\<`TSignatures`\>

Parsed Abi

**`Example`**

```ts
const abi = parseAbi([
  //  ^? const abi: readonly [{ name: "balanceOf"; type: "function"; stateMutability:...
  'function balanceOf(address owner) view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 amount)',
])
```

#### Defined in

node_modules/.pnpm/abitype@0.10.2_typescript@5.3.3_zod@3.22.4/node_modules/abitype/dist/types/human-readable/parseAbi.d.ts:37

___

### toBytes

▸ **toBytes**(`value`, `opts?`): `ByteArray`

Encodes a UTF-8 string, hex value, bigint, number or boolean to a byte array.

- Docs: https://viem.sh/docs/utilities/toBytes.html
- Example: https://viem.sh/docs/utilities/toBytes.html#usage

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `bigint` \| `boolean` | Value to encode. |
| `opts?` | `ToBytesParameters` | Options. |

#### Returns

`ByteArray`

Byte array value.

**`Example`**

```ts
import { toBytes } from 'viem'
const data = toBytes('Hello world')
// Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
```

**`Example`**

```ts
import { toBytes } from 'viem'
const data = toBytes(420)
// Uint8Array([1, 164])
```

**`Example`**

```ts
import { toBytes } from 'viem'
const data = toBytes(420, { size: 4 })
// Uint8Array([0, 0, 1, 164])
```

#### Defined in

node_modules/.pnpm/viem@2.0.2_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/toBytes.d.ts:37

___

### toHex

▸ **toHex**(`value`, `opts?`): `Hex`

Encodes a string, number, bigint, or ByteArray into a hex string

- Docs: https://viem.sh/docs/utilities/toHex.html
- Example: https://viem.sh/docs/utilities/toHex.html#usage

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` \| `number` \| `bigint` \| `boolean` \| `Uint8Array` | Value to encode. |
| `opts?` | `ToHexParameters` | Options. |

#### Returns

`Hex`

Hex value.

**`Example`**

```ts
import { toHex } from 'viem'
const data = toHex('Hello world')
// '0x48656c6c6f20776f726c6421'
```

**`Example`**

```ts
import { toHex } from 'viem'
const data = toHex(420)
// '0x1a4'
```

**`Example`**

```ts
import { toHex } from 'viem'
const data = toHex('Hello world', { size: 32 })
// '0x48656c6c6f20776f726c64210000000000000000000000000000000000000000'
```

#### Defined in

node_modules/.pnpm/viem@2.0.2_typescript@5.3.3_zod@3.22.4/node_modules/viem/_types/utils/encoding/toHex.d.ts:36

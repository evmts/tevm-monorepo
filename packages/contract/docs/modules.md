[@tevm/contract](README.md) / Exports

# @tevm/contract

## Table of contents

### Type Aliases

- [TevmContract](modules.md#tevmcontract)

### Functions

- [createTevmContract](modules.md#createtevmcontract)
- [createTevmContractFromAbi](modules.md#createtevmcontractfromabi)
- [decodeFunctionData](modules.md#decodefunctiondata)
- [decodeFunctionResult](modules.md#decodefunctionresult)
- [encodeFunctionData](modules.md#encodefunctiondata)
- [encodeFunctionResult](modules.md#encodefunctionresult)
- [formatAbi](modules.md#formatabi)
- [fromBytes](modules.md#frombytes)
- [fromHex](modules.md#fromhex)
- [parseAbi](modules.md#parseabi)
- [toBytes](modules.md#tobytes)
- [toHex](modules.md#tohex)

## Type Aliases

### TevmContract

Ƭ **TevmContract**\<`TName`, `THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends `ReadonlyArray`\<`string`\> |
| `TBytecode` | extends `Hex` \| `undefined` |
| `TDeployedBytecode` | extends `Hex` \| `undefined` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `abi` | `ParseAbi`\<`THumanReadableAbi`\> |
| `bytecode` | `TBytecode` |
| `deployedBytecode` | `TDeployedBytecode` |
| `events` | `Events`\<`TName`, `THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`\> |
| `humanReadableAbi` | `THumanReadableAbi` |
| `name` | `TName` |
| `read` | `Read`\<`TName`, `THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`\> |
| `write` | `Write`\<`TName`, `THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`\> |

#### Defined in

[packages/contract/src/TevmContract.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/TevmContract.ts#L7)

## Functions

### createTevmContract

▸ **createTevmContract**\<`TName`, `THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`\>(`«destructured»`): [`TevmContract`](modules.md#tevmcontract)\<`TName`, `THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends readonly `string`[] |
| `TBytecode` | extends `undefined` \| \`0x$\{string}\` |
| `TDeployedBytecode` | extends `undefined` \| \`0x$\{string}\` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Pick`\<[`TevmContract`](modules.md#tevmcontract)\<`TName`, `THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`\>, ``"name"`` \| ``"bytecode"`` \| ``"deployedBytecode"`` \| ``"humanReadableAbi"``\> |

#### Returns

[`TevmContract`](modules.md#tevmcontract)\<`TName`, `THumanReadableAbi`, `TBytecode`, `TDeployedBytecode`\>

#### Defined in

[packages/contract/src/createTevmContract.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/createTevmContract.ts#L8)

___

### createTevmContractFromAbi

▸ **createTevmContractFromAbi**\<`TName`, `TAbi`, `TBytecode`, `TDeployedBytecode`\>(`«destructured»`): [`TevmContract`](modules.md#tevmcontract)\<`TName`, `FormatAbi`\<`TAbi`\>, `TBytecode`, `TDeployedBytecode`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `TAbi` | extends `Abi` |
| `TBytecode` | extends `undefined` \| \`0x$\{string}\` |
| `TDeployedBytecode` | extends `undefined` \| \`0x$\{string}\` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Pick`\<[`TevmContract`](modules.md#tevmcontract)\<`TName`, `FormatAbi`\<`TAbi`\>, `TBytecode`, `TDeployedBytecode`\>, ``"name"`` \| ``"abi"`` \| ``"bytecode"`` \| ``"deployedBytecode"``\> |

#### Returns

[`TevmContract`](modules.md#tevmcontract)\<`TName`, `FormatAbi`\<`TAbi`\>, `TBytecode`, `TDeployedBytecode`\>

#### Defined in

[packages/contract/src/createTevmContractFromAbi.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/createTevmContractFromAbi.ts#L8)

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

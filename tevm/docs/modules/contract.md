[tevm](../README.md) / [Modules](../modules.md) / contract

# Module: contract

## Table of contents

### References

- [Contract](contract.md#contract)
- [createContract](contract.md#createcontract)
- [decodeFunctionData](contract.md#decodefunctiondata)
- [decodeFunctionResult](contract.md#decodefunctionresult)
- [encodeFunctionData](contract.md#encodefunctiondata)
- [encodeFunctionResult](contract.md#encodefunctionresult)
- [parseAbi](contract.md#parseabi)

### Type Aliases

- [CreateContractParams](contract.md#createcontractparams)
- [CreateScriptParams](contract.md#createscriptparams)
- [Script](contract.md#script)

### Functions

- [createScript](contract.md#createscript)
- [formatAbi](contract.md#formatabi)
- [formatEther](contract.md#formatether)
- [formatGwei](contract.md#formatgwei)
- [formatLog](contract.md#formatlog)
- [fromBytes](contract.md#frombytes)
- [fromHex](contract.md#fromhex)
- [toBytes](contract.md#tobytes)
- [toHex](contract.md#tohex)

## References

### Contract

Re-exports [Contract](index.md#contract)

___

### createContract

Re-exports [createContract](index.md#createcontract)

___

### decodeFunctionData

Re-exports [decodeFunctionData](index.md#decodefunctiondata)

___

### decodeFunctionResult

Re-exports [decodeFunctionResult](index.md#decodefunctionresult)

___

### encodeFunctionData

Re-exports [encodeFunctionData](index.md#encodefunctiondata)

___

### encodeFunctionResult

Re-exports [encodeFunctionResult](index.md#encodefunctionresult)

___

### parseAbi

Re-exports [parseAbi](index.md#parseabi)

## Type Aliases

### CreateContractParams

Ƭ **CreateContractParams**\<`TName`, `THumanReadableAbi`\>: `Pick`\<[`Contract`](index.md#contract)\<`TName`, `THumanReadableAbi`\>, ``"name"`` \| ``"humanReadableAbi"``\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends readonly `string`[] |

#### Defined in

packages/contract/dist/index.d.ts:108

___

### CreateScriptParams

Ƭ **CreateScriptParams**\<`TName`, `THumanReadableAbi`\>: `Pick`\<[`Script`](contract.md#script)\<`TName`, `THumanReadableAbi`\>, ``"name"`` \| ``"humanReadableAbi"`` \| ``"bytecode"`` \| ``"deployedBytecode"``\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends readonly `string`[] |

#### Defined in

packages/contract/dist/index.d.ts:110

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
| `events` | `Events`\<`THumanReadableAbi`, `Hex`, `Hex`, `undefined`\> |
| `humanReadableAbi` | `THumanReadableAbi` |
| `name` | `TName` |
| `read` | `Read`\<`THumanReadableAbi`, `Hex`, `Hex`, `undefined`\> |
| `withAddress` | \<TAddress\>(`address`: `TAddress`) => [`Script`](contract.md#script)\<`TName`, `THumanReadableAbi`\> & \{ `address`: `TAddress` ; `events`: `Events`\<`THumanReadableAbi`, `Hex`, `Hex`, `TAddress`\> ; `read`: `Read`\<`THumanReadableAbi`, `Hex`, `Hex`, `TAddress`\> ; `write`: `Write`\<`THumanReadableAbi`, `Hex`, `Hex`, `TAddress`\>  } |
| `write` | `Write`\<`THumanReadableAbi`, `Hex`, `Hex`, `undefined`\> |

#### Defined in

packages/contract/dist/index.d.ts:91

## Functions

### createScript

▸ **createScript**\<`TName`, `THumanReadableAbi`\>(`«destructured»`): [`Script`](contract.md#script)\<`TName`, `THumanReadableAbi`\>

Creates a Tevm Script instance from humanReadableAbi and bytecode

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TName` | extends `string` |
| `THumanReadableAbi` | extends readonly `string`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`CreateScriptParams`](contract.md#createscriptparams)\<`TName`, `THumanReadableAbi`\> |

#### Returns

[`Script`](contract.md#script)\<`TName`, `THumanReadableAbi`\>

#### Defined in

packages/contract/dist/index.d.ts:111

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

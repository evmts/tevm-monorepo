[**@tevm/utils**](../README.md) • **Docs**

***

[@tevm/utils](../globals.md) / boolToBytes

# Function: boolToBytes()

> **boolToBytes**(`value`, `opts`?): `Uint8Array`

Encodes a boolean into a byte array.

- Docs: https://viem.sh/docs/utilities/toBytes#booltobytes

## Parameters

• **value**: `boolean`

Boolean value to encode.

• **opts?**: `BoolToBytesOpts`

Options.

## Returns

`Uint8Array`

Byte array value.

## Examples

```ts
import { boolToBytes } from 'viem'
const data = boolToBytes(true)
// Uint8Array([1])
```

```ts
import { boolToBytes } from 'viem'
const data = boolToBytes(true, { size: 32 })
// Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1])
```

## Defined in

node\_modules/.pnpm/viem@2.21.1\_bufferutil@4.0.8\_typescript@5.7.3\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/utils/encoding/toBytes.d.ts:62

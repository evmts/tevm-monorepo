[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / boolToBytes

# Function: boolToBytes()

> **boolToBytes**(`value`, `opts`?): `Uint8Array`

Defined in: node\_modules/.pnpm/viem@2.23.5\_bufferutil@4.0.9\_typescript@5.8.2\_utf-8-validate@6.0.5\_zod@3.24.2/node\_modules/viem/\_types/utils/encoding/toBytes.d.ts:62

Encodes a boolean into a byte array.

- Docs: https://viem.sh/docs/utilities/toBytes#booltobytes

## Parameters

### value

`boolean`

Boolean value to encode.

### opts?

`BoolToBytesOpts`

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

[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / boolToBytes

# Function: boolToBytes()

> **boolToBytes**(`value`, `opts?`): `ByteArray`

Defined in: node\_modules/.pnpm/viem@2.37.8\_bufferutil@4.0.9\_typescript@5.9.2\_utf-8-validate@5.0.10\_zod@4.1.11/node\_modules/viem/\_types/utils/encoding/toBytes.d.ts:62

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

`ByteArray`

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

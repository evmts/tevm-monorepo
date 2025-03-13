[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / boolToHex

# Function: boolToHex()

> **boolToHex**(`value`, `opts`?): `` `0x${string}` ``

Defined in: node\_modules/.pnpm/viem@2.23.10\_bufferutil@4.0.9\_typescript@5.8.2\_utf-8-validate@5.0.10\_zod@3.24.2/node\_modules/viem/\_types/utils/encoding/toHex.d.ts:66

Encodes a boolean into a hex string

- Docs: https://viem.sh/docs/utilities/toHex#booltohex

## Parameters

### value

`boolean`

Value to encode.

### opts?

`BoolToHexOpts`

Options.

## Returns

`` `0x${string}` ``

Hex value.

## Examples

```ts
import { boolToHex } from 'viem'
const data = boolToHex(true)
// '0x1'
```

```ts
import { boolToHex } from 'viem'
const data = boolToHex(false)
// '0x0'
```

```ts
import { boolToHex } from 'viem'
const data = boolToHex(true, { size: 32 })
// '0x0000000000000000000000000000000000000000000000000000000000000001'
```

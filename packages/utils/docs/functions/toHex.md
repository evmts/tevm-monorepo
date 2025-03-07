[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / toHex

# Function: toHex()

> **toHex**(`value`, `opts`?): `` `0x${string}` ``

Defined in: node\_modules/.pnpm/viem@2.23.5\_bufferutil@4.0.9\_typescript@5.8.2\_utf-8-validate@6.0.5\_zod@3.24.2/node\_modules/viem/\_types/utils/encoding/toHex.d.ts:36

Encodes a string, number, bigint, or ByteArray into a hex string

- Docs: https://viem.sh/docs/utilities/toHex
- Example: https://viem.sh/docs/utilities/toHex#usage

## Parameters

### value

Value to encode.

`string` | `number` | `bigint` | `boolean` | `ByteArray`

### opts?

`ToHexParameters`

Options.

## Returns

`` `0x${string}` ``

Hex value.

## Examples

```ts
import { toHex } from 'viem'
const data = toHex('Hello world')
// '0x48656c6c6f20776f726c6421'
```

```ts
import { toHex } from 'viem'
const data = toHex(420)
// '0x1a4'
```

```ts
import { toHex } from 'viem'
const data = toHex('Hello world', { size: 32 })
// '0x48656c6c6f20776f726c64210000000000000000000000000000000000000000'
```

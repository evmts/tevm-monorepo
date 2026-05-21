[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / toHex

# Function: toHex()

> **toHex**(`value`, `opts?`): `` `0x${string}` ``

Defined in: tevm-monorepo/node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/utils/encoding/toHex.d.ts:36

Encodes a string, number, bigint, or ByteArray into a hex string

- Docs: https://viem.sh/docs/utilities/toHex
- Example: https://viem.sh/docs/utilities/toHex#usage

## Parameters

### value

`string` \| `number` \| `bigint` \| `boolean` \| `ByteArray`

Value to encode.

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

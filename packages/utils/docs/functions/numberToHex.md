[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / numberToHex

# Function: numberToHex()

> **numberToHex**(`value_`, `opts`?): `` `0x${string}` ``

Defined in: node\_modules/.pnpm/viem@2.23.5\_bufferutil@4.0.9\_typescript@5.8.2\_utf-8-validate@6.0.5\_zod@3.24.2/node\_modules/viem/\_types/utils/encoding/toHex.d.ts:122

Encodes a number or bigint into a hex string

- Docs: https://viem.sh/docs/utilities/toHex#numbertohex

## Parameters

### value\_

`number` | `bigint`

### opts?

`NumberToHexOpts`

Options.

## Returns

`` `0x${string}` ``

Hex value.

## Examples

```ts
import { numberToHex } from 'viem'
const data = numberToHex(420)
// '0x1a4'
```

```ts
import { numberToHex } from 'viem'
const data = numberToHex(420, { size: 32 })
// '0x00000000000000000000000000000000000000000000000000000000000001a4'
```

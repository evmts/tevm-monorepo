[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / numberToHex

# Function: numberToHex()

> **numberToHex**(`value_`, `opts?`): `` `0x${string}` ``

Defined in: tevm-monorepo/node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/utils/encoding/toHex.d.ts:122

Encodes a number or bigint into a hex string

- Docs: https://viem.sh/docs/utilities/toHex#numbertohex

## Parameters

### value\_

`number` \| `bigint`

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

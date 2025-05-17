[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / hexToNumber

# Function: hexToNumber()

> **hexToNumber**(`hex`, `opts?`): `number`

Defined in: node\_modules/.pnpm/viem@2.23.10\_bufferutil@4.0.9\_typescript@5.8.3\_utf-8-validate@5.0.10\_zod@3.24.4/node\_modules/viem/\_types/utils/encoding/fromHex.d.ts:121

Decodes a hex string into a number.

- Docs: https://viem.sh/docs/utilities/fromHex#hextonumber

## Parameters

### hex

`` `0x${string}` ``

Hex value to decode.

### opts?

`HexToBigIntOpts`

Options.

## Returns

`number`

Number value.

## Examples

```ts
import { hexToNumber } from 'viem'
const data = hexToNumber('0x1a4')
// 420
```

```ts
import { hexToNumber } from 'viem'
const data = hexToBigInt('0x00000000000000000000000000000000000000000000000000000000000001a4', { size: 32 })
// 420
```

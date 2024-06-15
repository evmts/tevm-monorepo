[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / hexToBigInt

# Function: hexToBigInt()

> **hexToBigInt**(`hex`, `opts`?): `bigint`

Decodes a hex value into a bigint.

- Docs: https://viem.sh/docs/utilities/fromHex#hextobigint

## Parameters

• **hex**: \`0x$\{string\}\`

Hex value to decode.

• **opts?**: `HexToBigIntOpts`

Options.

## Returns

`bigint`

BigInt value.

## Examples

```ts
import { hexToBigInt } from 'viem'
const data = hexToBigInt('0x1a4', { signed: true })
// 420n
```

```ts
import { hexToBigInt } from 'viem'
const data = hexToBigInt('0x00000000000000000000000000000000000000000000000000000000000001a4', { size: 32 })
// 420n
```

## Source

node\_modules/.pnpm/viem@2.13.6\_bufferutil@4.0.8\_typescript@5.4.5\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/utils/encoding/fromHex.d.ts:74

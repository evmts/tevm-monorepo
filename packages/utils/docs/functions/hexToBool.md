[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / hexToBool

# Function: hexToBool()

> **hexToBool**(`hex_`, `opts?`): `boolean`

Defined in: node\_modules/.pnpm/viem@2.30.1\_bufferutil@4.0.9\_typescript@5.8.3\_utf-8-validate@5.0.10\_zod@3.25.28/node\_modules/viem/\_types/utils/encoding/fromHex.d.ts:99

Decodes a hex value into a boolean.

- Docs: https://viem.sh/docs/utilities/fromHex#hextobool

## Parameters

### hex\_

`` `0x${string}` ``

### opts?

`HexToBoolOpts`

Options.

## Returns

`boolean`

Boolean value.

## Examples

```ts
import { hexToBool } from 'viem'
const data = hexToBool('0x01')
// true
```

```ts
import { hexToBool } from 'viem'
const data = hexToBool('0x0000000000000000000000000000000000000000000000000000000000000001', { size: 32 })
// true
```

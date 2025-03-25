[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / hexToString

# Function: hexToString()

> **hexToString**(`hex`, `opts`?): `string`

Defined in: node\_modules/.pnpm/viem@2.23.11\_bufferutil@4.0.9\_typescript@5.8.2\_utf-8-validate@5.0.10\_zod@3.24.2/node\_modules/viem/\_types/utils/encoding/fromHex.d.ts:148

Decodes a hex value into a UTF-8 string.

- Docs: https://viem.sh/docs/utilities/fromHex#hextostring

## Parameters

### hex

`` `0x${string}` ``

Hex value to decode.

### opts?

`HexToStringOpts`

Options.

## Returns

`string`

String value.

## Examples

```ts
import { hexToString } from 'viem'
const data = hexToString('0x48656c6c6f20576f726c6421')
// 'Hello world!'
```

```ts
import { hexToString } from 'viem'
const data = hexToString('0x48656c6c6f20576f726c64210000000000000000000000000000000000000000', {
 size: 32,
})
// 'Hello world'
```

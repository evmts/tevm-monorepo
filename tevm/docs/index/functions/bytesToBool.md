[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / bytesToBool

# Function: bytesToBool()

> **bytesToBool**(`bytes_`, `opts?`): `boolean`

Defined in: node\_modules/.pnpm/viem@2.37.9\_bufferutil@4.0.9\_typescript@5.9.2\_utf-8-validate@5.0.10\_zod@4.1.11/node\_modules/viem/\_types/utils/encoding/fromBytes.d.ts:79

Decodes a byte array into a boolean.

- Docs: https://viem.sh/docs/utilities/fromBytes#bytestobool

## Parameters

### bytes\_

`ByteArray`

### opts?

`BytesToBoolOpts`

Options.

## Returns

`boolean`

Boolean value.

## Example

```ts
import { bytesToBool } from 'viem'
const data = bytesToBool(new Uint8Array([1]))
// true
```

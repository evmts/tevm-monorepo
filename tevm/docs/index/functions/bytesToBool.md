[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / bytesToBool

# Function: bytesToBool()

> **bytesToBool**(`bytes_`, `opts`?): `boolean`

Decodes a byte array into a boolean.

- Docs: https://viem.sh/docs/utilities/fromBytes#bytestobool

## Parameters

• **bytes\_**: `Uint8Array`

• **opts?**: `BytesToBoolOpts`

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

## Defined in

node\_modules/.pnpm/viem@2.21.1\_bufferutil@4.0.8\_typescript@5.7.3\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/utils/encoding/fromBytes.d.ts:79

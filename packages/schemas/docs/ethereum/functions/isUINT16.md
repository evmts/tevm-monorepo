**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > isUINT16

# Function: isUINT16()

> **isUINT16**(`uint16`): `boolean`

Type guard that returns true if the provided bigint is a valid Ethereum UINT16.

## Parameters

▪ **uint16**: `unknown`

## Returns

## Example

```ts
import { isUINT16 } from '@tevm/schemas';
isUINT16(BigInt(32767));  // true
isUINT16(BigInt(65536));  // false
````

## Source

[packages/schemas/src/ethereum/SUINT/isUINT.js:43](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SUINT/isUINT.js#L43)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > isUINT32

# Function: isUINT32()

> **isUINT32**(`uint32`): `boolean`

Type guard that returns true if the provided bigint is a valid Ethereum UINT32.

## Parameters

▪ **uint32**: `unknown`

## Returns

## Example

```ts
import { isUINT32 } from '@tevm/schemas';
isUINT32(BigInt(2147483647));  // true
isUINT32(BigInt(4294967296));  // false
````

## Source

[packages/schemas/src/ethereum/SUINT/isUINT.js:57](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SUINT/isUINT.js#L57)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

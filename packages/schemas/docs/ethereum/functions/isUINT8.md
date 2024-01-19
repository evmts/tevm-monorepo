**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > isUINT8

# Function: isUINT8()

> **isUINT8**(`uint8`): `boolean`

Type guard that returns true if the provided bigint is a valid Ethereum UINT8.

## Parameters

▪ **uint8**: `unknown`

## Returns

## Example

```ts
import { isUINT8 } from '@tevm/schemas';
isUINT8(BigInt(127));  // true
isUINT8(BigInt(256));  // false
````

## Source

[packages/schemas/src/ethereum/SUINT/isUINT.js:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SUINT/isUINT.js#L29)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

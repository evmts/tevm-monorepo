**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > isUINT128

# Function: isUINT128()

> **isUINT128**(`uint128`): `boolean`

Type guard that returns true if the provided bigint is a valid Ethereum UINT128.

## Parameters

▪ **uint128**: `unknown`

## Returns

## Example

```ts
import { isUINT128 } from '@tevm/schemas';
isUINT128(BigInt("170141183460469231731687303715884105727"));  // true
isUINT128(BigInt("340282366920938463463374607431768211456"));  // false
````

## Source

[packages/schemas/src/ethereum/SUINT/isUINT.js:85](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SUINT/isUINT.js#L85)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

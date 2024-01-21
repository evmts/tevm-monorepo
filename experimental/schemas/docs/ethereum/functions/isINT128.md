**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > isINT128

# Function: isINT128()

> **isINT128**(`int128`): `boolean`

Type guard that returns true if the provided bigint is a valid Ethereum INT128.

## Parameters

▪ **int128**: `unknown`

## Returns

## Example

```ts
import { isINT128 } from '@tevm/schemas';
isINT128(BigInt("-170141183460469231731687303715884105728"));  // true
isINT128(BigInt("170141183460469231731687303715884105727"));   // true
isINT128(BigInt("170141183460469231731687303715884105728"));   // false
isINT128(BigInt("-170141183460469231731687303715884105729"));  // false
````

## Source

[experimental/schemas/src/ethereum/SINT/isINT.js:92](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SINT/isINT.js#L92)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

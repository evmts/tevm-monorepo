**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > isINT64

# Function: isINT64()

> **isINT64**(`int64`): `boolean`

Type guard that returns true if the provided bigint is a valid Ethereum INT64.

## Parameters

▪ **int64**: `unknown`

## Returns

## Example

```ts
import { isINT64 } from '@tevm/schemas';
isINT64(BigInt("-9223372036854775808"));  // true
isINT64(BigInt("9223372036854775807"));   // true
isINT64(BigInt("9223372036854775808"));   // false
isINT64(BigInt("-9223372036854775809"));  // false
````

## Source

[packages/schemas/src/ethereum/SINT/isINT.js:75](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SINT/isINT.js#L75)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

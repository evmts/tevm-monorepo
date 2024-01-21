**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > isINT8

# Function: isINT8()

> **isINT8**(`int8`): `boolean`

Type guard that returns true if the provided bigint is a valid Ethereum INT8.

## Parameters

▪ **int8**: `unknown`

## Returns

## Example

```ts
import { isINT8 } from '@tevm/schemas';
isINT8(BigInt(-128));  // true
isINT8(BigInt(127));   // true
isINT8(BigInt(128));   // false
isINT8(BigInt(-129));  // false
````

## Source

[packages/schemas/src/ethereum/SINT/isINT.js:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SINT/isINT.js#L24)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

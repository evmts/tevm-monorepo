**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > isINT16

# Function: isINT16()

> **isINT16**(`int16`): `boolean`

Type guard that returns true if the provided bigint is a valid Ethereum INT16.

## Parameters

▪ **int16**: `unknown`

## Returns

## Example

```ts
import { isINT16 } from '@tevm/schemas';
isINT16(BigInt(-32768));  // true
isINT16(BigInt(32767));   // true
isINT16(BigInt(32768));   // false
isINT16(BigInt(-32769));  // false
````

## Source

[packages/schemas/src/ethereum/SINT/isINT.js:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SINT/isINT.js#L41)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > isINT32

# Function: isINT32()

> **isINT32**(`int32`): `boolean`

Type guard that returns true if the provided bigint is a valid Ethereum INT32.

## Parameters

▪ **int32**: `unknown`

## Returns

## Example

```ts
import { isINT32 } from '@tevm/schemas';
isINT32(BigInt(-2147483648));  // true
isINT32(BigInt(2147483647));   // true
isINT32(BigInt(2147483648));   // false
isINT32(BigInt(-2147483649));  // false
````

## Source

[experimental/schemas/src/ethereum/SINT/isINT.js:58](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SINT/isINT.js#L58)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

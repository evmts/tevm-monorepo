**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > isBytes15

# Function: isBytes15()

> **isBytes15**(`bytes15`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes15.

## Parameters

▪ **bytes15**: `unknown`

## Returns

## Example

```ts
import { isBytes15 } from '@tevm/schemas';
isBytes15("0xff");  // true
isBytes15("0xfff"); // false
````

## Source

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:266](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L266)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

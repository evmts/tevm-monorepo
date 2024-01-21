**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > isBytes26

# Function: isBytes26()

> **isBytes26**(`bytes26`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes26.

## Parameters

▪ **bytes26**: `unknown`

## Returns

## Example

```ts
import { isBytes26 } from '@tevm/schemas';
isBytes26("0xff");  // true
isBytes26("0xfff"); // false
````

## Source

[packages/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:431](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L431)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

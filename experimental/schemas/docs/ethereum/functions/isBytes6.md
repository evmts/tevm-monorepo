**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > isBytes6

# Function: isBytes6()

> **isBytes6**(`bytes6`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes6.

## Parameters

▪ **bytes6**: `unknown`

## Returns

## Example

```ts
import { isBytes6 } from '@tevm/schemas';
isBytes6("0xff");  // true
isBytes6("0xfff"); // false
````

## Source

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:131](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L131)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > isBytes18

# Function: isBytes18()

> **isBytes18**(`bytes18`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes18.

## Parameters

▪ **bytes18**: `unknown`

## Returns

## Example

```ts
import { isBytes18 } from '@tevm/schemas';
isBytes18("0xff");  // true
isBytes18("0xfff"); // false
````

## Source

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:311](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L311)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > isBytes22

# Function: isBytes22()

> **isBytes22**(`bytes22`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes22.

## Parameters

▪ **bytes22**: `unknown`

## Returns

## Example

```ts
import { isBytes22 } from '@tevm/schemas';
isBytes22("0xff");  // true
isBytes22("0xfff"); // false
````

## Source

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:371](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L371)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

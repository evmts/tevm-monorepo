**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > isBytes25

# Function: isBytes25()

> **isBytes25**(`bytes25`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes25.

## Parameters

▪ **bytes25**: `unknown`

## Returns

## Example

```ts
import { isBytes25 } from '@tevm/schemas';
isBytes25("0xff");  // true
isBytes25("0xfff"); // false
````

## Source

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:416](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L416)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

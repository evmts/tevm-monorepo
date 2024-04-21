**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > isBytes12

# Function: isBytes12()

> **isBytes12**(`bytes12`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes12.

## Parameters

▪ **bytes12**: `unknown`

## Returns

## Example

```ts
import { isBytes12 } from '@tevm/schemas';
isBytes12("0xff");  // true
isBytes12("0xfff"); // false
````

## Source

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:221](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L221)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

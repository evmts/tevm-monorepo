**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > isBytes7

# Function: isBytes7()

> **isBytes7**(`bytes7`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes7.

## Parameters

▪ **bytes7**: `unknown`

## Returns

## Example

```ts
import { isBytes7 } from '@tevm/schemas';
isBytes7("0xff");  // true
isBytes7("0xfff"); // false
````

## Source

[packages/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:146](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L146)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > isBytes4

# Function: isBytes4()

> **isBytes4**(`bytes4`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes4.

## Parameters

▪ **bytes4**: `unknown`

## Returns

## Example

```ts
import { isBytes4 } from '@tevm/schemas';
isBytes4("0xff");  // true
isBytes4("0xfff"); // false
````

## Source

[packages/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:101](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L101)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

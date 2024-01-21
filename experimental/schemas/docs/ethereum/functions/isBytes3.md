**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > isBytes3

# Function: isBytes3()

> **isBytes3**(`bytes3`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes3.

## Parameters

▪ **bytes3**: `unknown`

## Returns

## Example

```ts
import { isBytes3 } from '@tevm/schemas';
isBytes3("0xff");  // true
isBytes3("0xfff"); // false
````

## Source

[packages/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:86](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L86)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

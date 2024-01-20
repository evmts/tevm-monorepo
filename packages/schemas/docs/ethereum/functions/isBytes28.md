**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > isBytes28

# Function: isBytes28()

> **isBytes28**(`bytes28`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes28.

## Parameters

▪ **bytes28**: `unknown`

## Returns

## Example

```ts
import { isBytes28 } from '@tevm/schemas';
isBytes28("0xff");  // true
isBytesBytes2fff"); // false
````

## Source

[packages/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:461](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L461)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

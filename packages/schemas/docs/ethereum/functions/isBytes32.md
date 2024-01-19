**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > isBytes32

# Function: isBytes32()

> **isBytes32**(`bytes32`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes22.

## Parameters

▪ **bytes32**: `unknown`

## Returns

## Example

```ts
import { isBytes22 } from '@tevm/schemas';
isBytes22("0xff");  // true
isBytes22("0xfff"); // false
````

## Source

[packages/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:521](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L521)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

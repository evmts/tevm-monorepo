**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > isBytes1

# Function: isBytes1()

> **isBytes1**(`bytes1`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes1.

## Parameters

▪ **bytes1**: `unknown`

## Returns

## Example

```ts
import { isBytes1 } from '@tevm/schemas';
isBytes1("0xff");  // true
isBytes1("0xfff"); // false
````

## Source

[packages/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:56](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L56)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

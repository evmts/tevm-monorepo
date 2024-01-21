**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > isBytes20

# Function: isBytes20()

> **isBytes20**(`bytes20`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes20.

## Parameters

▪ **bytes20**: `unknown`

## Returns

## Example

```ts
import { isBytes20 } from '@tevm/schemas';
isBytes20("0xff");  // true
isBytes20("0xfff"); // false
````

## Source

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:341](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L341)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

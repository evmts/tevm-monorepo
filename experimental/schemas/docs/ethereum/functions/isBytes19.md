**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > isBytes19

# Function: isBytes19()

> **isBytes19**(`bytes19`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes19.

## Parameters

▪ **bytes19**: `unknown`

## Returns

## Example

```ts
import { isBytes19 } from '@tevm/schemas';
isBytes19("0xff");  // true
isBytes19("0xfff"); // false
````

## Source

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:326](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L326)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

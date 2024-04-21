**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > isBytes17

# Function: isBytes17()

> **isBytes17**(`bytes17`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes17.

## Parameters

▪ **bytes17**: `unknown`

## Returns

## Example

```ts
import { isBytes17 } from '@tevm/schemas';
isBytes17("0xff");  // true
isBytes17("0xfff"); // false
````

## Source

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:296](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L296)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

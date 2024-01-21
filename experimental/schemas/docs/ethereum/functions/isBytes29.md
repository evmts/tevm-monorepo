**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > isBytes29

# Function: isBytes29()

> **isBytes29**(`bytes29`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes29.

## Parameters

▪ **bytes29**: `unknown`

## Returns

## Example

```ts
import { isBytes29 } from '@tevm/schemas';
isBytes29("0xff");  // true
isBytes29("0xfff"); // false
````

## Source

[packages/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:476](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L476)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

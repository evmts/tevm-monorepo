**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > isBytes23

# Function: isBytes23()

> **isBytes23**(`bytes23`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes23.

## Parameters

▪ **bytes23**: `unknown`

## Returns

## Example

```ts
import { isBytes23 } from '@tevm/schemas';
isBytes23("0xff");  // true
isBytes23("0xfff"); // false
````

## Source

[packages/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:386](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L386)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > isBytes16

# Function: isBytes16()

> **isBytes16**(`bytes16`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes16.

## Parameters

▪ **bytes16**: `unknown`

## Returns

## Example

```ts
import { isBytes16 } from '@tevm/schemas';
isBytes16("0xff");  // true
isBytes16("0xfff"); // false
````

## Source

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:281](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L281)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > isBytes2

# Function: isBytes2()

> **isBytes2**(`bytes2`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes2.

## Parameters

▪ **bytes2**: `unknown`

## Returns

## Example

```ts
import { isBytes2 } from '@tevm/schemas';
isBytes2("0xff");  // true
isBytes2("0xfff"); // false
````

## Source

[packages/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:71](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L71)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

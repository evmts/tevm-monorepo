**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > isBytes14

# Function: isBytes14()

> **isBytes14**(`bytes14`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes14.

## Parameters

▪ **bytes14**: `unknown`

## Returns

## Example

```ts
import { isBytes14 } from '@tevm/schemas';
isBytes14("0xff");  // true
isBytes14("0xfff"); // false
````

## Source

[packages/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:251](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L251)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

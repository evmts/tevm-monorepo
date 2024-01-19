**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > isBytes10

# Function: isBytes10()

> **isBytes10**(`bytes10`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes10.

## Parameters

▪ **bytes10**: `unknown`

## Returns

## Example

```ts
import { isBytes10 } from '@tevm/schemas';
isBytes10("0xff");  // true
isBytes10("0xfff"); // false
````

## Source

[packages/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:191](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L191)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > isBytes31

# Function: isBytes31()

> **isBytes31**(`bytes31`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes31.

## Parameters

▪ **bytes31**: `unknown`

## Returns

## Example

```ts
import { isBytes31 } from '@tevm/schemas';
isBytes31("0xff");  // true
isBytes31("0xfff"); // false
````

## Source

[packages/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:506](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L506)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

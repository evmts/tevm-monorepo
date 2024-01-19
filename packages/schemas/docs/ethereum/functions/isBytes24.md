**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > isBytes24

# Function: isBytes24()

> **isBytes24**(`bytes24`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes24.

## Parameters

▪ **bytes24**: `unknown`

## Returns

## Example

```ts
import { isBytes24 } from '@tevm/schemas';
isBytes24("0xff");  // true
isBytes24("0xfff"); // false
````

## Source

[packages/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:401](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L401)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

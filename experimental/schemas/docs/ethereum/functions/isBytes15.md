**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [ethereum](../README.md) / isBytes15

# Function: isBytes15()

> **isBytes15**(`bytes15`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes15.

## Parameters

• **bytes15**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isBytes15 } from '@tevm/schemas';
isBytes15("0xff");  // true
isBytes15("0xfff"); // false
````

## Source

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:266](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L266)

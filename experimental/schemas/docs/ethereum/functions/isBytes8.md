**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [ethereum](../README.md) / isBytes8

# Function: isBytes8()

> **isBytes8**(`bytes8`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes8.

## Parameters

• **bytes8**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isBytes8 } from '@tevm/schemas';
isBytes8("0xff");  // true
isBytes8("0xfff"); // false
````

## Source

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:161](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L161)

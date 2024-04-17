**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [ethereum](../README.md) / isBytes3

# Function: isBytes3()

> **isBytes3**(`bytes3`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes3.

## Parameters

• **bytes3**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isBytes3 } from '@tevm/schemas';
isBytes3("0xff");  // true
isBytes3("0xfff"); // false
````

## Source

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:86](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L86)

**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [ethereum](../README.md) / isBytes19

# Function: isBytes19()

> **isBytes19**(`bytes19`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes19.

## Parameters

• **bytes19**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isBytes19 } from '@tevm/schemas';
isBytes19("0xff");  // true
isBytes19("0xfff"); // false
````

## Source

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:326](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L326)

**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [ethereum](../README.md) / isBytes30

# Function: isBytes30()

> **isBytes30**(`bytes30`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes30.

## Parameters

• **bytes30**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isBytes30 } from '@tevm/schemas';
isBytes30("0xff");  // true
isBytes30("0xfff"); // false
````

## Source

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:491](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L491)

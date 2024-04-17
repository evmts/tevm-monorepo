**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [ethereum](../README.md) / isBytes25

# Function: isBytes25()

> **isBytes25**(`bytes25`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes25.

## Parameters

• **bytes25**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isBytes25 } from '@tevm/schemas';
isBytes25("0xff");  // true
isBytes25("0xfff"); // false
````

## Source

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:416](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L416)

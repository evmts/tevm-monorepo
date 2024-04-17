**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [ethereum](../README.md) / isBytes5

# Function: isBytes5()

> **isBytes5**(`bytes5`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes5.

## Parameters

• **bytes5**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isBytes5 } from '@tevm/schemas';
isBytes5("0xff");  // true
isBytes5("0xfff"); // false
````

## Source

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:116](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L116)

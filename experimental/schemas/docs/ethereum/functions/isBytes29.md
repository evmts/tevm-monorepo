**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [ethereum](../README.md) / isBytes29

# Function: isBytes29()

> **isBytes29**(`bytes29`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes29.

## Parameters

• **bytes29**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isBytes29 } from '@tevm/schemas';
isBytes29("0xff");  // true
isBytes29("0xfff"); // false
````

## Source

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:476](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L476)

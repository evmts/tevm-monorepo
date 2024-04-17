**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [ethereum](../README.md) / isBytes24

# Function: isBytes24()

> **isBytes24**(`bytes24`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes24.

## Parameters

• **bytes24**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isBytes24 } from '@tevm/schemas';
isBytes24("0xff");  // true
isBytes24("0xfff"); // false
````

## Source

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:401](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L401)

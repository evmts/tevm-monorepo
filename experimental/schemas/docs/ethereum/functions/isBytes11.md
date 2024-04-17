**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [ethereum](../README.md) / isBytes11

# Function: isBytes11()

> **isBytes11**(`bytes11`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes11.

## Parameters

• **bytes11**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isBytes11 } from '@tevm/schemas';
isBytes11("0xff");  // true
isBytes11("0xfff"); // false
````

## Source

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:206](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L206)

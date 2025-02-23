[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / isBytes4

# Function: isBytes4()

> **isBytes4**(`bytes4`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes4.

## Parameters

• **bytes4**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isBytes4 } from '@tevm/schemas';
isBytes4("0xff");  // true
isBytes4("0xfff"); // false
````

## Defined in

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:101](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L101)

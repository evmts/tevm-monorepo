[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / isBytes2

# Function: isBytes2()

> **isBytes2**(`bytes2`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes2.

## Parameters

• **bytes2**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isBytes2 } from '@tevm/schemas';
isBytes2("0xff");  // true
isBytes2("0xfff"); // false
````

## Source

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:71](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L71)

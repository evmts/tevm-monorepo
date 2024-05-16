[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / isBytes27

# Function: isBytes27()

> **isBytes27**(`bytes27`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes27.

## Parameters

• **bytes27**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isBytes27 } from '@tevm/schemas';
isBytes27("0xff");  // true
isBytes27("0xfff"); // false
````

## Source

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:446](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L446)

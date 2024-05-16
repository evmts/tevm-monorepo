[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / isBytes1

# Function: isBytes1()

> **isBytes1**(`bytes1`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes1.

## Parameters

• **bytes1**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isBytes1 } from '@tevm/schemas';
isBytes1("0xff");  // true
isBytes1("0xfff"); // false
````

## Source

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:56](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L56)

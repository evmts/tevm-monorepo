[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / isBytes7

# Function: isBytes7()

> **isBytes7**(`bytes7`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes7.

## Parameters

• **bytes7**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isBytes7 } from '@tevm/schemas';
isBytes7("0xff");  // true
isBytes7("0xfff"); // false
````

## Source

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:146](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L146)

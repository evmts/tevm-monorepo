[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / isBytes21

# Function: isBytes21()

> **isBytes21**(`bytes21`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes21.

## Parameters

• **bytes21**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isBytes21 } from '@tevm/schemas';
isBytes21("0xff");  // true
isBytes21("0xfff"); // false
````

## Defined in

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:356](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L356)

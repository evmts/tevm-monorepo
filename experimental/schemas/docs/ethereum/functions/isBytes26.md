[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / isBytes26

# Function: isBytes26()

> **isBytes26**(`bytes26`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes26.

## Parameters

• **bytes26**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isBytes26 } from '@tevm/schemas';
isBytes26("0xff");  // true
isBytes26("0xfff"); // false
````

## Defined in

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:431](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L431)

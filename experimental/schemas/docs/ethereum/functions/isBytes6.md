[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / isBytes6

# Function: isBytes6()

> **isBytes6**(`bytes6`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes6.

## Parameters

• **bytes6**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isBytes6 } from '@tevm/schemas';
isBytes6("0xff");  // true
isBytes6("0xfff"); // false
````

## Defined in

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:131](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L131)

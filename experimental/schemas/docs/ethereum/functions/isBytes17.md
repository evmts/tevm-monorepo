[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / isBytes17

# Function: isBytes17()

> **isBytes17**(`bytes17`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes17.

## Parameters

• **bytes17**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isBytes17 } from '@tevm/schemas';
isBytes17("0xff");  // true
isBytes17("0xfff"); // false
````

## Defined in

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:296](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L296)

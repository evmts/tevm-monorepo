[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / isBytes14

# Function: isBytes14()

> **isBytes14**(`bytes14`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes14.

## Parameters

• **bytes14**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isBytes14 } from '@tevm/schemas';
isBytes14("0xff");  // true
isBytes14("0xfff"); // false
````

## Defined in

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:251](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L251)

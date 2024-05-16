[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / isBytes23

# Function: isBytes23()

> **isBytes23**(`bytes23`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes23.

## Parameters

• **bytes23**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isBytes23 } from '@tevm/schemas';
isBytes23("0xff");  // true
isBytes23("0xfff"); // false
````

## Source

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:386](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L386)

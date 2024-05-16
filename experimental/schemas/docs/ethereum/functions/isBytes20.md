[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / isBytes20

# Function: isBytes20()

> **isBytes20**(`bytes20`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes20.

## Parameters

• **bytes20**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isBytes20 } from '@tevm/schemas';
isBytes20("0xff");  // true
isBytes20("0xfff"); // false
````

## Source

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:341](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L341)

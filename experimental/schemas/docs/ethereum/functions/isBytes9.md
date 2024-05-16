[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / isBytes9

# Function: isBytes9()

> **isBytes9**(`bytes9`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes9.

## Parameters

• **bytes9**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isBytes9 } from '@tevm/schemas';
isBytes9("0xff");  // true
isBytes9("0xfff"); // false
````

## Source

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:176](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L176)

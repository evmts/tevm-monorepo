[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / isBytes16

# Function: isBytes16()

> **isBytes16**(`bytes16`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes16.

## Parameters

• **bytes16**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isBytes16 } from '@tevm/schemas';
isBytes16("0xff");  // true
isBytes16("0xfff"); // false
````

## Defined in

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:281](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L281)

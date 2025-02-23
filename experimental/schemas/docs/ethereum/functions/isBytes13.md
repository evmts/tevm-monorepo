[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / isBytes13

# Function: isBytes13()

> **isBytes13**(`bytes13`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes13.

## Parameters

• **bytes13**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isBytes13 } from '@tevm/schemas';
isBytes13("0xff");  // true
isBytes13("0xfff"); // false
````

## Defined in

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:236](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L236)

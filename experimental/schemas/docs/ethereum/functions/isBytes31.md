[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / isBytes31

# Function: isBytes31()

> **isBytes31**(`bytes31`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes31.

## Parameters

• **bytes31**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isBytes31 } from '@tevm/schemas';
isBytes31("0xff");  // true
isBytes31("0xfff"); // false
````

## Source

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:506](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L506)

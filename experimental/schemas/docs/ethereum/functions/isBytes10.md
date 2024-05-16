[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / isBytes10

# Function: isBytes10()

> **isBytes10**(`bytes10`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes10.

## Parameters

• **bytes10**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isBytes10 } from '@tevm/schemas';
isBytes10("0xff");  // true
isBytes10("0xfff"); // false
````

## Source

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:191](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L191)

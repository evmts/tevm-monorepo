[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / isBytes28

# Function: isBytes28()

> **isBytes28**(`bytes28`): `boolean`

Type guard that returns true if the provided string is a valid Ethereum Bytes28.

## Parameters

• **bytes28**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isBytes28 } from '@tevm/schemas';
isBytes28("0xff");  // true
isBytesBytes2fff"); // false
````

## Source

[experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js:461](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/isBytesFixed.js#L461)

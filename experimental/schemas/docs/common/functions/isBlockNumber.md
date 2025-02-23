[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [common](../README.md) / isBlockNumber

# Function: isBlockNumber()

> **isBlockNumber**(`blockNumber`): `boolean`

Type guard that returns true if the provided number is a valid Ethereum block number.

## Parameters

• **blockNumber**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isBlockNumber } from '@tevm/schemas';
isBlockNumber('0x1234567890abcdef1234567890abcdef12345678');  // true
isBlockNumber('not a blockNumber'); // false
````

## Defined in

[experimental/schemas/src/common/SBlockNumber.js:46](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/common/SBlockNumber.js#L46)

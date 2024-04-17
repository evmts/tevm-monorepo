**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [ethereum](../README.md) / isINT64

# Function: isINT64()

> **isINT64**(`int64`): `boolean`

Type guard that returns true if the provided bigint is a valid Ethereum INT64.

## Parameters

• **int64**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isINT64 } from '@tevm/schemas';
isINT64(BigInt("-9223372036854775808"));  // true
isINT64(BigInt("9223372036854775807"));   // true
isINT64(BigInt("9223372036854775808"));   // false
isINT64(BigInt("-9223372036854775809"));  // false
````

## Source

[experimental/schemas/src/ethereum/SINT/isINT.js:75](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SINT/isINT.js#L75)

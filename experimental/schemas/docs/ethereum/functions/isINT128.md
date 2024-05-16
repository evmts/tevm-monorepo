[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / isINT128

# Function: isINT128()

> **isINT128**(`int128`): `boolean`

Type guard that returns true if the provided bigint is a valid Ethereum INT128.

## Parameters

• **int128**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isINT128 } from '@tevm/schemas';
isINT128(BigInt("-170141183460469231731687303715884105728"));  // true
isINT128(BigInt("170141183460469231731687303715884105727"));   // true
isINT128(BigInt("170141183460469231731687303715884105728"));   // false
isINT128(BigInt("-170141183460469231731687303715884105729"));  // false
````

## Source

[experimental/schemas/src/ethereum/SINT/isINT.js:92](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SINT/isINT.js#L92)

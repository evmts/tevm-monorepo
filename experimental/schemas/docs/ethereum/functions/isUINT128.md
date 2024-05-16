[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / isUINT128

# Function: isUINT128()

> **isUINT128**(`uint128`): `boolean`

Type guard that returns true if the provided bigint is a valid Ethereum UINT128.

## Parameters

• **uint128**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isUINT128 } from '@tevm/schemas';
isUINT128(BigInt("170141183460469231731687303715884105727"));  // true
isUINT128(BigInt("340282366920938463463374607431768211456"));  // false
````

## Source

[experimental/schemas/src/ethereum/SUINT/isUINT.js:78](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SUINT/isUINT.js#L78)

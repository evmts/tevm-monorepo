**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [ethereum](../README.md) / isUINT64

# Function: isUINT64()

> **isUINT64**(`uint64`): `boolean`

Type guard that returns true if the provided bigint is a valid Ethereum UINT64.

## Parameters

• **uint64**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isUINT64 } from '@tevm/schemas';
isUINT64(BigInt("9223372036854775807"));  // true
isUINT64(BigInt("18446744073709551616"));  // false
````

## Source

[experimental/schemas/src/ethereum/SUINT/isUINT.js:71](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SUINT/isUINT.js#L71)

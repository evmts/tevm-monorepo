**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [ethereum](../README.md) / isUINT16

# Function: isUINT16()

> **isUINT16**(`uint16`): `boolean`

Type guard that returns true if the provided bigint is a valid Ethereum UINT16.

## Parameters

• **uint16**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isUINT16 } from '@tevm/schemas';
isUINT16(BigInt(32767));  // true
isUINT16(BigInt(65536));  // false
````

## Source

[experimental/schemas/src/ethereum/SUINT/isUINT.js:43](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SUINT/isUINT.js#L43)

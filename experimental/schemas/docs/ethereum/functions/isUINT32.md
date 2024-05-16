[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / isUINT32

# Function: isUINT32()

> **isUINT32**(`uint32`): `boolean`

Type guard that returns true if the provided bigint is a valid Ethereum UINT32.

## Parameters

• **uint32**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isUINT32 } from '@tevm/schemas';
isUINT32(BigInt(2147483647));  // true
isUINT32(BigInt(4294967296));  // false
````

## Source

[experimental/schemas/src/ethereum/SUINT/isUINT.js:50](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SUINT/isUINT.js#L50)

[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / isUINT8

# Function: isUINT8()

> **isUINT8**(`uint8`): `boolean`

Type guard that returns true if the provided bigint is a valid Ethereum UINT8.

## Parameters

• **uint8**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isUINT8 } from '@tevm/schemas';
isUINT8(BigInt(127));  // true
isUINT8(BigInt(256));  // false
````

## Defined in

[experimental/schemas/src/ethereum/SUINT/isUINT.js:22](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SUINT/isUINT.js#L22)

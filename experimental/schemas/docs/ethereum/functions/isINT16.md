[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / isINT16

# Function: isINT16()

> **isINT16**(`int16`): `boolean`

Type guard that returns true if the provided bigint is a valid Ethereum INT16.

## Parameters

• **int16**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isINT16 } from '@tevm/schemas';
isINT16(BigInt(-32768));  // true
isINT16(BigInt(32767));   // true
isINT16(BigInt(32768));   // false
isINT16(BigInt(-32769));  // false
````

## Defined in

[experimental/schemas/src/ethereum/SINT/isINT.js:41](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SINT/isINT.js#L41)

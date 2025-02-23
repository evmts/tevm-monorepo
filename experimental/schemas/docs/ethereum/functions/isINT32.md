[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / isINT32

# Function: isINT32()

> **isINT32**(`int32`): `boolean`

Type guard that returns true if the provided bigint is a valid Ethereum INT32.

## Parameters

• **int32**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isINT32 } from '@tevm/schemas';
isINT32(BigInt(-2147483648));  // true
isINT32(BigInt(2147483647));   // true
isINT32(BigInt(2147483648));   // false
isINT32(BigInt(-2147483649));  // false
````

## Defined in

[experimental/schemas/src/ethereum/SINT/isINT.js:58](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SINT/isINT.js#L58)

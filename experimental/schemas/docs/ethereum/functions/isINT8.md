[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / isINT8

# Function: isINT8()

> **isINT8**(`int8`): `boolean`

Type guard that returns true if the provided bigint is a valid Ethereum INT8.

## Parameters

• **int8**: `unknown`

## Returns

`boolean`

## Example

```ts
import { isINT8 } from '@tevm/schemas';
isINT8(BigInt(-128));  // true
isINT8(BigInt(127));   // true
isINT8(BigInt(128));   // false
isINT8(BigInt(-129));  // false
````

## Source

[experimental/schemas/src/ethereum/SINT/isINT.js:24](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SINT/isINT.js#L24)

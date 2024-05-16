[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / parseInt32

# Function: parseInt32()

> **parseInt32**\<`TINT32`\>(`int32`): `TINT32`

Parses an INT32 and returns the value if no errors.

## Type parameters

• **TINT32** *extends* `bigint`

## Parameters

• **int32**: `TINT32`

## Returns

`TINT32`

## Example

```ts
import { parseInt32 } from '@tevm/schemas';
const parsedINT32 = parseInt32(BigInt(-2147483648));
```

## Source

[experimental/schemas/src/ethereum/SINT/parseINT.js:58](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SINT/parseINT.js#L58)

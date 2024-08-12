[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / parseInt64

# Function: parseInt64()

> **parseInt64**\<`TINT64`\>(`int64`): `TINT64`

Parses an INT64 and returns the value if no errors.

## Type Parameters

• **TINT64** *extends* `bigint`

## Parameters

• **int64**: `TINT64`

## Returns

`TINT64`

## Example

```ts
import { parseInt64 } from '@tevm/schemas';
const parsedINT64 = parseInt64(BigInt("-9223372036854775808"));
```

## Defined in

[experimental/schemas/src/ethereum/SINT/parseINT.js:73](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SINT/parseINT.js#L73)

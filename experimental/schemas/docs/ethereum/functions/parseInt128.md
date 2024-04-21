**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > parseInt128

# Function: parseInt128()

> **parseInt128**\<`TINT128`\>(`int128`): `TINT128`

Parses an INT128 and returns the value if no errors.

## Type parameters

▪ **TINT128** extends `bigint`

## Parameters

▪ **int128**: `TINT128`

## Returns

## Example

```ts
import { parseInt128 } from '@tevm/schemas';
const parsedINT128 = parseInt128(BigInt("-170141183460469231731687303715884105728"));
```

## Source

[experimental/schemas/src/ethereum/SINT/parseINT.js:88](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SINT/parseINT.js#L88)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

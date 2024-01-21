**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > parseInt64

# Function: parseInt64()

> **parseInt64**\<`TINT64`\>(`int64`): `TINT64`

Parses an INT64 and returns the value if no errors.

## Type parameters

▪ **TINT64** extends `bigint`

## Parameters

▪ **int64**: `TINT64`

## Returns

## Example

```ts
import { parseInt64 } from '@tevm/schemas';
const parsedINT64 = parseInt64(BigInt("-9223372036854775808"));
```

## Source

[packages/schemas/src/ethereum/SINT/parseINT.js:73](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SINT/parseINT.js#L73)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

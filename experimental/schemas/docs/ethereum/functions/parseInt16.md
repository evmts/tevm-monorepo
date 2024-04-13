**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > parseInt16

# Function: parseInt16()

> **parseInt16**\<`TINT16`\>(`int16`): `TINT16`

Parses an INT16 and returns the value if no errors.

## Type parameters

▪ **TINT16** extends `bigint`

## Parameters

▪ **int16**: `TINT16`

## Returns

## Example

```ts
import { parseInt16 } from '@tevm/schemas';
const parsedINT16 = parseInt16(BigInt(-32768));
```

## Source

[experimental/schemas/src/ethereum/SINT/parseINT.js:43](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SINT/parseINT.js#L43)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

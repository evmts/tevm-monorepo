**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > parseUINT16

# Function: parseUINT16()

> **parseUINT16**\<`TUINT16`\>(`uint16`): `TUINT16`

Parses a UINT16 and returns the value if no errors.

## Type parameters

▪ **TUINT16** extends `bigint`

## Parameters

▪ **uint16**: `TUINT16`

## Returns

## Example

```ts
import { parseUINT16 } from '@tevm/schemas';
const parsedUINT16 = parseUINT16(BigInt(32767));
```

## Source

[packages/schemas/src/ethereum/SUINT/parseUINT.js:42](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SUINT/parseUINT.js#L42)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

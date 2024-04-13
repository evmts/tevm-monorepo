**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > parseUINT8

# Function: parseUINT8()

> **parseUINT8**\<`TUINT8`\>(`uint8`): `TUINT8`

Parses a UINT8 and returns the value if no errors.

## Type parameters

▪ **TUINT8** extends `bigint`

## Parameters

▪ **uint8**: `TUINT8`

## Returns

## Example

```ts
import { parseUINT8 } from '@tevm/schemas';
const parsedUINT8 = parseUINT8(BigInt(127));
```

## Source

[experimental/schemas/src/ethereum/SUINT/parseUINT.js:28](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SUINT/parseUINT.js#L28)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

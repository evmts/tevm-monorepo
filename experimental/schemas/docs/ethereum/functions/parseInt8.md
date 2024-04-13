**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > parseInt8

# Function: parseInt8()

> **parseInt8**\<`TINT8`\>(`int8`): `TINT8`

Parses an INT8 and returns the value if no errors.

## Type parameters

▪ **TINT8** extends `bigint`

extends INT8

## Parameters

▪ **int8**: `TINT8`

## Returns

## Example

```ts
import { parseInt8 } from '@tevm/schemas';
const parsedINT8 = parseInt8(BigInt(-128));
```

## Source

[experimental/schemas/src/ethereum/SINT/parseINT.js:28](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SINT/parseINT.js#L28)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > parseInt256

# Function: parseInt256()

> **parseInt256**\<`TINT256`\>(`int256`): `TINT256`

Parses an INT256 and returns the value if no errors.

## Type parameters

▪ **TINT256** extends `bigint`

## Parameters

▪ **int256**: `TINT256`

## Returns

## Example

```ts
import { parseInt256 } from '@tevm/schemas';
const parsedINT256 = parseInt256(420n);
```

## Source

[packages/schemas/src/ethereum/SINT/parseINT.js:103](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/ethereum/SINT/parseINT.js#L103)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

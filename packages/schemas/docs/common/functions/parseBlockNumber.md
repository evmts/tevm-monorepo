**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [common](../README.md) > parseBlockNumber

# Function: parseBlockNumber()

> **parseBlockNumber**\<`TBlockNumber`\>(`blockNumber`): `TBlockNumber`

Parses a BlockNumber and returns the value if no errors.

## Type parameters

▪ **TBlockNumber** extends `number`

## Parameters

▪ **blockNumber**: `TBlockNumber`

## Returns

## Example

```ts
import { parseBlockNumber } from '@tevm/schemas';
const parsedBlockNumber = parseBlockNumber('0x1234567890abcdef1234567890abcdef12345678');
```

## Source

[packages/schemas/src/common/SBlockNumber.js:109](https://github.com/evmts/tevm-monorepo/blob/main/packages/schemas/src/common/SBlockNumber.js#L109)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

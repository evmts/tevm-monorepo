**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [common](../README.md) > parseBlockNumberSafe

# Function: parseBlockNumberSafe()

> **parseBlockNumberSafe**\<`TBlockNumber`\>(`blockNumber`): `Effect`\<`never`, [`InvalidBlockNumberError`](../classes/InvalidBlockNumberError.md), `TBlockNumber`\>

Safely parses a BlockNumber into an [Effect](https://www.effect.website/docs/essentials/effect-type).

## Type parameters

▪ **TBlockNumber** extends `number`

## Parameters

▪ **blockNumber**: `TBlockNumber`

## Returns

## Example

```ts
import { parseBlockNumberSafe } from '@tevm/schemas';
const parsedBlockNumberEffect = parseBlockNumberSafe('0x1234567890abcdef1234567890abcdef12345678');
```

## Source

[experimental/schemas/src/common/SBlockNumber.js:84](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/common/SBlockNumber.js#L84)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

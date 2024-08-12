[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [common](../README.md) / parseBlockNumberSafe

# Function: parseBlockNumberSafe()

> **parseBlockNumberSafe**\<`TBlockNumber`\>(`blockNumber`): `Effect`\<`never`, [`InvalidBlockNumberError`](../classes/InvalidBlockNumberError.md), `TBlockNumber`\>

Safely parses a BlockNumber into an [Effect](https://www.effect.website/docs/essentials/effect-type).

## Type Parameters

• **TBlockNumber** *extends* `number`

## Parameters

• **blockNumber**: `TBlockNumber`

## Returns

`Effect`\<`never`, [`InvalidBlockNumberError`](../classes/InvalidBlockNumberError.md), `TBlockNumber`\>

## Example

```ts
import { parseBlockNumberSafe } from '@tevm/schemas';
const parsedBlockNumberEffect = parseBlockNumberSafe('0x1234567890abcdef1234567890abcdef12345678');
```

## Defined in

[experimental/schemas/src/common/SBlockNumber.js:84](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/common/SBlockNumber.js#L84)

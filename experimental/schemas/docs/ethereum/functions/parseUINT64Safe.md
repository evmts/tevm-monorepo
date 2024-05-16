[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / parseUINT64Safe

# Function: parseUINT64Safe()

> **parseUINT64Safe**\<`TUINT64`\>(`uint64`): `Effect`\<`never`, [`InvalidUINTError`](../classes/InvalidUINTError.md), `TUINT64`\>

Safely parses a UINT64 into an [Effect](https://www.effect.website/docs/essentials/effect-type).

## Type parameters

• **TUINT64** *extends* `bigint`

## Parameters

• **uint64**: `TUINT64`

## Returns

`Effect`\<`never`, [`InvalidUINTError`](../classes/InvalidUINTError.md), `TUINT64`\>

## Source

[experimental/schemas/src/ethereum/SUINT/parseUINTSafe.js:90](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SUINT/parseUINTSafe.js#L90)

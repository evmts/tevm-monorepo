[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / parseUINT128Safe

# Function: parseUINT128Safe()

> **parseUINT128Safe**\<`TUINT128`\>(`uint128`): `Effect`\<`never`, [`InvalidUINTError`](../classes/InvalidUINTError.md), `TUINT128`\>

Safely parses a UINT128 into an [Effect](https://www.effect.website/docs/essentials/effect-type).

## Type parameters

• **TUINT128** *extends* `bigint`

## Parameters

• **uint128**: `TUINT128`

## Returns

`Effect`\<`never`, [`InvalidUINTError`](../classes/InvalidUINTError.md), `TUINT128`\>

## Source

[experimental/schemas/src/ethereum/SUINT/parseUINTSafe.js:113](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SUINT/parseUINTSafe.js#L113)

[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / parseINT64Safe

# Function: parseINT64Safe()

> **parseINT64Safe**\<`TINT64`\>(`int64`): `Effect`\<`never`, [`InvalidINTError`](../classes/InvalidINTError.md), `TINT64`\>

Safely parses an INT64 into an [Effect](https://www.effect.website/docs/essentials/effect-type).

## Type parameters

• **TINT64**

extends bigint

## Parameters

• **int64**: `TINT64`

## Returns

`Effect`\<`never`, [`InvalidINTError`](../classes/InvalidINTError.md), `TINT64`\>

## Source

[experimental/schemas/src/ethereum/SINT/parseINTSafe.js:91](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SINT/parseINTSafe.js#L91)

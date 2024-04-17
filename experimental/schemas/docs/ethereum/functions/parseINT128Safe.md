**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [ethereum](../README.md) / parseINT128Safe

# Function: parseINT128Safe()

> **parseINT128Safe**\<`TINT128`\>(`int128`): `Effect`\<`never`, [`InvalidINTError`](../classes/InvalidINTError.md), `TINT128`\>

Safely parses an INT128 into an [Effect](https://www.effect.website/docs/essentials/effect-type).

## Type parameters

• **TINT128**

extends bigint

## Parameters

• **int128**: `TINT128`

## Returns

`Effect`\<`never`, [`InvalidINTError`](../classes/InvalidINTError.md), `TINT128`\>

## Source

[experimental/schemas/src/ethereum/SINT/parseINTSafe.js:115](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SINT/parseINTSafe.js#L115)

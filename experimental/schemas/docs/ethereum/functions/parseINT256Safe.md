[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / parseINT256Safe

# Function: parseINT256Safe()

> **parseINT256Safe**\<`TINT256`\>(`int256`): `Effect`\<`never`, [`InvalidINTError`](../classes/InvalidINTError.md), `TINT256`\>

Safely parses an INT256 into an [Effect](https://www.effect.website/docs/essentials/effect-type).

## Type Parameters

• **TINT256**

extends bigint

## Parameters

• **int256**: `TINT256`

## Returns

`Effect`\<`never`, [`InvalidINTError`](../classes/InvalidINTError.md), `TINT256`\>

## Defined in

[experimental/schemas/src/ethereum/SINT/parseINTSafe.js:139](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SINT/parseINTSafe.js#L139)

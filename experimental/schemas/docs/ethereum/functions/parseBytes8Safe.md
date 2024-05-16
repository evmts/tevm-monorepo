[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / parseBytes8Safe

# Function: parseBytes8Safe()

> **parseBytes8Safe**\<`TBytes8`\>(`bytes8`): `Effect`\<`never`, [`InvalidBytesFixedError`](../classes/InvalidBytesFixedError.md), `TBytes8`\>

Safely parses a Bytes8 into an [Effect](https://www.effect.website/docs/essentials/effect-type).

## Type parameters

• **TBytes8**

extends string

## Parameters

• **bytes8**: `TBytes8`

## Returns

`Effect`\<`never`, [`InvalidBytesFixedError`](../classes/InvalidBytesFixedError.md), `TBytes8`\>

## Source

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixedSafe.js:220](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixedSafe.js#L220)

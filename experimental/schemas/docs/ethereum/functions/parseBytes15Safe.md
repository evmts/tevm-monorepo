**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [ethereum](../README.md) / parseBytes15Safe

# Function: parseBytes15Safe()

> **parseBytes15Safe**\<`TBytes15`\>(`bytes15`): `Effect`\<`never`, [`InvalidBytesFixedError`](../classes/InvalidBytesFixedError.md), `TBytes15`\>

Safely parses a Bytes15 into an [Effect](https://www.effect.website/docs/essentials/effect-type).

## Type parameters

• **TBytes15**

extends string

## Parameters

• **bytes15**: `TBytes15`

## Returns

`Effect`\<`never`, [`InvalidBytesFixedError`](../classes/InvalidBytesFixedError.md), `TBytes15`\>

## Source

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixedSafe.js:388](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixedSafe.js#L388)

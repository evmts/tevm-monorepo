**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [ethereum](../README.md) / parseBytes9Safe

# Function: parseBytes9Safe()

> **parseBytes9Safe**\<`TBytes9`\>(`bytes9`): `Effect`\<`never`, [`InvalidBytesFixedError`](../classes/InvalidBytesFixedError.md), `TBytes9`\>

Safely parses a Bytes9 into an [Effect](https://www.effect.website/docs/essentials/effect-type).

## Type parameters

• **TBytes9**

extends string

## Parameters

• **bytes9**: `TBytes9`

## Returns

`Effect`\<`never`, [`InvalidBytesFixedError`](../classes/InvalidBytesFixedError.md), `TBytes9`\>

## Source

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixedSafe.js:244](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixedSafe.js#L244)

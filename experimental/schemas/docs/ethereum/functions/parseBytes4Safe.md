**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [ethereum](../README.md) / parseBytes4Safe

# Function: parseBytes4Safe()

> **parseBytes4Safe**\<`TBytes4`\>(`bytes4`): `Effect`\<`never`, [`InvalidBytesFixedError`](../classes/InvalidBytesFixedError.md), `TBytes4`\>

Safely parses a Bytes4 into an [Effect](https://www.effect.website/docs/essentials/effect-type).

## Type parameters

• **TBytes4**

extends string

## Parameters

• **bytes4**: `TBytes4`

## Returns

`Effect`\<`never`, [`InvalidBytesFixedError`](../classes/InvalidBytesFixedError.md), `TBytes4`\>

## Source

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixedSafe.js:124](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixedSafe.js#L124)

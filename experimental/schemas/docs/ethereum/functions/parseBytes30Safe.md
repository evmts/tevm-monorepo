**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [ethereum](../README.md) / parseBytes30Safe

# Function: parseBytes30Safe()

> **parseBytes30Safe**\<`TBytes30`\>(`bytes30`): `Effect`\<`never`, [`InvalidBytesFixedError`](../classes/InvalidBytesFixedError.md), `TBytes30`\>

Safely parses a Bytes30 into an [Effect](https://www.effect.website/docs/essentials/effect-type).

## Type parameters

• **TBytes30**

extends string

## Parameters

• **bytes30**: `TBytes30`

## Returns

`Effect`\<`never`, [`InvalidBytesFixedError`](../classes/InvalidBytesFixedError.md), `TBytes30`\>

## Source

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixedSafe.js:748](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixedSafe.js#L748)

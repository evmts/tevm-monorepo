**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [ethereum](../README.md) / parseBytes10Safe

# Function: parseBytes10Safe()

> **parseBytes10Safe**\<`TBytes10`\>(`bytes10`): `Effect`\<`never`, [`InvalidBytesFixedError`](../classes/InvalidBytesFixedError.md), `TBytes10`\>

Safely parses a Bytes10 into an [Effect](https://www.effect.website/docs/essentials/effect-type).

## Type parameters

• **TBytes10**

extends string

## Parameters

• **bytes10**: `TBytes10`

## Returns

`Effect`\<`never`, [`InvalidBytesFixedError`](../classes/InvalidBytesFixedError.md), `TBytes10`\>

## Source

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixedSafe.js:268](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixedSafe.js#L268)

**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [ethereum](../README.md) / parseBytes2Safe

# Function: parseBytes2Safe()

> **parseBytes2Safe**\<`TBytes2`\>(`bytes2`): `Effect`\<`never`, [`InvalidBytesFixedError`](../classes/InvalidBytesFixedError.md), `TBytes2`\>

Safely parses a Bytes2 into an [Effect](https://www.effect.website/docs/essentials/effect-type).

## Type parameters

• **TBytes2**

extends string

## Parameters

• **bytes2**: `TBytes2`

## Returns

`Effect`\<`never`, [`InvalidBytesFixedError`](../classes/InvalidBytesFixedError.md), `TBytes2`\>

## Source

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixedSafe.js:76](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixedSafe.js#L76)

**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [ethereum](../README.md) / parseBytes31Safe

# Function: parseBytes31Safe()

> **parseBytes31Safe**\<`TBytes31`\>(`bytes31`): `Effect`\<`never`, [`InvalidBytesFixedError`](../classes/InvalidBytesFixedError.md), `TBytes31`\>

Safely parses a Bytes31 into an [Effect](https://www.effect.website/docs/essentials/effect-type).

## Type parameters

• **TBytes31**

extends string

## Parameters

• **bytes31**: `TBytes31`

## Returns

`Effect`\<`never`, [`InvalidBytesFixedError`](../classes/InvalidBytesFixedError.md), `TBytes31`\>

## Source

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixedSafe.js:772](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixedSafe.js#L772)

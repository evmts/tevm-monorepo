**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [ethereum](../README.md) / parseBytes23Safe

# Function: parseBytes23Safe()

> **parseBytes23Safe**\<`TBytes23`\>(`bytes23`): `Effect`\<`never`, [`InvalidBytesFixedError`](../classes/InvalidBytesFixedError.md), `TBytes23`\>

Safely parses a Bytes23 into an [Effect](https://www.effect.website/docs/essentials/effect-type).

## Type parameters

• **TBytes23**

extends string

## Parameters

• **bytes23**: `TBytes23`

## Returns

`Effect`\<`never`, [`InvalidBytesFixedError`](../classes/InvalidBytesFixedError.md), `TBytes23`\>

## Source

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixedSafe.js:580](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixedSafe.js#L580)

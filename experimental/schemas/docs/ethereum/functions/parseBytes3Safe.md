[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / parseBytes3Safe

# Function: parseBytes3Safe()

> **parseBytes3Safe**\<`TBytes3`\>(`bytes3`): `Effect`\<`never`, [`InvalidBytesFixedError`](../classes/InvalidBytesFixedError.md), `TBytes3`\>

Safely parses a Bytes3 into an [Effect](https://www.effect.website/docs/essentials/effect-type).

## Type parameters

• **TBytes3**

extends string

## Parameters

• **bytes3**: `TBytes3`

## Returns

`Effect`\<`never`, [`InvalidBytesFixedError`](../classes/InvalidBytesFixedError.md), `TBytes3`\>

## Source

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixedSafe.js:100](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixedSafe.js#L100)

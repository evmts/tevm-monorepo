[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / parseBytes1Safe

# Function: parseBytes1Safe()

> **parseBytes1Safe**\<`TBytes1`\>(`bytes1`): `Effect`\<`never`, [`InvalidBytesFixedError`](../classes/InvalidBytesFixedError.md), `TBytes1`\>

Safely parses a Bytes1 into an [Effect](https://www.effect.website/docs/essentials/effect-type).

## Type parameters

• **TBytes1**

extends string

## Parameters

• **bytes1**: `TBytes1`

## Returns

`Effect`\<`never`, [`InvalidBytesFixedError`](../classes/InvalidBytesFixedError.md), `TBytes1`\>

## Source

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixedSafe.js:52](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixedSafe.js#L52)

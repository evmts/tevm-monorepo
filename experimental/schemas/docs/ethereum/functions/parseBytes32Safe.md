[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / parseBytes32Safe

# Function: parseBytes32Safe()

> **parseBytes32Safe**\<`TBytes32`\>(`bytes32`): `Effect`\<`never`, [`InvalidBytesFixedError`](../classes/InvalidBytesFixedError.md), `TBytes32`\>

Safely parses a Bytes32 into an [Effect](https://www.effect.website/docs/essentials/effect-type).

## Type Parameters

• **TBytes32**

extends string

## Parameters

• **bytes32**: `TBytes32`

## Returns

`Effect`\<`never`, [`InvalidBytesFixedError`](../classes/InvalidBytesFixedError.md), `TBytes32`\>

## Defined in

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixedSafe.js:796](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixedSafe.js#L796)

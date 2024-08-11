[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / parseBytes20Safe

# Function: parseBytes20Safe()

> **parseBytes20Safe**\<`TBytes20`\>(`bytes20`): `Effect`\<`never`, [`InvalidBytesFixedError`](../classes/InvalidBytesFixedError.md), `TBytes20`\>

Safely parses a Bytes20 into an [Effect](https://www.effect.website/docs/essentials/effect-type).

## Type Parameters

• **TBytes20**

extends string

## Parameters

• **bytes20**: `TBytes20`

## Returns

`Effect`\<`never`, [`InvalidBytesFixedError`](../classes/InvalidBytesFixedError.md), `TBytes20`\>

## Defined in

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixedSafe.js:508](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixedSafe.js#L508)

[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / parseBytes18Safe

# Function: parseBytes18Safe()

> **parseBytes18Safe**\<`TBytes18`\>(`bytes18`): `Effect`\<`never`, [`InvalidBytesFixedError`](../classes/InvalidBytesFixedError.md), `TBytes18`\>

Safely parses a Bytes18 into an [Effect](https://www.effect.website/docs/essentials/effect-type).

## Type Parameters

• **TBytes18**

extends string

## Parameters

• **bytes18**: `TBytes18`

## Returns

`Effect`\<`never`, [`InvalidBytesFixedError`](../classes/InvalidBytesFixedError.md), `TBytes18`\>

## Defined in

[experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixedSafe.js:460](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytesFixed/parseBytesFixedSafe.js#L460)

[**@tevm/primitives**](../../../README.md)

***

[@tevm/primitives](../../../globals.md) / [Address](../README.md) / fromWord

# Function: fromWord()

> **fromWord**(`word`): `Effect`\<[`Address`](../type-aliases/Address.md), `Error`\>

Defined in: [Address.ts:56](https://github.com/evmts/tevm-monorepo/blob/main/packages/primitives/src/Address.ts#L56)

Creates an address from a word (32-byte array) by taking the last 20 bytes

## Parameters

### word

[`B256`](../../B256/type-aliases/B256.md)

The 32-byte array.

## Returns

`Effect`\<[`Address`](../type-aliases/Address.md), `Error`\>

[**@tevm/primitives**](../../../README.md)

***

[@tevm/primitives](../../../globals.md) / [Keccak256](../README.md) / eip191HashMessage

# Function: eip191HashMessage()

> **eip191HashMessage**(`message`): `Effect`\<[`B256`](../../B256/type-aliases/B256.md), `Error`\>

Defined in: [Keccak256.ts:45](https://github.com/evmts/tevm-monorepo/blob/main/packages/primitives/src/Keccak256.ts#L45)

Computes the EIP-191 prefixed message hash

## Parameters

### message

`Uint8Array`

The message bytes to hash.

## Returns

`Effect`\<[`B256`](../../B256/type-aliases/B256.md), `Error`\>

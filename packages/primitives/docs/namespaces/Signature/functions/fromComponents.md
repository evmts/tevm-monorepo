[**@tevm/primitives**](../../../README.md)

***

[@tevm/primitives](../../../globals.md) / [Signature](../README.md) / fromComponents

# Function: fromComponents()

> **fromComponents**(`r`, `s`, `v`): `Effect`\<[`Signature`](../interfaces/Signature.md), `Error`\>

Defined in: [Signature.ts:34](https://github.com/evmts/tevm-monorepo/blob/main/packages/primitives/src/Signature.ts#L34)

Creates a Signature from raw components

## Parameters

### r

[`B256`](../../B256/type-aliases/B256.md)

The r component of the signature.

### s

[`B256`](../../B256/type-aliases/B256.md)

The s component of the signature.

### v

`number`

The v component of the signature (recid).

## Returns

`Effect`\<[`Signature`](../interfaces/Signature.md), `Error`\>

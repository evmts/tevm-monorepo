[**@tevm/primitives**](../../../README.md)

***

[@tevm/primitives](../../../globals.md) / [TxTypes](../README.md) / computeCreate2Address

# Function: computeCreate2Address()

> **computeCreate2Address**(`sender`, `salt`, `initCodeHash`): `Effect`\<[`Address`](../../Address/type-aliases/Address.md), `Error`\>

Defined in: [TxTypes.ts:105](https://github.com/evmts/tevm-monorepo/blob/main/packages/primitives/src/TxTypes.ts#L105)

Computes a contract address created by a CREATE2 transaction

## Parameters

### sender

[`Address`](../../Address/type-aliases/Address.md)

The sender address.

### salt

[`B256`](../../B256/type-aliases/B256.md)

A 32-byte salt.

### initCodeHash

[`B256`](../../B256/type-aliases/B256.md)

The hash of the contract init code.

## Returns

`Effect`\<[`Address`](../../Address/type-aliases/Address.md), `Error`\>

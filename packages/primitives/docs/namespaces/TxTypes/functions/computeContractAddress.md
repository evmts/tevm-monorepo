[**@tevm/primitives**](../../../README.md)

***

[@tevm/primitives](../../../globals.md) / [TxTypes](../README.md) / computeContractAddress

# Function: computeContractAddress()

> **computeContractAddress**(`sender`, `nonce`): `Effect`\<[`Address`](../../Address/type-aliases/Address.md), `Error`\>

Defined in: [TxTypes.ts:78](https://github.com/evmts/tevm-monorepo/blob/main/packages/primitives/src/TxTypes.ts#L78)

Computes a contract address created by a transaction from an account

## Parameters

### sender

[`Address`](../../Address/type-aliases/Address.md)

The sender address.

### nonce

`bigint`

The account nonce.

## Returns

`Effect`\<[`Address`](../../Address/type-aliases/Address.md), `Error`\>

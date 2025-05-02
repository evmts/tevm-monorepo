[**@tevm/primitives**](../../../README.md)

***

[@tevm/primitives](../../../globals.md) / [TxTypes](../README.md) / computeTxHash

# Function: computeTxHash()

> **computeTxHash**(`bytes`): `Effect`\<[`B256`](../../B256/type-aliases/B256.md), `Error`\>

Defined in: [TxTypes.ts:56](https://github.com/evmts/tevm-monorepo/blob/main/packages/primitives/src/TxTypes.ts#L56)

Computes the transaction hash for given RLP-encoded transaction bytes

## Parameters

### bytes

`Uint8Array`

The RLP-encoded transaction bytes.

## Returns

`Effect`\<[`B256`](../../B256/type-aliases/B256.md), `Error`\>

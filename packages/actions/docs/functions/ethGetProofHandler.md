[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / ethGetProofHandler

# Function: ethGetProofHandler()

> **ethGetProofHandler**(`client`): [`EthGetProofHandler`](../type-aliases/EthGetProofHandler.md)

Defined in: [packages/actions/src/eth/ethGetProofHandler.js:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethGetProofHandler.js#L12)

Handler for the `eth_getProof` RPC method.
Returns the account and storage values of the specified account including the Merkle-proof.
Currently only works in forked mode as TEVM does not merklelize state locally.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `TevmNode`\<`"fork"` \| `"normal"`, \{ \}\> | - |

## Returns

[`EthGetProofHandler`](../type-aliases/EthGetProofHandler.md)

[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / ethGetProofProcedure

# Function: ethGetProofProcedure()

> **ethGetProofProcedure**(`client`): [`EthGetProofJsonRpcProcedure`](../type-aliases/EthGetProofJsonRpcProcedure.md)

Defined in: [packages/actions/src/eth/ethGetProofProcedure.js:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethGetProofProcedure.js#L9)

JSON-RPC procedure for `eth_getProof`.
Returns the account and storage values of the specified account including the Merkle-proof.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client` | `TevmNode`\<`"fork"` \| `"normal"`, \{ \}\> | - |

## Returns

[`EthGetProofJsonRpcProcedure`](../type-aliases/EthGetProofJsonRpcProcedure.md)

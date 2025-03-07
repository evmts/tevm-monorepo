[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / ethCreateAccessListProcedure

# Function: ethCreateAccessListProcedure()

> **ethCreateAccessListProcedure**(`client`): [`EthCreateAccessListJsonRpcProcedure`](../type-aliases/EthCreateAccessListJsonRpcProcedure.md)

Creates an access list for a transaction.
Returns list of addresses and storage keys that the transaction plans to access.

## Parameters

• **client**: `TevmNode`\<`"fork"` \| `"normal"`, `object`\>

## Returns

[`EthCreateAccessListJsonRpcProcedure`](../type-aliases/EthCreateAccessListJsonRpcProcedure.md)

## Defined in

[packages/actions/src/eth/ethCreateAccessListProcedure.js:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethCreateAccessListProcedure.js#L9)

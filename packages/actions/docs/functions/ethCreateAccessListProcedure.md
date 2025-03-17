[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / ethCreateAccessListProcedure

# Function: ethCreateAccessListProcedure()

> **ethCreateAccessListProcedure**(`client`): [`EthCreateAccessListJsonRpcProcedure`](../type-aliases/EthCreateAccessListJsonRpcProcedure.md)

Defined in: [packages/actions/src/eth/ethCreateAccessListProcedure.js:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethCreateAccessListProcedure.js#L11)

Creates an access list for a transaction.
Returns list of addresses and storage keys that the transaction plans to access.

## Parameters

### client

`TevmNode`\<`"fork"` \| `"normal"`, \{\}\>

## Returns

[`EthCreateAccessListJsonRpcProcedure`](../type-aliases/EthCreateAccessListJsonRpcProcedure.md)

@ts-ignore - Type mismatch during Zod removal

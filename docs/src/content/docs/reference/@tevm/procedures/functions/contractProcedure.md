---
editUrl: false
next: false
prev: false
title: "contractProcedure"
---

> **contractProcedure**(`client`): `CallJsonRpcProcedure`

Creates a Contract JSON-RPC Procedure for handling contract requests with Ethereumjs EVM
Because the Contract handler is a quality of life wrapper around a call for the JSON rpc interface
we simply overload call instead of creating a seperate tevm_contract method

## Parameters

• **client**: `BaseClient`\<`"fork"` \| `"normal"`, `object`\>

## Returns

`CallJsonRpcProcedure`

## Source

[procedures/src/tevm/contractProcedure.js:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures/src/tevm/contractProcedure.js#L8)

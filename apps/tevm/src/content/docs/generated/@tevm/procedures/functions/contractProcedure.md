---
editUrl: false
next: false
prev: false
title: "contractProcedure"
---

> **contractProcedure**(`evm`): [`CallJsonRpcProcedure`](/generated/tevm/api/type-aliases/calljsonrpcprocedure/)

Creates a Contract JSON-RPC Procedure for handling contract requests with Ethereumjs EVM
Because the Contract handler is a quality of life wrapper around a call for the JSON rpc interface
we simply overload call instead of creating a seperate tevm_contract method

## Parameters

▪ **evm**: `EVM`

## Source

[vm/procedures/src/jsonrpc/contractProcedure.js:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/jsonrpc/contractProcedure.js#L8)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

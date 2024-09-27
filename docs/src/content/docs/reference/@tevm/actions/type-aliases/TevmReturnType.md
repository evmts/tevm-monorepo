---
editUrl: false
next: false
prev: false
title: "TevmReturnType"
---

> **TevmReturnType**: `object`

A mapping of `tevm_*` method names to their return type

## Type declaration

### tevm\_call

> **tevm\_call**: [`CallJsonRpcResponse`](/reference/tevm/actions/type-aliases/calljsonrpcresponse/)

### tevm\_dumpState

> **tevm\_dumpState**: [`DumpStateJsonRpcResponse`](/reference/tevm/actions/type-aliases/dumpstatejsonrpcresponse/)

### tevm\_getAccount

> **tevm\_getAccount**: [`GetAccountJsonRpcResponse`](/reference/tevm/actions/type-aliases/getaccountjsonrpcresponse/)

### ~~tevm\_loadState~~

> **tevm\_loadState**: [`LoadStateJsonRpcResponse`](/reference/tevm/actions/type-aliases/loadstatejsonrpcresponse/)

:::caution[Deprecated]
This API is no longer supported and may be removed in a future release.
:::

### tevm\_mine

> **tevm\_mine**: [`MineJsonRpcResponse`](/reference/tevm/actions/type-aliases/minejsonrpcresponse/)

### tevm\_setAccount

> **tevm\_setAccount**: `SetAccountJsonRpcResponse`

## Defined in

[packages/actions/src/tevm-request-handler/TevmReturnType.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/tevm-request-handler/TevmReturnType.ts#L11)

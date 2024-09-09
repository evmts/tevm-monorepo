---
editUrl: false
next: false
prev: false
title: "TevmRequestType"
---

> **TevmRequestType**: `object`

A mapping of `tevm_*` method names to their request type

## Type declaration

### tevm\_call

> **tevm\_call**: [`CallJsonRpcRequest`](/reference/tevm/procedures/type-aliases/calljsonrpcrequest/)

### tevm\_dumpState

> **tevm\_dumpState**: [`DumpStateJsonRpcRequest`](/reference/tevm/procedures/type-aliases/dumpstatejsonrpcrequest/)

### tevm\_getAccount

> **tevm\_getAccount**: [`GetAccountJsonRpcRequest`](/reference/tevm/procedures/type-aliases/getaccountjsonrpcrequest/)

### tevm\_loadState

> **tevm\_loadState**: [`LoadStateJsonRpcRequest`](/reference/tevm/procedures/type-aliases/loadstatejsonrpcrequest/)

### tevm\_mine

> **tevm\_mine**: [`MineJsonRpcRequest`](/reference/tevm/procedures/type-aliases/minejsonrpcrequest/)

### ~~tevm\_script~~

> **tevm\_script**: [`ScriptJsonRpcRequest`](/reference/tevm/procedures/type-aliases/scriptjsonrpcrequest/)

:::caution[Deprecated]
This API is no longer supported and may be removed in a future release.
:::

### tevm\_setAccount

> **tevm\_setAccount**: [`SetAccountJsonRpcRequest`](/reference/tevm/procedures/type-aliases/setaccountjsonrpcrequest/)

## Defined in

[packages/procedures/src/tevm-request-handler/TevmRequestType.ts:12](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/procedures/src/tevm-request-handler/TevmRequestType.ts#L12)

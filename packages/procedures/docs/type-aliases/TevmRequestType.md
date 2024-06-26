[**@tevm/procedures**](../README.md) • **Docs**

***

[@tevm/procedures](../globals.md) / TevmRequestType

# Type Alias: TevmRequestType

> **TevmRequestType**: `object`

A mapping of `tevm_*` method names to their request type

## Type declaration

### tevm\_call

> **tevm\_call**: [`CallJsonRpcRequest`](CallJsonRpcRequest.md)

### tevm\_dumpState

> **tevm\_dumpState**: [`DumpStateJsonRpcRequest`](DumpStateJsonRpcRequest.md)

### tevm\_getAccount

> **tevm\_getAccount**: [`GetAccountJsonRpcRequest`](GetAccountJsonRpcRequest.md)

### tevm\_loadState

> **tevm\_loadState**: [`LoadStateJsonRpcRequest`](LoadStateJsonRpcRequest.md)

### tevm\_mine

> **tevm\_mine**: [`MineJsonRpcRequest`](MineJsonRpcRequest.md)

### ~~tevm\_script~~

> **tevm\_script**: [`ScriptJsonRpcRequest`](ScriptJsonRpcRequest.md)

#### Deprecated

### tevm\_setAccount

> **tevm\_setAccount**: [`SetAccountJsonRpcRequest`](SetAccountJsonRpcRequest.md)

## Defined in

[procedures/src/tevm-request-handler/TevmRequestType.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/procedures/src/tevm-request-handler/TevmRequestType.ts#L12)

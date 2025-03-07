[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / TevmReturnType

# Type Alias: TevmReturnType

> **TevmReturnType**: `object`

Defined in: [packages/actions/src/tevm-request-handler/TevmReturnType.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/tevm-request-handler/TevmReturnType.ts#L11)

A mapping of `tevm_*` method names to their return type

## Type declaration

### tevm\_call

> **tevm\_call**: [`CallJsonRpcResponse`](CallJsonRpcResponse.md)

### tevm\_dumpState

> **tevm\_dumpState**: [`DumpStateJsonRpcResponse`](DumpStateJsonRpcResponse.md)

### tevm\_getAccount

> **tevm\_getAccount**: [`GetAccountJsonRpcResponse`](GetAccountJsonRpcResponse.md)

### ~~tevm\_loadState~~

> **tevm\_loadState**: [`LoadStateJsonRpcResponse`](LoadStateJsonRpcResponse.md)

#### Deprecated

### tevm\_mine

> **tevm\_mine**: [`MineJsonRpcResponse`](MineJsonRpcResponse.md)

### tevm\_setAccount

> **tevm\_setAccount**: `SetAccountJsonRpcResponse`

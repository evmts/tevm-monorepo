[**@tevm/test-node**](../README.md)

***

[@tevm/test-node](../globals.md) / TestSnapshotTransportOptions

# Type Alias: TestSnapshotTransportOptions\<TTransportType, TRpcAttributes, TEip1193RequestFn\>

> **TestSnapshotTransportOptions**\<`TTransportType`, `TRpcAttributes`, `TEip1193RequestFn`\> = `object`

Defined in: [extensions/test-node/src/types.ts:75](https://github.com/evmts/tevm-monorepo/blob/main/extensions/test-node/src/types.ts#L75)

## Type Parameters

### TTransportType

`TTransportType` *extends* `string` = `string`

### TRpcAttributes

`TRpcAttributes` = `Record`\<`string`, `any`\>

### TEip1193RequestFn

`TEip1193RequestFn` *extends* `EIP1193RequestFn` = `EIP1193RequestFn`

## Properties

### test?

> `optional` **test**: [`TestOptions`](TestOptions.md)

Defined in: [extensions/test-node/src/types.ts:81](https://github.com/evmts/tevm-monorepo/blob/main/extensions/test-node/src/types.ts#L81)

***

### transport

> **transport**: `Transport`\<`TTransportType`, `TRpcAttributes`, `TEip1193RequestFn`\> \| \{ `request`: `TEip1193RequestFn`; \}

Defined in: [extensions/test-node/src/types.ts:80](https://github.com/evmts/tevm-monorepo/blob/main/extensions/test-node/src/types.ts#L80)

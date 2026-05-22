[**@tevm/test-node**](../README.md)

***

[@tevm/test-node](../globals.md) / TestSnapshotTransportOptions

# Type Alias: TestSnapshotTransportOptions\<TTransportType, TRpcAttributes, TEip1193RequestFn\>

> **TestSnapshotTransportOptions**\<`TTransportType`, `TRpcAttributes`, `TEip1193RequestFn`\> = `object`

Defined in: [extensions/test-node/src/types.ts:98](https://github.com/evmts/tevm-monorepo/blob/main/extensions/test-node/src/types.ts#L98)

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TTransportType` *extends* `string` | `string` |
| `TRpcAttributes` | `Record`\<`string`, `any`\> |
| `TEip1193RequestFn` *extends* `EIP1193RequestFn` | `EIP1193RequestFn` |

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="test"></a> `test?` | [`TestOptions`](TestOptions.md) | [extensions/test-node/src/types.ts:104](https://github.com/evmts/tevm-monorepo/blob/main/extensions/test-node/src/types.ts#L104) |
| <a id="transport"></a> `transport` | `Transport`\<`TTransportType`, `TRpcAttributes`, `TEip1193RequestFn`\> \| \{ `request`: `TEip1193RequestFn`; \} | [extensions/test-node/src/types.ts:103](https://github.com/evmts/tevm-monorepo/blob/main/extensions/test-node/src/types.ts#L103) |

[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / TevmActions

# Type alias: TevmActions

> **TevmActions**: `object`

## Type declaration

### \_tevm

> **\_tevm**: [`BaseClient`](BaseClient.md) & [`Eip1193RequestProvider`](Eip1193RequestProvider.md) & [`TevmActionsApi`](TevmActionsApi.md) & `object`

#### Type declaration

##### request

> **request**: [`EIP1193RequestFn`](EIP1193RequestFn.md)

##### send

> **send**: [`TevmJsonRpcRequestHandler`](TevmJsonRpcRequestHandler.md)

##### sendBulk

> **sendBulk**: [`TevmJsonRpcBulkRequestHandler`](TevmJsonRpcBulkRequestHandler.md)

### tevmCall

> **tevmCall**: [`TevmActionsApi`](TevmActionsApi.md)\[`"call"`\]

### tevmContract

> **tevmContract**: [`TevmActionsApi`](TevmActionsApi.md)\[`"contract"`\]

### tevmDeploy

> **tevmDeploy**: [`TevmActionsApi`](TevmActionsApi.md)\[`"deploy"`\]

### tevmDumpState

> **tevmDumpState**: [`TevmActionsApi`](TevmActionsApi.md)\[`"dumpState"`\]

### tevmForkUrl?

> `optional` **tevmForkUrl**: `string`

### tevmGetAccount

> **tevmGetAccount**: [`TevmActionsApi`](TevmActionsApi.md)\[`"getAccount"`\]

### tevmLoadState

> **tevmLoadState**: [`TevmActionsApi`](TevmActionsApi.md)\[`"loadState"`\]

### tevmMine

> **tevmMine**: [`TevmActionsApi`](TevmActionsApi.md)\[`"mine"`\]

### tevmReady()

> **tevmReady**: () => `Promise`\<`true`\>

#### Returns

`Promise`\<`true`\>

### tevmScript

> **tevmScript**: [`TevmActionsApi`](TevmActionsApi.md)\[`"script"`\]

### tevmSetAccount

> **tevmSetAccount**: [`TevmActionsApi`](TevmActionsApi.md)\[`"setAccount"`\]

## Source

packages/memory-client/types/TevmActions.d.ts:4

**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [memory-client](../README.md) > TevmActions

# Type alias: TevmActions

> **TevmActions**: `object`

## Type declaration

### \_tevm

> **\_tevm**: [`BaseClient`](../../index/type-aliases/BaseClient.md) & [`Eip1193RequestProvider`](../../index/type-aliases/Eip1193RequestProvider.md) & [`TevmActionsApi`](../../index/type-aliases/TevmActionsApi.md) & `object`

#### Type declaration

##### request

> **request**: [`EIP1193RequestFn`](../../index/type-aliases/EIP1193RequestFn.md)

##### send

> **send**: [`TevmJsonRpcRequestHandler`](../../index/type-aliases/TevmJsonRpcRequestHandler.md)

##### sendBulk

> **sendBulk**: [`TevmJsonRpcBulkRequestHandler`](../../index/type-aliases/TevmJsonRpcBulkRequestHandler.md)

### tevmCall

> **tevmCall**: [`TevmActionsApi`](../../index/type-aliases/TevmActionsApi.md)[`"call"`]

### tevmContract

> **tevmContract**: [`TevmActionsApi`](../../index/type-aliases/TevmActionsApi.md)[`"contract"`]

### tevmDeploy

> **tevmDeploy**: [`TevmActionsApi`](../../index/type-aliases/TevmActionsApi.md)[`"deploy"`]

### tevmDumpState

> **tevmDumpState**: [`TevmActionsApi`](../../index/type-aliases/TevmActionsApi.md)[`"dumpState"`]

### tevmForkUrl

> **tevmForkUrl**?: `string`

### tevmGetAccount

> **tevmGetAccount**: [`TevmActionsApi`](../../index/type-aliases/TevmActionsApi.md)[`"getAccount"`]

### tevmLoadState

> **tevmLoadState**: [`TevmActionsApi`](../../index/type-aliases/TevmActionsApi.md)[`"loadState"`]

### tevmMine

> **tevmMine**: [`TevmActionsApi`](../../index/type-aliases/TevmActionsApi.md)[`"mine"`]

### tevmReady

> **tevmReady**: () => `Promise`\<`true`\>

### tevmScript

> **tevmScript**: [`TevmActionsApi`](../../index/type-aliases/TevmActionsApi.md)[`"script"`]

### tevmSetAccount

> **tevmSetAccount**: [`TevmActionsApi`](../../index/type-aliases/TevmActionsApi.md)[`"setAccount"`]

## Source

packages/memory-client/types/TevmActions.d.ts:4

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

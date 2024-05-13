**@tevm/memory-client** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > TevmActions

# Type alias: TevmActions

> **TevmActions**: `object`

## Type declaration

### \_tevm

> **\_tevm**: `BaseClient` & `Eip1193RequestProvider` & `TevmActionsApi` & `object`

#### Type declaration

##### request

> **request**: `EIP1193RequestFn`

##### send

> **send**: `TevmJsonRpcRequestHandler`

##### sendBulk

> **sendBulk**: `TevmJsonRpcBulkRequestHandler`

### tevmCall

> **tevmCall**: `TevmActionsApi`[`"call"`]

### tevmContract

> **tevmContract**: `TevmActionsApi`[`"contract"`]

### tevmDeploy

> **tevmDeploy**: `TevmActionsApi`[`"deploy"`]

### tevmDumpState

> **tevmDumpState**: `TevmActionsApi`[`"dumpState"`]

### tevmForkUrl

> **tevmForkUrl**?: `string`

### tevmGetAccount

> **tevmGetAccount**: `TevmActionsApi`[`"getAccount"`]

### tevmLoadState

> **tevmLoadState**: `TevmActionsApi`[`"loadState"`]

### tevmMine

> **tevmMine**: `TevmActionsApi`[`"mine"`]

### tevmReady

> **tevmReady**: () => `Promise`\<`true`\>

### tevmScript

> **tevmScript**: `TevmActionsApi`[`"script"`]

### tevmSetAccount

> **tevmSetAccount**: `TevmActionsApi`[`"setAccount"`]

## Source

[packages/memory-client/src/TevmActions.ts:5](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmActions.ts#L5)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

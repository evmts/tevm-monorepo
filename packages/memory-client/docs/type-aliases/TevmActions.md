[**@tevm/memory-client**](../README.md) • **Docs**

***

[@tevm/memory-client](../globals.md) / TevmActions

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

> **tevmCall**: `TevmActionsApi`\[`"call"`\]

### tevmContract

> **tevmContract**: `TevmActionsApi`\[`"contract"`\]

### tevmDeploy

> **tevmDeploy**: `TevmActionsApi`\[`"deploy"`\]

### tevmDumpState

> **tevmDumpState**: `TevmActionsApi`\[`"dumpState"`\]

### tevmForkUrl?

> `optional` **tevmForkUrl**: `string`

### tevmGetAccount

> **tevmGetAccount**: `TevmActionsApi`\[`"getAccount"`\]

### tevmLoadState

> **tevmLoadState**: `TevmActionsApi`\[`"loadState"`\]

### tevmMine

> **tevmMine**: `TevmActionsApi`\[`"mine"`\]

### tevmReady()

> **tevmReady**: () => `Promise`\<`true`\>

#### Returns

`Promise`\<`true`\>

### ~~tevmScript~~

> **tevmScript**: `TevmActionsApi`\[`"script"`\]

#### Deprecated

in favor of tevmContract

### tevmSetAccount

> **tevmSetAccount**: `TevmActionsApi`\[`"setAccount"`\]

## Source

[packages/memory-client/src/TevmActions.ts:5](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmActions.ts#L5)

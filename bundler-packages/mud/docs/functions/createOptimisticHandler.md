[**@tevm/mud**](../README.md)

***

[@tevm/mud](../globals.md) / createOptimisticHandler

# Function: createOptimisticHandler()

> **createOptimisticHandler**\<`TConfig`\>(`__namedParameters`): [`CreateOptimisticHandlerResult`](../type-aliases/CreateOptimisticHandlerResult.md)\<`TConfig`\>

Defined in: [createOptimisticHandler.ts:86](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/mud/src/createOptimisticHandler.ts#L86)

Initializes the optimistic handlers (storage and send transaction interceptors), and returns optimistic methods.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TConfig` *extends* `StoreConfig` | `StoreConfig` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | [`CreateOptimisticHandlerOptions`](../type-aliases/CreateOptimisticHandlerOptions.md)\<`TConfig`\> |

## Returns

[`CreateOptimisticHandlerResult`](../type-aliases/CreateOptimisticHandlerResult.md)\<`TConfig`\>

[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [block](../README.md) / createBlockFromExecutionPayload

# Function: createBlockFromExecutionPayload()

> **createBlockFromExecutionPayload**(`payload`, `opts`): `Promise`\<[`Block`](../classes/Block.md)\>

Creates a block from an execution payload

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `payload` | [`ExecutionPayload`](../type-aliases/ExecutionPayload.md) | The execution payload |
| `opts` | [`BlockOptions`](../interfaces/BlockOptions.md) | Options for the block |

## Returns

`Promise`\<[`Block`](../classes/Block.md)\>

A promise that resolves to a new Block instance

## See

Block.fromExecutionPayload

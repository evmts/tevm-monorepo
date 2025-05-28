[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [block](../README.md) / createBlockFromBeaconPayload

# Function: createBlockFromBeaconPayload()

> **createBlockFromBeaconPayload**(`payload`, `opts`): `Promise`\<[`Block`](../classes/Block.md)\>

Defined in: packages/block/types/index.d.ts:51

Creates a block from a beacon payload JSON

## Parameters

### payload

[`BeaconPayloadJson`](../type-aliases/BeaconPayloadJson.md)

The beacon payload JSON

### opts

[`BlockOptions`](../interfaces/BlockOptions.md)

Options for the block

## Returns

`Promise`\<[`Block`](../classes/Block.md)\>

A promise that resolves to a new Block instance

## See

Block.fromBeaconPayloadJson

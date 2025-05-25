[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / createBlockFromBeaconPayload

# Function: createBlockFromBeaconPayload()

> **createBlockFromBeaconPayload**(`payload`, `opts`): `Promise`\<[`Block`](../classes/Block.md)\>

Defined in: packages/block/src/index.ts:65

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

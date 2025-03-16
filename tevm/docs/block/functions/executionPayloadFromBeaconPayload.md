[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [block](../README.md) / executionPayloadFromBeaconPayload

# Function: executionPayloadFromBeaconPayload()

> **executionPayloadFromBeaconPayload**(`payload`): [`ExecutionPayload`](../type-aliases/ExecutionPayload.md)

Defined in: packages/block/types/from-beacon-payload.d.ts:62

Converts a beacon block execution payload JSON object [BeaconPayloadJson](../type-aliases/BeaconPayloadJson.md) to the [ExecutionPayload](../type-aliases/ExecutionPayload.md) data needed to construct a [Block](../classes/Block.md).
The JSON data can be retrieved from a consensus layer (CL) client on this Beacon API `/eth/v2/beacon/blocks/[block number]`

## Parameters

### payload

[`BeaconPayloadJson`](../type-aliases/BeaconPayloadJson.md)

## Returns

[`ExecutionPayload`](../type-aliases/ExecutionPayload.md)

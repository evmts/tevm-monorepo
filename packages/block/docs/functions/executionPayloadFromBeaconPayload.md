[**@tevm/block**](../README.md) • **Docs**

***

[@tevm/block](../globals.md) / executionPayloadFromBeaconPayload

# Function: executionPayloadFromBeaconPayload()

> **executionPayloadFromBeaconPayload**(`payload`): [`ExecutionPayload`](../type-aliases/ExecutionPayload.md)

Converts a beacon block execution payload JSON object [BeaconPayloadJson](../type-aliases/BeaconPayloadJson.md) to the [ExecutionPayload](../type-aliases/ExecutionPayload.md) data needed to construct a [Block](../classes/Block.md).
The JSON data can be retrieved from a consensus layer (CL) client on this Beacon API `/eth/v2/beacon/blocks/[block number]`

## Parameters

• **payload**: [`BeaconPayloadJson`](../type-aliases/BeaconPayloadJson.md)

## Returns

[`ExecutionPayload`](../type-aliases/ExecutionPayload.md)

## Source

[from-beacon-payload.ts:93](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L93)

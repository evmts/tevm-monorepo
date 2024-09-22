---
editUrl: false
next: false
prev: false
title: "executionPayloadFromBeaconPayload"
---

> **executionPayloadFromBeaconPayload**(`payload`): [`ExecutionPayload`](/reference/tevm/block/type-aliases/executionpayload/)

Converts a beacon block execution payload JSON object [BeaconPayloadJson](../../../../../../../reference/tevm/block/type-aliases/beaconpayloadjson) to the [ExecutionPayload](../../../../../../../reference/tevm/block/type-aliases/executionpayload) data needed to construct a [Block](../../../../../../../reference/tevm/block/classes/block).
The JSON data can be retrieved from a consensus layer (CL) client on this Beacon API `/eth/v2/beacon/blocks/[block number]`

## Parameters

• **payload**: [`BeaconPayloadJson`](/reference/tevm/block/type-aliases/beaconpayloadjson/)

## Returns

[`ExecutionPayload`](/reference/tevm/block/type-aliases/executionpayload/)

## Defined in

[packages/block/src/from-beacon-payload.ts:93](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L93)

[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / BeaconPayloadJson

# Type Alias: BeaconPayloadJson

> **BeaconPayloadJson** = `object`

Defined in: [packages/block/src/from-beacon-payload.ts:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L41)

Represents the JSON structure of an execution payload from the Beacon API

This type uses snake_case property names as returned by the Beacon API,
as opposed to the camelCase used internally in Tevm. Used when fetching
execution payloads from a consensus layer client.

## See

https://ethereum.github.io/beacon-APIs/ for the Beacon API specification

## Example

```typescript
import { BeaconPayloadJson, executionPayloadFromBeaconPayload } from '@tevm/block'

// Fetch the payload from a Beacon API
async function getExecutionPayload(blockNumber: number) {
  const response = await fetch(
    `http://localhost:5052/eth/v2/beacon/blocks/${blockNumber}`
  )
  const data = await response.json()

  // Extract and parse the execution payload
  const beaconPayload: BeaconPayloadJson = data.data.message.body.execution_payload

  // Convert to Tevm's internal ExecutionPayload format
  return executionPayloadFromBeaconPayload(beaconPayload)
}
```

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="base_fee_per_gas"></a> `base_fee_per_gas` | `Hex` | [packages/block/src/from-beacon-payload.ts:53](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L53) |
| <a id="blob_gas_used"></a> `blob_gas_used?` | `Hex` | [packages/block/src/from-beacon-payload.ts:57](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L57) |
| <a id="block_hash"></a> `block_hash` | `Hex` | [packages/block/src/from-beacon-payload.ts:54](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L54) |
| <a id="block_number"></a> `block_number` | `Hex` | [packages/block/src/from-beacon-payload.ts:48](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L48) |
| <a id="excess_blob_gas"></a> `excess_blob_gas?` | `Hex` | [packages/block/src/from-beacon-payload.ts:58](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L58) |
| <a id="execution_witness"></a> `execution_witness?` | [`VerkleExecutionWitness`](../interfaces/VerkleExecutionWitness.md) | [packages/block/src/from-beacon-payload.ts:61](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L61) |
| <a id="extra_data"></a> `extra_data` | `Hex` | [packages/block/src/from-beacon-payload.ts:52](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L52) |
| <a id="fee_recipient"></a> `fee_recipient` | `Hex` | [packages/block/src/from-beacon-payload.ts:43](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L43) |
| <a id="gas_limit"></a> `gas_limit` | `Hex` | [packages/block/src/from-beacon-payload.ts:49](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L49) |
| <a id="gas_used"></a> `gas_used` | `Hex` | [packages/block/src/from-beacon-payload.ts:50](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L50) |
| <a id="logs_bloom"></a> `logs_bloom` | `Hex` | [packages/block/src/from-beacon-payload.ts:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L46) |
| <a id="parent_beacon_block_root"></a> `parent_beacon_block_root?` | `Hex` | [packages/block/src/from-beacon-payload.ts:59](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L59) |
| <a id="parent_hash"></a> `parent_hash` | `Hex` | [packages/block/src/from-beacon-payload.ts:42](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L42) |
| <a id="prev_randao"></a> `prev_randao` | `Hex` | [packages/block/src/from-beacon-payload.ts:47](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L47) |
| <a id="receipts_root"></a> `receipts_root` | `Hex` | [packages/block/src/from-beacon-payload.ts:45](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L45) |
| <a id="state_root"></a> `state_root` | `Hex` | [packages/block/src/from-beacon-payload.ts:44](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L44) |
| <a id="timestamp"></a> `timestamp` | `Hex` | [packages/block/src/from-beacon-payload.ts:51](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L51) |
| <a id="transactions"></a> `transactions` | `Hex`[] | [packages/block/src/from-beacon-payload.ts:55](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L55) |
| <a id="withdrawals"></a> `withdrawals?` | `BeaconWithdrawal`[] | [packages/block/src/from-beacon-payload.ts:56](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L56) |

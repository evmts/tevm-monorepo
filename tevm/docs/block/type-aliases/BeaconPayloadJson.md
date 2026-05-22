[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [block](../README.md) / BeaconPayloadJson

# Type Alias: BeaconPayloadJson

> **BeaconPayloadJson** = `object`

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

| Property | Type |
| ------ | ------ |
| <a id="base_fee_per_gas"></a> `base_fee_per_gas` | [`Hex`](../../index/type-aliases/Hex.md) |
| <a id="blob_gas_used"></a> `blob_gas_used?` | [`Hex`](../../index/type-aliases/Hex.md) |
| <a id="block_hash"></a> `block_hash` | [`Hex`](../../index/type-aliases/Hex.md) |
| <a id="block_number"></a> `block_number` | [`Hex`](../../index/type-aliases/Hex.md) |
| <a id="excess_blob_gas"></a> `excess_blob_gas?` | [`Hex`](../../index/type-aliases/Hex.md) |
| <a id="execution_witness"></a> `execution_witness?` | [`VerkleExecutionWitness`](../interfaces/VerkleExecutionWitness.md) |
| <a id="extra_data"></a> `extra_data` | [`Hex`](../../index/type-aliases/Hex.md) |
| <a id="fee_recipient"></a> `fee_recipient` | [`Hex`](../../index/type-aliases/Hex.md) |
| <a id="gas_limit"></a> `gas_limit` | [`Hex`](../../index/type-aliases/Hex.md) |
| <a id="gas_used"></a> `gas_used` | [`Hex`](../../index/type-aliases/Hex.md) |
| <a id="logs_bloom"></a> `logs_bloom` | [`Hex`](../../index/type-aliases/Hex.md) |
| <a id="parent_beacon_block_root"></a> `parent_beacon_block_root?` | [`Hex`](../../index/type-aliases/Hex.md) |
| <a id="parent_hash"></a> `parent_hash` | [`Hex`](../../index/type-aliases/Hex.md) |
| <a id="prev_randao"></a> `prev_randao` | [`Hex`](../../index/type-aliases/Hex.md) |
| <a id="receipts_root"></a> `receipts_root` | [`Hex`](../../index/type-aliases/Hex.md) |
| <a id="state_root"></a> `state_root` | [`Hex`](../../index/type-aliases/Hex.md) |
| <a id="timestamp"></a> `timestamp` | [`Hex`](../../index/type-aliases/Hex.md) |
| <a id="transactions"></a> `transactions` | [`Hex`](../../index/type-aliases/Hex.md)[] |
| <a id="withdrawals"></a> `withdrawals?` | `BeaconWithdrawal`[] |

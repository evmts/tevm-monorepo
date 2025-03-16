[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [block](../README.md) / BeaconPayloadJson

# Type Alias: BeaconPayloadJson

> **BeaconPayloadJson**: `object`

Defined in: packages/block/types/from-beacon-payload.d.ts:37

Represents the JSON structure of an execution payload from the Beacon API

This type uses snake_case property names as returned by the Beacon API,
as opposed to the camelCase used internally in Tevm. Used when fetching
execution payloads from a consensus layer client.

## Type declaration

### base\_fee\_per\_gas

> **base\_fee\_per\_gas**: [`Hex`](../../index/type-aliases/Hex.md)

### blob\_gas\_used?

> `optional` **blob\_gas\_used**: [`Hex`](../../index/type-aliases/Hex.md)

### block\_hash

> **block\_hash**: [`Hex`](../../index/type-aliases/Hex.md)

### block\_number

> **block\_number**: [`Hex`](../../index/type-aliases/Hex.md)

### excess\_blob\_gas?

> `optional` **excess\_blob\_gas**: [`Hex`](../../index/type-aliases/Hex.md)

### execution\_witness?

> `optional` **execution\_witness**: [`VerkleExecutionWitness`](../interfaces/VerkleExecutionWitness.md)

### extra\_data

> **extra\_data**: [`Hex`](../../index/type-aliases/Hex.md)

### fee\_recipient

> **fee\_recipient**: [`Hex`](../../index/type-aliases/Hex.md)

### gas\_limit

> **gas\_limit**: [`Hex`](../../index/type-aliases/Hex.md)

### gas\_used

> **gas\_used**: [`Hex`](../../index/type-aliases/Hex.md)

### logs\_bloom

> **logs\_bloom**: [`Hex`](../../index/type-aliases/Hex.md)

### parent\_beacon\_block\_root?

> `optional` **parent\_beacon\_block\_root**: [`Hex`](../../index/type-aliases/Hex.md)

### parent\_hash

> **parent\_hash**: [`Hex`](../../index/type-aliases/Hex.md)

### prev\_randao

> **prev\_randao**: [`Hex`](../../index/type-aliases/Hex.md)

### receipts\_root

> **receipts\_root**: [`Hex`](../../index/type-aliases/Hex.md)

### state\_root

> **state\_root**: [`Hex`](../../index/type-aliases/Hex.md)

### timestamp

> **timestamp**: [`Hex`](../../index/type-aliases/Hex.md)

### transactions

> **transactions**: [`Hex`](../../index/type-aliases/Hex.md)[]

### withdrawals?

> `optional` **withdrawals**: `BeaconWithdrawal`[]

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

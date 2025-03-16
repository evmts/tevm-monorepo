[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / BeaconPayloadJson

# Type Alias: BeaconPayloadJson

> **BeaconPayloadJson**: `object`

Defined in: [packages/block/src/from-beacon-payload.ts:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L41)

Represents the JSON structure of an execution payload from the Beacon API

This type uses snake_case property names as returned by the Beacon API,
as opposed to the camelCase used internally in Tevm. Used when fetching
execution payloads from a consensus layer client.

## Type declaration

### base\_fee\_per\_gas

> **base\_fee\_per\_gas**: `Hex`

### blob\_gas\_used?

> `optional` **blob\_gas\_used**: `Hex`

### block\_hash

> **block\_hash**: `Hex`

### block\_number

> **block\_number**: `Hex`

### excess\_blob\_gas?

> `optional` **excess\_blob\_gas**: `Hex`

### execution\_witness?

> `optional` **execution\_witness**: [`VerkleExecutionWitness`](../interfaces/VerkleExecutionWitness.md)

### extra\_data

> **extra\_data**: `Hex`

### fee\_recipient

> **fee\_recipient**: `Hex`

### gas\_limit

> **gas\_limit**: `Hex`

### gas\_used

> **gas\_used**: `Hex`

### logs\_bloom

> **logs\_bloom**: `Hex`

### parent\_beacon\_block\_root?

> `optional` **parent\_beacon\_block\_root**: `Hex`

### parent\_hash

> **parent\_hash**: `Hex`

### prev\_randao

> **prev\_randao**: `Hex`

### receipts\_root

> **receipts\_root**: `Hex`

### state\_root

> **state\_root**: `Hex`

### timestamp

> **timestamp**: `Hex`

### transactions

> **transactions**: `Hex`[]

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

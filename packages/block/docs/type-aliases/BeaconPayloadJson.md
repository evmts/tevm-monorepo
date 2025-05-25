[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / BeaconPayloadJson

# Type Alias: BeaconPayloadJson

> **BeaconPayloadJson** = `object`

Defined in: packages/block/src/from-beacon-payload.ts:41

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

### base\_fee\_per\_gas

> **base\_fee\_per\_gas**: `Hex`

Defined in: packages/block/src/from-beacon-payload.ts:53

***

### blob\_gas\_used?

> `optional` **blob\_gas\_used**: `Hex`

Defined in: packages/block/src/from-beacon-payload.ts:57

***

### block\_hash

> **block\_hash**: `Hex`

Defined in: packages/block/src/from-beacon-payload.ts:54

***

### block\_number

> **block\_number**: `Hex`

Defined in: packages/block/src/from-beacon-payload.ts:48

***

### excess\_blob\_gas?

> `optional` **excess\_blob\_gas**: `Hex`

Defined in: packages/block/src/from-beacon-payload.ts:58

***

### execution\_witness?

> `optional` **execution\_witness**: [`VerkleExecutionWitness`](../interfaces/VerkleExecutionWitness.md)

Defined in: packages/block/src/from-beacon-payload.ts:61

***

### extra\_data

> **extra\_data**: `Hex`

Defined in: packages/block/src/from-beacon-payload.ts:52

***

### fee\_recipient

> **fee\_recipient**: `Hex`

Defined in: packages/block/src/from-beacon-payload.ts:43

***

### gas\_limit

> **gas\_limit**: `Hex`

Defined in: packages/block/src/from-beacon-payload.ts:49

***

### gas\_used

> **gas\_used**: `Hex`

Defined in: packages/block/src/from-beacon-payload.ts:50

***

### logs\_bloom

> **logs\_bloom**: `Hex`

Defined in: packages/block/src/from-beacon-payload.ts:46

***

### parent\_beacon\_block\_root?

> `optional` **parent\_beacon\_block\_root**: `Hex`

Defined in: packages/block/src/from-beacon-payload.ts:59

***

### parent\_hash

> **parent\_hash**: `Hex`

Defined in: packages/block/src/from-beacon-payload.ts:42

***

### prev\_randao

> **prev\_randao**: `Hex`

Defined in: packages/block/src/from-beacon-payload.ts:47

***

### receipts\_root

> **receipts\_root**: `Hex`

Defined in: packages/block/src/from-beacon-payload.ts:45

***

### state\_root

> **state\_root**: `Hex`

Defined in: packages/block/src/from-beacon-payload.ts:44

***

### timestamp

> **timestamp**: `Hex`

Defined in: packages/block/src/from-beacon-payload.ts:51

***

### transactions

> **transactions**: `Hex`[]

Defined in: packages/block/src/from-beacon-payload.ts:55

***

### withdrawals?

> `optional` **withdrawals**: `BeaconWithdrawal`[]

Defined in: packages/block/src/from-beacon-payload.ts:56

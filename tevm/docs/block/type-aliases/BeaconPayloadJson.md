[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [block](../README.md) / BeaconPayloadJson

# Type Alias: BeaconPayloadJson

> **BeaconPayloadJson** = `object`

Defined in: packages/block/types/from-beacon-payload.d.ts:37

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

> **base\_fee\_per\_gas**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/block/types/from-beacon-payload.d.ts:49

***

### blob\_gas\_used?

> `optional` **blob\_gas\_used**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/block/types/from-beacon-payload.d.ts:53

***

### block\_hash

> **block\_hash**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/block/types/from-beacon-payload.d.ts:50

***

### block\_number

> **block\_number**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/block/types/from-beacon-payload.d.ts:44

***

### excess\_blob\_gas?

> `optional` **excess\_blob\_gas**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/block/types/from-beacon-payload.d.ts:54

***

### execution\_witness?

> `optional` **execution\_witness**: [`VerkleExecutionWitness`](../interfaces/VerkleExecutionWitness.md)

Defined in: packages/block/types/from-beacon-payload.d.ts:56

***

### extra\_data

> **extra\_data**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/block/types/from-beacon-payload.d.ts:48

***

### fee\_recipient

> **fee\_recipient**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/block/types/from-beacon-payload.d.ts:39

***

### gas\_limit

> **gas\_limit**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/block/types/from-beacon-payload.d.ts:45

***

### gas\_used

> **gas\_used**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/block/types/from-beacon-payload.d.ts:46

***

### logs\_bloom

> **logs\_bloom**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/block/types/from-beacon-payload.d.ts:42

***

### parent\_beacon\_block\_root?

> `optional` **parent\_beacon\_block\_root**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/block/types/from-beacon-payload.d.ts:55

***

### parent\_hash

> **parent\_hash**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/block/types/from-beacon-payload.d.ts:38

***

### prev\_randao

> **prev\_randao**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/block/types/from-beacon-payload.d.ts:43

***

### receipts\_root

> **receipts\_root**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/block/types/from-beacon-payload.d.ts:41

***

### state\_root

> **state\_root**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/block/types/from-beacon-payload.d.ts:40

***

### timestamp

> **timestamp**: [`Hex`](../../index/type-aliases/Hex.md)

Defined in: packages/block/types/from-beacon-payload.d.ts:47

***

### transactions

> **transactions**: [`Hex`](../../index/type-aliases/Hex.md)[]

Defined in: packages/block/types/from-beacon-payload.d.ts:51

***

### withdrawals?

> `optional` **withdrawals**: `BeaconWithdrawal`[]

Defined in: packages/block/types/from-beacon-payload.d.ts:52

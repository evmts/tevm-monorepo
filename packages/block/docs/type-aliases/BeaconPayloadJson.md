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

### base\_fee\_per\_gas

> **base\_fee\_per\_gas**: `Hex`

Defined in: [packages/block/src/from-beacon-payload.ts:53](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L53)

***

### blob\_gas\_used?

> `optional` **blob\_gas\_used**: `Hex`

Defined in: [packages/block/src/from-beacon-payload.ts:57](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L57)

***

### block\_hash

> **block\_hash**: `Hex`

Defined in: [packages/block/src/from-beacon-payload.ts:54](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L54)

***

### block\_number

> **block\_number**: `Hex`

Defined in: [packages/block/src/from-beacon-payload.ts:48](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L48)

***

### excess\_blob\_gas?

> `optional` **excess\_blob\_gas**: `Hex`

Defined in: [packages/block/src/from-beacon-payload.ts:58](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L58)

***

### execution\_witness?

> `optional` **execution\_witness**: [`VerkleExecutionWitness`](../interfaces/VerkleExecutionWitness.md)

Defined in: [packages/block/src/from-beacon-payload.ts:61](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L61)

***

### extra\_data

> **extra\_data**: `Hex`

Defined in: [packages/block/src/from-beacon-payload.ts:52](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L52)

***

### fee\_recipient

> **fee\_recipient**: `Hex`

Defined in: [packages/block/src/from-beacon-payload.ts:43](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L43)

***

### gas\_limit

> **gas\_limit**: `Hex`

Defined in: [packages/block/src/from-beacon-payload.ts:49](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L49)

***

### gas\_used

> **gas\_used**: `Hex`

Defined in: [packages/block/src/from-beacon-payload.ts:50](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L50)

***

### logs\_bloom

> **logs\_bloom**: `Hex`

Defined in: [packages/block/src/from-beacon-payload.ts:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L46)

***

### parent\_beacon\_block\_root?

> `optional` **parent\_beacon\_block\_root**: `Hex`

Defined in: [packages/block/src/from-beacon-payload.ts:59](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L59)

***

### parent\_hash

> **parent\_hash**: `Hex`

Defined in: [packages/block/src/from-beacon-payload.ts:42](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L42)

***

### prev\_randao

> **prev\_randao**: `Hex`

Defined in: [packages/block/src/from-beacon-payload.ts:47](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L47)

***

### receipts\_root

> **receipts\_root**: `Hex`

Defined in: [packages/block/src/from-beacon-payload.ts:45](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L45)

***

### state\_root

> **state\_root**: `Hex`

Defined in: [packages/block/src/from-beacon-payload.ts:44](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L44)

***

### timestamp

> **timestamp**: `Hex`

Defined in: [packages/block/src/from-beacon-payload.ts:51](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L51)

***

### transactions

> **transactions**: `Hex`[]

Defined in: [packages/block/src/from-beacon-payload.ts:55](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L55)

***

### withdrawals?

> `optional` **withdrawals**: `BeaconWithdrawal`[]

Defined in: [packages/block/src/from-beacon-payload.ts:56](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L56)

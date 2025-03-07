[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / BeaconPayloadJson

# Type Alias: BeaconPayloadJson

> **BeaconPayloadJson**: `object`

Defined in: [packages/block/src/from-beacon-payload.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L13)

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

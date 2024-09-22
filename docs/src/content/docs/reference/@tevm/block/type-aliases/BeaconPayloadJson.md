---
editUrl: false
next: false
prev: false
title: "BeaconPayloadJson"
---

> **BeaconPayloadJson**: `object`

## Type declaration

### base\_fee\_per\_gas

> **base\_fee\_per\_gas**: [`Hex`](/reference/tevm/utils/type-aliases/hex/)

### blob\_gas\_used?

> `optional` **blob\_gas\_used**: [`Hex`](/reference/tevm/utils/type-aliases/hex/)

### block\_hash

> **block\_hash**: [`Hex`](/reference/tevm/utils/type-aliases/hex/)

### block\_number

> **block\_number**: [`Hex`](/reference/tevm/utils/type-aliases/hex/)

### excess\_blob\_gas?

> `optional` **excess\_blob\_gas**: [`Hex`](/reference/tevm/utils/type-aliases/hex/)

### execution\_witness?

> `optional` **execution\_witness**: [`VerkleExecutionWitness`](/reference/tevm/block/interfaces/verkleexecutionwitness/)

### extra\_data

> **extra\_data**: [`Hex`](/reference/tevm/utils/type-aliases/hex/)

### fee\_recipient

> **fee\_recipient**: [`Hex`](/reference/tevm/utils/type-aliases/hex/)

### gas\_limit

> **gas\_limit**: [`Hex`](/reference/tevm/utils/type-aliases/hex/)

### gas\_used

> **gas\_used**: [`Hex`](/reference/tevm/utils/type-aliases/hex/)

### logs\_bloom

> **logs\_bloom**: [`Hex`](/reference/tevm/utils/type-aliases/hex/)

### parent\_beacon\_block\_root?

> `optional` **parent\_beacon\_block\_root**: [`Hex`](/reference/tevm/utils/type-aliases/hex/)

### parent\_hash

> **parent\_hash**: [`Hex`](/reference/tevm/utils/type-aliases/hex/)

### prev\_randao

> **prev\_randao**: [`Hex`](/reference/tevm/utils/type-aliases/hex/)

### receipts\_root

> **receipts\_root**: [`Hex`](/reference/tevm/utils/type-aliases/hex/)

### state\_root

> **state\_root**: [`Hex`](/reference/tevm/utils/type-aliases/hex/)

### timestamp

> **timestamp**: [`Hex`](/reference/tevm/utils/type-aliases/hex/)

### transactions

> **transactions**: [`Hex`](/reference/tevm/utils/type-aliases/hex/)[]

### withdrawals?

> `optional` **withdrawals**: `BeaconWithdrawal`[]

## Defined in

[packages/block/src/from-beacon-payload.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/from-beacon-payload.ts#L13)

[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / CallTrace

# Type Alias: CallTrace

> **CallTrace** = `object`

Defined in: packages/actions/types/eth/EthResult.d.ts:403

Call trace for V2 debugging

## Properties

### calls?

> `optional` **calls**: `CallTrace`[]

Defined in: packages/actions/types/eth/EthResult.d.ts:443

Sub-calls made during this call

***

### error?

> `optional` **error**: `string`

Defined in: packages/actions/types/eth/EthResult.d.ts:439

Error message if the call failed

***

### from

> **from**: [`Address`](Address.md)

Defined in: packages/actions/types/eth/EthResult.d.ts:411

The sender address

***

### gas

> **gas**: `bigint`

Defined in: packages/actions/types/eth/EthResult.d.ts:423

The gas provided

***

### gasUsed

> **gasUsed**: `bigint`

Defined in: packages/actions/types/eth/EthResult.d.ts:427

The gas used

***

### input

> **input**: [`Hex`](Hex.md)

Defined in: packages/actions/types/eth/EthResult.d.ts:431

The input data

***

### output

> **output**: [`Hex`](Hex.md)

Defined in: packages/actions/types/eth/EthResult.d.ts:435

The output/return data

***

### to?

> `optional` **to**: [`Address`](Address.md)

Defined in: packages/actions/types/eth/EthResult.d.ts:415

The recipient address (or created contract address)

***

### type

> **type**: `string`

Defined in: packages/actions/types/eth/EthResult.d.ts:407

The type of call (CALL, DELEGATECALL, STATICCALL, CREATE, CREATE2)

***

### value?

> `optional` **value**: `bigint`

Defined in: packages/actions/types/eth/EthResult.d.ts:419

The value transferred

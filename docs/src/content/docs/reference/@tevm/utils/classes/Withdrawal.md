---
editUrl: false
next: false
prev: false
title: "Withdrawal"
---

Representation of EIP-4895 withdrawal data

## Constructors

### new Withdrawal()

> **new Withdrawal**(`index`, `validatorIndex`, `address`, `amount`): [`Withdrawal`](/reference/tevm/utils/classes/withdrawal/)

This constructor assigns and validates the values.
Use the static factory methods to assist in creating a Withdrawal object from varying data types.
Its amount is in Gwei to match CL representation and for eventual ssz withdrawalsRoot

#### Parameters

• **index**: `bigint`

• **validatorIndex**: `bigint`

• **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

• **amount**: `bigint`

withdrawal amount in Gwei to match the CL repesentation and eventually ssz withdrawalsRoot

#### Returns

[`Withdrawal`](/reference/tevm/utils/classes/withdrawal/)

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:40

## Properties

### address

> `readonly` **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:30

***

### amount

> `readonly` **amount**: `bigint`

withdrawal amount in Gwei to match the CL repesentation and eventually ssz withdrawalsRoot

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:34

***

### index

> `readonly` **index**: `bigint`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:28

***

### validatorIndex

> `readonly` **validatorIndex**: `bigint`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:29

## Methods

### raw()

> **raw**(): `WithdrawalBytes`

#### Returns

`WithdrawalBytes`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:53

***

### toJSON()

> **toJSON**(): `object`

#### Returns

`object`

##### address

> **address**: `string`

##### amount

> **amount**: `string`

##### index

> **index**: `string`

##### validatorIndex

> **validatorIndex**: `string`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:60

***

### toValue()

> **toValue**(): `object`

#### Returns

`object`

##### address

> **address**: `Uint8Array`

##### amount

> **amount**: `bigint`

##### index

> **index**: `bigint`

##### validatorIndex

> **validatorIndex**: `bigint`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:54

***

### fromValuesArray()

> `static` **fromValuesArray**(`withdrawalArray`): [`Withdrawal`](/reference/tevm/utils/classes/withdrawal/)

#### Parameters

• **withdrawalArray**: `WithdrawalBytes`

#### Returns

[`Withdrawal`](/reference/tevm/utils/classes/withdrawal/)

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:46

***

### fromWithdrawalData()

> `static` **fromWithdrawalData**(`withdrawalData`): [`Withdrawal`](/reference/tevm/utils/classes/withdrawal/)

#### Parameters

• **withdrawalData**: [`WithdrawalData`](/reference/tevm/utils/type-aliases/withdrawaldata/)

#### Returns

[`Withdrawal`](/reference/tevm/utils/classes/withdrawal/)

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:45

***

### toBytesArray()

> `static` **toBytesArray**(`withdrawal`): `WithdrawalBytes`

Convert a withdrawal to a buffer array

#### Parameters

• **withdrawal**: [`Withdrawal`](/reference/tevm/utils/classes/withdrawal/) \| [`WithdrawalData`](/reference/tevm/utils/type-aliases/withdrawaldata/)

the withdrawal to convert

#### Returns

`WithdrawalBytes`

buffer array of the withdrawal

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:52

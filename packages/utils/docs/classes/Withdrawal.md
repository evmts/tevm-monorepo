**@tevm/utils** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > Withdrawal

# Class: Withdrawal

Representation of EIP-4895 withdrawal data

## Constructors

### new Withdrawal(index, validatorIndex, address, amount)

> **new Withdrawal**(`index`, `validatorIndex`, `address`, `amount`): [`Withdrawal`](Withdrawal.md)

This constructor assigns and validates the values.
Use the static factory methods to assist in creating a Withdrawal object from varying data types.
Its amount is in Gwei to match CL representation and for eventual ssz withdrawalsRoot

#### Parameters

▪ **index**: `bigint`

▪ **validatorIndex**: `bigint`

▪ **address**: [`EthjsAddress`](EthjsAddress.md)

▪ **amount**: `bigint`

withdrawal amount in Gwei to match the CL repesentation and eventually ssz withdrawalsRoot

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:40

## Properties

### address

> **`readonly`** **address**: [`EthjsAddress`](EthjsAddress.md)

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:30

***

### amount

> **`readonly`** **amount**: `bigint`

withdrawal amount in Gwei to match the CL repesentation and eventually ssz withdrawalsRoot

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:34

***

### index

> **`readonly`** **index**: `bigint`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:28

***

### validatorIndex

> **`readonly`** **validatorIndex**: `bigint`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:29

## Methods

### raw()

> **raw**(): `WithdrawalBytes`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:53

***

### toJSON()

> **toJSON**(): `object`

#### Returns

> ##### address
>
> > **address**: `string`
>
> ##### amount
>
> > **amount**: `string`
>
> ##### index
>
> > **index**: `string`
>
> ##### validatorIndex
>
> > **validatorIndex**: `string`
>

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:60

***

### toValue()

> **toValue**(): `object`

#### Returns

> ##### address
>
> > **address**: `Uint8Array`
>
> ##### amount
>
> > **amount**: `bigint`
>
> ##### index
>
> > **index**: `bigint`
>
> ##### validatorIndex
>
> > **validatorIndex**: `bigint`
>

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:54

***

### fromValuesArray()

> **`static`** **fromValuesArray**(`withdrawalArray`): [`Withdrawal`](Withdrawal.md)

#### Parameters

▪ **withdrawalArray**: `WithdrawalBytes`

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:46

***

### fromWithdrawalData()

> **`static`** **fromWithdrawalData**(`withdrawalData`): [`Withdrawal`](Withdrawal.md)

#### Parameters

▪ **withdrawalData**: [`WithdrawalData`](../type-aliases/WithdrawalData.md)

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:45

***

### toBytesArray()

> **`static`** **toBytesArray**(`withdrawal`): `WithdrawalBytes`

Convert a withdrawal to a buffer array

#### Parameters

▪ **withdrawal**: [`Withdrawal`](Withdrawal.md) \| [`WithdrawalData`](../type-aliases/WithdrawalData.md)

the withdrawal to convert

#### Returns

buffer array of the withdrawal

#### Source

node\_modules/.pnpm/@ethereumjs+util@9.0.3/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:52

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)

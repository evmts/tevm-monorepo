[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / Withdrawal

# Class: Withdrawal

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:27

Representation of EIP-4895 withdrawal data

## Constructors

### Constructor

> **new Withdrawal**(`index`, `validatorIndex`, `address`, `amount`): `Withdrawal`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:40

This constructor assigns and validates the values.
Use the static factory methods to assist in creating a Withdrawal object from varying data types.
Its amount is in Gwei to match CL representation and for eventual ssz withdrawalsRoot

#### Parameters

##### index

`bigint`

##### validatorIndex

`bigint`

##### address

[`EthjsAddress`](EthjsAddress.md)

##### amount

`bigint`

withdrawal amount in Gwei to match the CL repesentation and eventually ssz withdrawalsRoot

#### Returns

`Withdrawal`

## Properties

### address

> `readonly` **address**: [`EthjsAddress`](EthjsAddress.md)

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:30

***

### amount

> `readonly` **amount**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:34

withdrawal amount in Gwei to match the CL repesentation and eventually ssz withdrawalsRoot

***

### index

> `readonly` **index**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:28

***

### validatorIndex

> `readonly` **validatorIndex**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:29

## Methods

### raw()

> **raw**(): `WithdrawalBytes`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:53

#### Returns

`WithdrawalBytes`

***

### toJSON()

> **toJSON**(): `object`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:60

#### Returns

`object`

##### address

> **address**: `` `0x${string}` ``

##### amount

> **amount**: `` `0x${string}` ``

##### index

> **index**: `` `0x${string}` ``

##### validatorIndex

> **validatorIndex**: `` `0x${string}` ``

***

### toValue()

> **toValue**(): `object`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:54

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

***

### fromValuesArray()

> `static` **fromValuesArray**(`withdrawalArray`): `Withdrawal`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:46

#### Parameters

##### withdrawalArray

`WithdrawalBytes`

#### Returns

`Withdrawal`

***

### fromWithdrawalData()

> `static` **fromWithdrawalData**(`withdrawalData`): `Withdrawal`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:45

#### Parameters

##### withdrawalData

[`WithdrawalData`](../type-aliases/WithdrawalData.md)

#### Returns

`Withdrawal`

***

### toBytesArray()

> `static` **toBytesArray**(`withdrawal`): `WithdrawalBytes`

Defined in: node\_modules/.pnpm/@ethereumjs+util@9.1.0/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:52

Convert a withdrawal to a buffer array

#### Parameters

##### withdrawal

the withdrawal to convert

`Withdrawal` | [`WithdrawalData`](../type-aliases/WithdrawalData.md)

#### Returns

`WithdrawalBytes`

buffer array of the withdrawal

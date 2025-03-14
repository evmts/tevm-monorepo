[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / Withdrawal

# Class: Withdrawal

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0-alpha.1/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:33

Representation of EIP-4895 withdrawal data

## Constructors

### new Withdrawal()

> **new Withdrawal**(`index`, `validatorIndex`, `address`, `amount`): [`Withdrawal`](Withdrawal.md)

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0-alpha.1/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:46

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

withdrawal amount in Gwei to match the CL representation and eventually ssz withdrawalsRoot

#### Returns

[`Withdrawal`](Withdrawal.md)

## Properties

### address

> `readonly` **address**: [`EthjsAddress`](EthjsAddress.md)

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0-alpha.1/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:36

***

### amount

> `readonly` **amount**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0-alpha.1/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:40

withdrawal amount in Gwei to match the CL representation and eventually ssz withdrawalsRoot

***

### index

> `readonly` **index**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0-alpha.1/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:34

***

### validatorIndex

> `readonly` **validatorIndex**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0-alpha.1/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:35

## Methods

### raw()

> **raw**(): `WithdrawalBytes`

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0-alpha.1/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:51

#### Returns

`WithdrawalBytes`

***

### toJSON()

> **toJSON**(): `object`

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0-alpha.1/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:58

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

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0-alpha.1/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:52

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

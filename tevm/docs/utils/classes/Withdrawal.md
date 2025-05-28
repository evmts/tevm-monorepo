[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [utils](../README.md) / Withdrawal

# Class: Withdrawal

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:33

Representation of EIP-4895 withdrawal data

## Constructors

### Constructor

> **new Withdrawal**(`index`, `validatorIndex`, `address`, `amount`): `Withdrawal`

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:43

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

#### Returns

`Withdrawal`

## Properties

### address

> `readonly` **address**: [`EthjsAddress`](EthjsAddress.md)

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:36

***

### amount

> `readonly` **amount**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:37

***

### index

> `readonly` **index**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:34

***

### validatorIndex

> `readonly` **validatorIndex**: `bigint`

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:35

## Methods

### raw()

> **raw**(): `WithdrawalBytes`

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:44

#### Returns

`WithdrawalBytes`

***

### toJSON()

> **toJSON**(): `object`

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:51

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

Defined in: node\_modules/.pnpm/@ethereumjs+util@10.0.0/node\_modules/@ethereumjs/util/dist/esm/withdrawal.d.ts:45

#### Returns

`object`

##### address

> **address**: `Uint8Array`\<`ArrayBufferLike`\>

##### amount

> **amount**: `bigint`

##### index

> **index**: `bigint`

##### validatorIndex

> **validatorIndex**: `bigint`
